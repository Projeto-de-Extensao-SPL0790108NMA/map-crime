import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from api.models import Denuncia
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


@pytest.fixture
def denuncia():
    return Denuncia.objects.create(
        categoria="Categoria Teste",
        descricao="Descrição Teste",
        localizacao="POINT(-46.57421 -23.57331)",
        status="em_analise"
    )

# ===============================
# TESTES DO CRUD DE DENUNCIA
# ===============================

@pytest.mark.django_db
def test_create_denuncia(auth_client):
    url = reverse("denuncia_create")
    data = {
        "categoria": "Nova Categoria",
        "descricao": "Nova descrição",
        "localizacao": "POINT(-46.57421 -23.57331)",
        "status": "em_analise"
    }
    response = auth_client.post(url, data)
    assert response.status_code == 201
    assert response.data["categoria"] == "Nova Categoria"

@pytest.mark.django_db
def test_list_denuncia(auth_client, denuncia):
    url = reverse("denuncia_list")
    response = auth_client.get(url)
    assert response.status_code == 200
    assert isinstance(response.data["results"], list)

@pytest.mark.django_db
def test_detail_denuncia(auth_client, denuncia):
    url = reverse("denuncia_detail", kwargs={"pk": denuncia.pk})
    response = auth_client.get(url)
    assert response.status_code == 200
    assert response.data["id"] == str(denuncia.id)

@pytest.mark.django_db
def test_partial_update_denuncia(auth_client, denuncia):
    url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
    data = {"descricao": "Alterada"}
    response = auth_client.patch(url, data)
    assert response.status_code == 200
    assert response.data["descricao"] == "Alterada"

@pytest.mark.django_db
def test_update_denuncia(auth_client, denuncia):
    url = reverse("denuncia_update", kwargs={"pk": denuncia.pk})
    data = {
        "categoria": "Atualizada",
        "descricao": "Descrição Atualizada",
        "localizacao": "POINT(-46.57421 -23.57331)",
        "status": "aprovado"
    }
    response = auth_client.put(url, data)
    assert response.status_code == 200
    assert response.data["categoria"] == "Atualizada"
    assert response.data["status"] == "aprovado"

@pytest.mark.django_db
def test_delete_denuncia(auth_client, denuncia):
    url = reverse("denuncia_delete", kwargs={"pk": denuncia.pk})
    response = auth_client.delete(url)
    assert response.status_code == 204
    assert not Denuncia.objects.filter(pk=denuncia.pk).exists()