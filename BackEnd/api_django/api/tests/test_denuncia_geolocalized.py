import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from api.models import Denuncia

@pytest.fixture
def denuncia(db):
    return Denuncia.objects.create(
        categoria="Categoria Geo Teste",
        descricao="Descrição Geo Teste",
        localizacao="POINT(-46.57421 -23.57331)",
        status="em_analise"
    )

@pytest.mark.django_db
def test_denuncia_geolocalized_list_contains_geo_fields(auth_client, denuncia):
    url = reverse("denuncia_geolocalized_list")
    response = auth_client.get(url)
    assert response.status_code == 200
    results = response.data.get("results", [])
    assert isinstance(results, list)
    if results:
        item = results[0]
        assert "id" in item
        assert "latitude" in item
        assert "longitude" in item
        assert "descricao" in item
        assert item["descricao"] == denuncia.descricao

@pytest.mark.django_db
def test_denuncia_geolocalized_detail_returns_geo_fields(auth_client, denuncia):
    url = reverse("denuncia_geolocalized_detail", kwargs={"pk": denuncia.pk})
    response = auth_client.get(url)
    assert response.status_code == 200
    data = response.data
    assert "id" in data
    assert "latitude" in data
    assert "longitude" in data
    assert "descricao" in data
    # id pode ser UUID; manter consistência com outros testes do projeto
    assert data["id"] == str(denuncia.id)

@pytest.mark.django_db
def test_geolocalized_list_pagination_respects_page_size(auth_client):
    objs = [
        Denuncia(categoria=f"Cat {i}", descricao=f"Desc {i}", localizacao="POINT(-46.57421 -23.57331)", status="em_analise")
        for i in range(25)
    ]
    Denuncia.objects.bulk_create(objs)
    url = reverse("denuncia_geolocalized_list") + "?page_size=10"
    response = auth_client.get(url)
    assert response.status_code == 200
    assert "results" in response.data
    assert response.data.get("count") == 25
    assert len(response.data["results"]) == 10

@pytest.mark.django_db
def test_unauthenticated_access_is_denied_for_geolocalized_list():
    client = APIClient()
    url = reverse("denuncia_geolocalized_list")
    response = client.get(url)
    assert response.status_code in (401, 403)