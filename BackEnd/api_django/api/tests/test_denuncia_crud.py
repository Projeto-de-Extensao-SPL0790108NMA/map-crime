from datetime import timedelta

import pytest
from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.urls import reverse
from django.utils import timezone

from api.choice import StatusChoices
from api.models import Denuncia

User = get_user_model()


@pytest.fixture
def denuncia_data():
    """Dados para criar uma denúncia."""
    return {
        "categoria": "Vandalismo",
        "descricao": "Grafite em parede pública",
        "latitude": -23.5505,
        "longitude": -46.6333,
        "status": "em_analise"
    }


@pytest.fixture
def denuncia(db, denuncia_data):
    """Cria uma denúncia de teste."""
    location = Point(denuncia_data["longitude"], denuncia_data["latitude"], srid=4326)
    return Denuncia.objects.create(
        categoria=denuncia_data["categoria"],
        descricao=denuncia_data["descricao"],
        localizacao=location,
        status=denuncia_data["status"]
    )


@pytest.fixture
def denuncia_with_user(db, denuncia_data, user):
    """Cria denúncia associada a um usuário."""
    location = Point(denuncia_data["longitude"], denuncia_data["latitude"], srid=4326)
    return Denuncia.objects.create(
        categoria=denuncia_data["categoria"],
        descricao=denuncia_data["descricao"],
        localizacao=location,
        status=denuncia_data["status"],
        usuario=user,
    )


@pytest.mark.django_db
class TestDenunciaCreate:
    """Testes para criação de denúncias."""
    
    def test_create_denuncia_anonymous(self, client, denuncia_data):
        """Testa criação de denúncia por usuário anônimo (AllowAny)."""
        url = reverse("denuncia_create")
        response = client.post(url, denuncia_data, format="json")
        assert response.status_code == 201
        assert Denuncia.objects.count() == 1
        assert response.data["categoria"] == denuncia_data["categoria"]
        assert "protocolo" in response.data
    
    def test_create_denuncia_with_auth(self, auth_client, denuncia_data):
        """Testa criação de denúncia por usuário autenticado."""
        url = reverse("denuncia_create")
        response = auth_client.post(url, denuncia_data, format="json")
        assert response.status_code == 201
        assert Denuncia.objects.count() == 1
    
    def test_create_denuncia_missing_required_fields(self, client):
        """Testa criação sem campos obrigatórios."""
        url = reverse("denuncia_create")
        data = {"categoria": "Teste"}
        response = client.post(url, data, format="json")
        assert response.status_code == 400
    
    def test_create_denuncia_invalid_coordinates(self, client):
        """Testa criação com coordenadas inválidas."""
        url = reverse("denuncia_create")
        data = {
            "categoria": "Teste",
            "descricao": "Teste",
            "latitude": 200,  # Latitude inválida
            "longitude": -46.6333
        }
        response = client.post(url, data, format="json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestDenunciaList:
    """Testes para listagem de denúncias."""
    
    def test_list_denuncias_requires_auth(self, client):
        """Testa que listagem requer autenticação."""
        url = reverse("denuncia_list")
        response = client.get(url)
        assert response.status_code == 401
    
    def test_list_denuncias_authenticated(self, auth_client, denuncia):
        """Testa listagem para usuário autenticado."""
        url = reverse("denuncia_list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data["results"]) == 1
    
    def test_list_denuncias_filter_by_status(self, auth_client, db):
        """Testa filtro por status."""
        # Cria denúncias com status diferentes
        location = Point(-46.6333, -23.5505, srid=4326)
        Denuncia.objects.create(
            categoria="Teste 1",
            descricao="Descrição 1",
            localizacao=location,
            status="em_analise"
        )
        Denuncia.objects.create(
            categoria="Teste 2",
            descricao="Descrição 2",
            localizacao=location,
            status="rejeitado"
        )
        
        url = reverse("denuncia_list")
        response = auth_client.get(url, {"status": "em_analise"})
        assert response.status_code == 200
        assert all(item["status"] == "em_analise" for item in response.data["results"])
    
    def test_list_denuncias_filter_by_categoria(self, auth_client, db):
        """Testa filtro por categoria."""
        location = Point(-46.6333, -23.5505, srid=4326)
        Denuncia.objects.create(
            categoria="Vandalismo",
            descricao="Descrição",
            localizacao=location
        )
        Denuncia.objects.create(
            categoria="Assalto",
            descricao="Descrição",
            localizacao=location
        )
        
        url = reverse("denuncia_list")
        response = auth_client.get(url, {"categoria": "Vandalismo"})
        assert response.status_code == 200
        assert all(item["categoria"] == "Vandalismo" for item in response.data["results"])
    
    def test_list_denuncias_pagination(self, auth_client, db):
        """Testa paginação da listagem."""
        location = Point(-46.6333, -23.5505, srid=4326)
        # Cria mais de 20 denúncias (page_size padrão)
        for i in range(25):
            Denuncia.objects.create(
                categoria=f"Categoria {i}",
                descricao=f"Descrição {i}",
                localizacao=location
            )
        
        url = reverse("denuncia_list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert "results" in response.data
        assert "count" in response.data
        assert len(response.data["results"]) <= 20


@pytest.mark.django_db
class TestDenunciaDetail:
    """Testes para detalhamento de denúncias."""
    
    def test_detail_denuncia_anonymous(self, client, denuncia):
        """Testa acesso a detalhes por usuário anônimo (AllowAny)."""
        url = reverse("denuncia_detail", kwargs={"pk": denuncia.pk})
        response = client.get(url)
        assert response.status_code == 200
        assert response.data["id"] == str(denuncia.id)
        assert response.data["protocolo"] == denuncia.protocolo
    
    def test_detail_denuncia_not_found(self, client):
        """Testa acesso a denúncia inexistente."""
        from uuid import uuid4
        url = reverse("denuncia_detail", kwargs={"pk": uuid4()})
        response = client.get(url)
        assert response.status_code == 404

    def test_detail_denuncia_by_protocolo(self, client, denuncia):
        """Permite buscar denúncia usando o protocolo público."""
        url = reverse("denuncia_detail_protocolo", kwargs={"protocolo": denuncia.protocolo})
        response = client.get(url)
        assert response.status_code == 200
        assert response.data["id"] == str(denuncia.id)
        assert response.data["protocolo"] == denuncia.protocolo

    def test_detail_denuncia_includes_user_payload(self, client, denuncia_with_user):
        """Retorna dados do usuário vinculado."""
        url = reverse("denuncia_detail", kwargs={"pk": denuncia_with_user.pk})
        response = client.get(url)
        assert response.status_code == 200
        usuario = response.data["usuario"]
        assert usuario["id"] == denuncia_with_user.usuario.id
        assert usuario["email"] == denuncia_with_user.usuario.email


@pytest.mark.django_db
class TestDenunciaUpdate:
    """Testes para atualização de denúncias."""
    
    def test_update_denuncia_requires_auth(self, client, denuncia):
        """Testa que atualização requer autenticação."""
        url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        data = {"categoria": "Atualizada"}
        response = client.patch(url, data, format="json")
        assert response.status_code == 401
    
    def test_update_denuncia_authenticated(self, auth_client, denuncia):
        """Testa atualização por usuário autenticado."""
        url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        data = {"categoria": "Categoria Atualizada", "status": "rejeitado"}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 200
        assert response.data["categoria"] == "Categoria Atualizada"
        assert response.data["status"] == "rejeitado"
        
        # Verifica no banco
        denuncia.refresh_from_db()
        assert denuncia.categoria == "Categoria Atualizada"
    
    def test_update_denuncia_usuario_requires_admin(self, auth_client, denuncia, admin_user):
        """Testa que alterar campo usuario requer permissão de admin."""
        url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        data = {"usuario": admin_user.id}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 403  # PermissionDenied
    
    def test_update_denuncia_usuario_as_admin(self, admin_client, denuncia, admin_user):
        """Testa que admin pode alterar campo usuario."""
        url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        data = {"usuario": admin_user.id}
        response = admin_client.patch(url, data, format="json")
        assert response.status_code == 200
        assert response.data["usuario"] == admin_user.id
    
    def test_update_denuncia_protocolo_readonly(self, auth_client, denuncia):
        """Testa que protocolo é somente leitura."""
        original_protocolo = denuncia.protocolo
        url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        data = {"protocolo": "NOVO_PROTOCOLO"}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 200
        # Protocolo não deve mudar
        denuncia.refresh_from_db()
        assert denuncia.protocolo == original_protocolo


@pytest.mark.django_db
class TestDenunciaDelete:
    """Testes para exclusão de denúncias."""
    
    def test_delete_denuncia_requires_auth(self, client, denuncia):
        """Testa que exclusão requer autenticação."""
        url = reverse("denuncia_delete", kwargs={"pk": denuncia.pk})
        response = client.delete(url)
        assert response.status_code == 401
    
    def test_delete_denuncia_requires_permission(self, auth_client, denuncia):
        """Testa que exclusão requer permissão (IsAdmin | IsUser)."""
        url = reverse("denuncia_delete", kwargs={"pk": denuncia.pk})
        response = auth_client.delete(url)
        # auth_client já tem permissão (IsUser)
        assert response.status_code == 204
        assert not Denuncia.objects.filter(pk=denuncia.pk).exists()


@pytest.mark.django_db
class TestDenunciaHistoryDashboard:
    """Testes para o endpoint de histórico/dashboard."""

    def test_history_requires_auth(self, client, denuncia):
        url = reverse("denuncia_history", kwargs={"pk": denuncia.pk})
        response = client.get(url)
        assert response.status_code == 401

    def test_history_records_status_change(self, auth_client, denuncia):
        url_update = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        response = auth_client.patch(url_update, {"status": "aprovado"}, format="json")
        assert response.status_code == 200

        url_history = reverse("denuncia_history", kwargs={"pk": denuncia.pk})
        history_response = auth_client.get(url_history)
        assert history_response.status_code == 200
        assert history_response.data[0]["field"] == "status"
        assert history_response.data[0]["new_value"] == "aprovado"

    def test_dashboard_metrics(self, admin_client):
        now = timezone.localtime()
        current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_end = current_month - timedelta(seconds=1)
        last_month_start = last_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        Denuncia.objects.create(
            categoria="Atual",
            descricao="Teste",
            localizacao=Point(-46, -23, srid=4326),
            status=StatusChoices.EM_ANALISE,
            created_at=current_month + timedelta(days=1),
            updated_at=current_month + timedelta(days=1),
        )
        Denuncia.objects.create(
            categoria="Resolvida",
            descricao="Teste",
            localizacao=Point(-46, -23, srid=4326),
            status=StatusChoices.APROVADO,
            created_at=current_month + timedelta(days=2),
            updated_at=current_month + timedelta(days=2),
        )
        Denuncia.objects.create(
            categoria="Rejeitada",
            descricao="Antiga",
            localizacao=Point(-46, -23, srid=4326),
            status=StatusChoices.REJEITADO,
            created_at=last_month_start + timedelta(days=5),
            updated_at=last_month_start + timedelta(days=5),
        )

        url = reverse("denuncia_dashboard")
        response = admin_client.get(url)
        assert response.status_code == 200
        metrics = response.data["metrics"]
        assert metrics["totalReports"] == 3
        assert metrics["reportsByStatus"]["rejected"] >= 1
    
    def test_delete_denuncia_as_admin(self, admin_client, denuncia):
        """Testa exclusão por admin."""
        url = reverse("denuncia_delete", kwargs={"pk": denuncia.pk})
        response = admin_client.delete(url)
        assert response.status_code == 204
        assert not Denuncia.objects.filter(pk=denuncia.pk).exists()


@pytest.mark.django_db
class TestDenunciaHistory:
    """Testes para o endpoint de histórico de alterações de denúncias."""

    def test_history_requires_auth(self, client, denuncia):
        url = reverse("denuncia_history", kwargs={"pk": denuncia.pk})
        response = client.get(url)
        assert response.status_code == 401

    def test_history_records_status_change(self, auth_client, denuncia):
        url_update = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        response = auth_client.patch(url_update, {"status": "aprovado"}, format="json")
        assert response.status_code == 200

        url_history = reverse("denuncia_history", kwargs={"pk": denuncia.pk})
        history_response = auth_client.get(url_history)
        assert history_response.status_code == 200
        assert len(history_response.data) >= 1
        entry = history_response.data[0]
        assert entry["field"] == "status"
        assert entry["old_value"] == "em_analise"
        assert entry["new_value"] == "aprovado"
        assert entry["user"]["email"] == "user@example.com"

    def test_history_records_usuario_change(self, admin_client, denuncia, admin_user):
        url_update = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
        response = admin_client.patch(url_update, {"usuario": admin_user.pk}, format="json")
        assert response.status_code == 200

        url_history = reverse("denuncia_history", kwargs={"pk": denuncia.pk})
        history_response = admin_client.get(url_history)
        assert history_response.status_code == 200
        usuario_entries = [item for item in history_response.data if item["field"] == "usuario"]
        assert usuario_entries, "Histórico não retornou alteração do campo usuario"
        entry = usuario_entries[0]
        assert entry["new_value"]["email"] == admin_user.email
        assert entry["user"]["email"] == admin_user.email
