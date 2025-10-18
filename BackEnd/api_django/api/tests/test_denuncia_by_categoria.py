import pytest
from django.urls import reverse
from api.models import Denuncia

@pytest.mark.django_db
def test_denuncia_by_categoria_filters_using_url_param(auth_client):
    # dados de teste
    Denuncia.objects.create(categoria="Violencia", descricao="A", localizacao="POINT(-46 -23)", status="novo")
    Denuncia.objects.create(categoria="Furto", descricao="B", localizacao="POINT(-46 -23)", status="novo")
    Denuncia.objects.create(categoria="Violencia urbana", descricao="C", localizacao="POINT(-46 -23)", status="novo")

    url = reverse("denuncia_by_categoria", kwargs={"categoria": "Violencia"})
    response = auth_client.get(url)
    assert response.status_code == 200

    data = response.data
    results = data.get("results", data)
    # devem vir apenas as 2 denuncias com categoria contendo "Violencia"
    assert isinstance(results, list)
    assert len(results) == 2
    for item in results:
        assert "Violencia".lower() in item["categoria"].lower()

@pytest.mark.django_db
def test_denuncia_by_categoria_returns_empty_when_no_match(auth_client):
    Denuncia.objects.create(categoria="Assalto", descricao="X", localizacao="POINT(-46 -23)", status="novo")

    url = reverse("denuncia_by_categoria", kwargs={"categoria": "Inexistente"})
    response = auth_client.get(url)
    assert response.status_code == 200

    data = response.data
    results = data.get("results", data)
    assert isinstance(results, list)
    assert len(results) == 0

@pytest.mark.django_db
def test_unauthenticated_cannot_access_denuncia_by_categoria():
    client = None
    from rest_framework.test import APIClient
    client = APIClient()
    url = reverse("denuncia_by_categoria", kwargs={"categoria": "Violencia"})
    response = client.get(url)
    assert response.status_code in (401, 403)