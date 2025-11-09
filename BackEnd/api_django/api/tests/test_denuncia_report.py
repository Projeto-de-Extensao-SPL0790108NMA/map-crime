from datetime import datetime, time, timedelta

import pytest
from django.contrib.gis.geos import Point
from django.urls import reverse
from django.utils import timezone

from api.models import Denuncia


def _detail_categories_from_csv(content: str):
    header = "Protocolo;Categoria;Status;Data de criação;Descrição"
    lines = [line.strip() for line in content.splitlines() if line.strip()]
    if header not in lines:
        return []
    idx = lines.index(header)
    categories = []
    for line in lines[idx + 1:]:
        parts = line.split(";")
        if len(parts) >= 2:
            categories.append(parts[1])
    return categories


def _start_boundary(date_value):
    tz = timezone.get_current_timezone()
    return timezone.make_aware(datetime.combine(date_value, time.min), tz)


@pytest.fixture
def sample_denuncias(db):
    base_point = Point(-46.6333, -23.5505, srid=4326)
    base_time = timezone.now()

    def create(offset_days: int, status: str, categoria: str):
        denuncia = Denuncia.objects.create(
            categoria=categoria,
            descricao=f"Descrição {categoria}",
            localizacao=base_point,
            status=status,
        )
        target_time = base_time + timedelta(days=offset_days)
        Denuncia.objects.filter(pk=denuncia.pk).update(created_at=target_time)
        denuncia.refresh_from_db()
        return denuncia

    return [
        create(-3, "em_analise", "Categoria A"),
        create(-1, "aprovado", "Categoria B"),
        create(0, "rejeitado", "Categoria C"),
    ]


@pytest.mark.django_db
class TestDenunciaReportView:
    def test_requires_authentication(self, client):
        url = reverse("denuncia-report")
        response = client.get(url)
        assert response.status_code == 401

    def test_returns_csv_by_default(self, auth_client, sample_denuncias):
        url = reverse("denuncia-report")
        response = auth_client.get(url)

        assert response.status_code == 200
        assert response["Content-Type"].startswith("text/csv")
        body = response.content.decode("utf-8")
        assert "Relatório de Denúncias" in body
        assert "Total de denúncias: 3" in body

    def test_filters_by_date_range(self, auth_client, sample_denuncias):
        url = reverse("denuncia-report")
        data_inicio = sample_denuncias[1].created_at.isoformat()
        response = auth_client.get(url, {"data_inicio": data_inicio})

        assert response.status_code == 200
        content = response.content.decode("utf-8")
        start_boundary = _start_boundary(sample_denuncias[1].created_at.date())
        expected_total = sum(1 for d in sample_denuncias if d.created_at >= start_boundary)
        assert f"Total de denúncias: {expected_total}" in content
        categorias = _detail_categories_from_csv(content)
        assert "Categoria A" not in categorias

    def test_supports_xlsx_and_docx(self, admin_client, sample_denuncias):
        url = reverse("denuncia-report")

        xlsx_response = admin_client.get(url, {"formato": "xlsx"})
        assert xlsx_response.status_code == 200
        assert (
            xlsx_response["Content-Type"]
            == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

        docx_response = admin_client.get(url, {"formato": "docs"})
        assert docx_response.status_code == 200
        assert (
            docx_response["Content-Type"]
            == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

    def test_filters_ignore_time_component(self, auth_client, sample_denuncias):
        """Mesmo com horário no parâmetro, filtro considera o dia inteiro."""
        url = reverse("denuncia-report")
        start_date = sample_denuncias[1].created_at.date().isoformat()
        response = auth_client.get(url, {"data_inicio": f"{start_date}T23:59:59"})

        assert response.status_code == 200
        content = response.content.decode("utf-8")
        categorias = set(_detail_categories_from_csv(content))
        expected_boundary = _start_boundary(sample_denuncias[1].created_at.date())
        expected = {
            d.categoria for d in sample_denuncias if d.created_at >= expected_boundary
        }
        assert categorias == expected

    def test_global_totals_section_present_with_filters(self, auth_client, sample_denuncias):
        """Relatório filtrado deve conter seção geral por status."""
        url = reverse("denuncia-report")
        filtered_start = sample_denuncias[2].created_at.isoformat()
        response = auth_client.get(url, {"data_inicio": filtered_start})
        assert response.status_code == 200

        content = response.content.decode("utf-8")
        assert "Totais por status (intervalo)" in content
        assert "Totais por status (geral)" in content
        assert "Em análise" in content
        assert "Aprovado" in content
        assert "Rejeitado" in content

    def test_invalid_format_returns_400(self, auth_client):
        url = reverse("denuncia-report")
        response = auth_client.get(url, {"formato": "txt"})

        assert response.status_code == 400
        assert "formato" in response.data

    def test_invalid_date_param(self, auth_client):
        url = reverse("denuncia-report")
        response = auth_client.get(url, {"data_inicio": "31-12-2024"})

        assert response.status_code == 400
        assert "data_inicio" in response.data

    def test_start_date_greater_than_end_returns_400(self, auth_client, sample_denuncias):
        url = reverse("denuncia-report")
        start = sample_denuncias[2].created_at.isoformat()
        end = sample_denuncias[0].created_at.isoformat()

        response = auth_client.get(url, {"data_inicio": start, "data_fim": end})

        assert response.status_code == 400
        assert "detail" in response.data
