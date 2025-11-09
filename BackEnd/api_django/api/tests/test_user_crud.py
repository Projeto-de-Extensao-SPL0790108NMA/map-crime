import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse

User = get_user_model()


@pytest.fixture
def user_data():
    """Dados para criar um usuário."""
    return {
        "email": "novo@example.com",
        "name": "Novo Usuário",
        "password": "senha123456",
        "is_active": True,
        "is_staff": False
    }


@pytest.mark.django_db
class TestUserCreate:
    """Testes para criação de usuários."""
    
    def test_create_user_requires_auth(self, client, user_data):
        """Testa que criação requer autenticação."""
        url = reverse("user-create")
        response = client.post(url, user_data, format="json")
        assert response.status_code == 401
    
    def test_create_user_authenticated(self, auth_client, user_data):
        """Testa criação por usuário autenticado com permissão."""
        url = reverse("user-create")
        response = auth_client.post(url, user_data, format="json")
        assert response.status_code == 201
        assert User.objects.filter(email=user_data["email"]).exists()
        assert response.data["email"] == user_data["email"]
        # Senha não deve estar na resposta
        assert "password" not in response.data
    
    def test_create_user_missing_required_fields(self, auth_client):
        """Testa criação sem campos obrigatórios."""
        url = reverse("user-create")
        data = {"email": "test@example.com"}
        response = auth_client.post(url, data, format="json")
        assert response.status_code == 400
    
    def test_create_user_duplicate_email(self, auth_client, user, user_data):
        """Testa criação com email duplicado."""
        user_data["email"] = user.email
        url = reverse("user-create")
        response = auth_client.post(url, user_data, format="json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestUserList:
    """Testes para listagem de usuários."""
    
    def test_list_users_requires_auth(self, client):
        """Testa que listagem requer autenticação."""
        url = reverse("user-list")
        response = client.get(url)
        assert response.status_code == 401
    
    def test_list_users_authenticated(self, auth_client, user):
        """Testa listagem para usuário autenticado."""
        url = reverse("user-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data) >= 1
        # Verifica que password não está nos dados
        assert all("password" not in item for item in response.data)
    
    def test_list_users_multiple(self, auth_client, db, create_groups):
        """Testa listagem com múltiplos usuários."""
        User.objects.create_user(email="user1@example.com", password="123456")
        User.objects.create_user(email="user2@example.com", password="123456")
        
        url = reverse("user-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data) >= 2


@pytest.mark.django_db
class TestUserDetail:
    """Testes para detalhamento de usuários."""
    
    def test_detail_user_requires_auth(self, client, user):
        """Testa que detalhamento requer autenticação."""
        url = reverse("user-detail", kwargs={"pk": user.pk})
        response = client.get(url)
        assert response.status_code == 401
    
    def test_detail_user_authenticated(self, auth_client, user):
        """Testa detalhamento por usuário autenticado."""
        url = reverse("user-detail", kwargs={"pk": user.pk})
        response = auth_client.get(url)
        assert response.status_code == 200
        assert response.data["id"] == user.id
        assert response.data["email"] == user.email
        assert "password" not in response.data
    
    def test_detail_user_not_found(self, auth_client):
        """Testa acesso a usuário inexistente."""
        url = reverse("user-detail", kwargs={"pk": 99999})
        response = auth_client.get(url)
        assert response.status_code == 404


@pytest.mark.django_db
class TestUserUpdate:
    """Testes para atualização de usuários."""
    
    def test_update_user_requires_auth(self, client, user):
        """Testa que atualização requer autenticação."""
        url = reverse("user-update", kwargs={"pk": user.pk})
        data = {"name": "Nome Atualizado"}
        response = client.patch(url, data, format="json")
        assert response.status_code == 401
    
    def test_update_user_authenticated(self, auth_client, user):
        """Testa atualização por usuário autenticado."""
        url = reverse("user-update", kwargs={"pk": user.pk})
        data = {"name": "Nome Atualizado", "is_active": False}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 200
        assert response.data["name"] == "Nome Atualizado"
        
        # Verifica no banco
        user.refresh_from_db()
        assert user.name == "Nome Atualizado"
    
    def test_update_user_password(self, auth_client, user):
        """Testa atualização de senha."""
        old_password_hash = user.password
        url = reverse("user-update", kwargs={"pk": user.pk})
        data = {"password": "nova_senha123"}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 200
        
        # Verifica que a senha foi alterada
        user.refresh_from_db()
        assert user.password != old_password_hash
        # Verifica que a nova senha funciona
        assert user.check_password("nova_senha123")


@pytest.mark.django_db
class TestUserDelete:
    """Testes para exclusão de usuários."""
    
    def test_delete_user_requires_auth(self, client, user):
        """Testa que exclusão requer autenticação."""
        url = reverse("user-delete", kwargs={"pk": user.pk})
        response = client.delete(url)
        assert response.status_code == 401
    
    def test_delete_user_authenticated(self, auth_client, db, create_groups):
        """Testa exclusão por usuário autenticado."""
        # Cria um usuário para deletar
        user_to_delete = User.objects.create_user(
            email="delete@example.com",
            password="123456"
        )
        url = reverse("user-delete", kwargs={"pk": user_to_delete.pk})
        response = auth_client.delete(url)
        assert response.status_code == 204
        assert not User.objects.filter(pk=user_to_delete.pk).exists()
    
    def test_delete_user_not_found(self, auth_client):
        """Testa exclusão de usuário inexistente."""
        url = reverse("user-delete", kwargs={"pk": 99999})
        response = auth_client.delete(url)
        assert response.status_code == 404

