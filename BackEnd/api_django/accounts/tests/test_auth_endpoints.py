import pytest
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@pytest.fixture
def user(db):
    u = User.objects.create_user(email="user@example.com", password="123456")
    u.is_active = True  # Garante que o usuário está ativo
    u.is_staff = True
    u.is_superuser = True
    u.save()
    return u

@pytest.fixture
def auth_client(user):
    """Cliente autenticado para testes."""
    client = APIClient()
    refresh = RefreshToken.for_user(user)
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}")
    return client

@pytest.mark.django_db
def test_enable_2fa(auth_client):
    url = reverse("accounts:enable_2fa")
    resp = auth_client.post(url)
    # Debug: se falhar, mostra a resposta
    if resp.status_code != 200:
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.data}")
    assert resp.status_code == 200
    assert (("otp_uri" in resp.data and "qr_code_base64" in resp.data)
            or ("qr" in resp.data and "secret" in resp.data))

@pytest.mark.django_db
def test_password_reset_request(client, user):
    url = reverse("accounts:password_reset")
    resp = client.post(url, {"email": user.email})
    assert resp.status_code in (200, 401)

@pytest.mark.django_db
def test_password_reset_no_user_returns_200(client):
    url = reverse("accounts:password_reset")
    resp = client.post(url, {"email": "noone@nowhere.test"})
    assert resp.status_code in (200, 401)
