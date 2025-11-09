from datetime import datetime, time, timedelta

import pytest
from django.contrib.gis.geos import Point
from django.urls import reverse
from django.utils import timezone

from api.models import Denuncia


@pytest.fixture
def denuncias_for_heatmap(db):
    """Cria múltiplas denúncias para teste de heatmap."""
    locations = [
        Point(-46.6333, -23.5505, srid=4326),  # São Paulo
        Point(-46.6333, -23.5506, srid=4326),  # Próximo
        Point(-46.6334, -23.5505, srid=4326),  # Próximo
        Point(-43.1729, -22.9068, srid=4326),  # Rio de Janeiro (longe)
    ]
    
    now = timezone.now()
    denuncias = []
    for i, location in enumerate(locations):
        denuncia = Denuncia.objects.create(
            categoria=f"Categoria {i}",
            descricao=f"Descrição {i}",
            localizacao=location,
        )
        target_time = now - timedelta(days=i)
        Denuncia.objects.filter(pk=denuncia.pk).update(created_at=target_time)
        denuncia.refresh_from_db()
        denuncias.append(denuncia)
    
    return denuncias


@pytest.mark.django_db
class TestDenunciaHeatmap:
    """Testes para endpoint de heatmap de denúncias."""
    
    def test_heatmap_anonymous_access(self, client, denuncias_for_heatmap):
        """Testa que heatmap permite acesso anônimo (AllowAny)."""
        url = reverse("denuncia-heatmap")
        response = client.get(url)
        assert response.status_code == 200
        assert isinstance(response.data, list)
        assert len(response.data) == 4
    
    def test_heatmap_returns_location_data(self, client, denuncias_for_heatmap):
        """Testa que heatmap retorna dados de localização."""
        url = reverse("denuncia-heatmap")
        response = client.get(url)
        assert response.status_code == 200
        
        # Verifica estrutura dos dados (serializer retorna lat, lng, não localizacao.latitude)
        for item in response.data:
            assert "id" in item
            assert "lat" in item
            assert "lng" in item
            assert "categoria" in item
            assert "date" in item
            assert "weight" in item
    
    def test_heatmap_filter_by_bbox(self, client, denuncias_for_heatmap):
        """Testa filtro por bounding box."""
        # bbox para área de São Paulo (aproximadamente)
        # minx, miny, maxx, maxy (lon, lat)
        bbox = "-46.64,-23.56,-46.62,-23.54"
        url = reverse("denuncia-heatmap")
        response = client.get(url, {"bbox": bbox})
        assert response.status_code == 200
        # Deve retornar apenas as denúncias dentro do bbox (3 de SP)
        assert len(response.data) == 3
    
    def test_heatmap_filter_by_date_range(self, client, denuncias_for_heatmap):
        """Testa filtro por intervalo de datas."""
        now = timezone.now()
        start_date = (now - timedelta(days=2)).isoformat()
        end_date = (now + timedelta(days=1)).isoformat()
        
        url = reverse("denuncia-heatmap")
        response = client.get(url, {
            "start_date": start_date,
            "end_date": end_date
        })
        assert response.status_code == 200
        # Deve retornar denúncias no intervalo
        assert len(response.data) >= 2
    
    def test_heatmap_limit(self, client, denuncias_for_heatmap):
        """Testa limite de resultados."""
        url = reverse("denuncia-heatmap")
        response = client.get(url, {"limit": "2"})
        assert response.status_code == 200
        assert len(response.data) == 2
        # Deve retornar mais recentes pelo campo created_at
        categorias = [item["categoria"] for item in response.data]
        expected = [
            d.categoria
            for d in sorted(denuncias_for_heatmap, key=lambda d: d.created_at, reverse=True)[:2]
        ]
        assert categorias == expected

    def test_heatmap_date_filter_ignores_time(self, client, denuncias_for_heatmap):
        """Mesmo com horário indicado, filtro deve considerar todo o dia."""
        # Usa created_at do item de índice 2
        target_date = denuncias_for_heatmap[2].created_at.date().isoformat()
        url = reverse("denuncia-heatmap")
        response = client.get(url, {"start_date": f"{target_date}T23:59:59"})

        assert response.status_code == 200
        categorias = {item["categoria"] for item in response.data}
        tz = timezone.get_current_timezone()
        start_boundary = timezone.make_aware(
            datetime.combine(denuncias_for_heatmap[2].created_at.date(), time.min),
            tz,
        )
        expected = {
            d.categoria for d in denuncias_for_heatmap if d.created_at >= start_boundary
        }
        assert categorias == expected
    
    def test_heatmap_invalid_bbox(self, client, denuncias_for_heatmap):
        """Testa bbox inválido (deve ignorar e retornar todos)."""
        url = reverse("denuncia-heatmap")
        response = client.get(url, {"bbox": "invalid"})
        assert response.status_code == 200
        # Deve retornar todos (ignora bbox inválido)
        assert len(response.data) == 4
    
    def test_heatmap_combined_filters(self, client, denuncias_for_heatmap):
        """Testa combinação de filtros."""
        now = timezone.now()
        start_date = (now - timedelta(days=5)).isoformat()
        bbox = "-46.64,-23.56,-46.62,-23.54"
        
        url = reverse("denuncia-heatmap")
        response = client.get(url, {
            "bbox": bbox,
            "start_date": start_date,
            "limit": "10"
        })
        assert response.status_code == 200
        # Deve aplicar todos os filtros
        assert len(response.data) <= 10
