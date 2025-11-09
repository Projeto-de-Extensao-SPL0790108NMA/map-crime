import pytest
from django.urls import reverse
from django.contrib.auth.models import Group, Permission


@pytest.fixture
def group_data():
    """Dados para criar um grupo."""
    return {
        "name": "TestGroup",
        "permissions": []
    }


@pytest.mark.django_db
class TestGroupCreate:
    """Testes para criação de grupos."""
    
    def test_create_group_requires_auth(self, client, group_data):
        """Testa que criação requer autenticação."""
        url = reverse("group-create")
        response = client.post(url, group_data, format="json")
        assert response.status_code == 401
    
    def test_create_group_authenticated(self, auth_client, group_data):
        """Testa criação por usuário autenticado com permissão."""
        url = reverse("group-create")
        response = auth_client.post(url, group_data, format="json")
        assert response.status_code == 201
        assert Group.objects.filter(name=group_data["name"]).exists()
        assert response.data["name"] == group_data["name"]
    
    def test_create_group_with_permissions(self, auth_client, db):
        """Testa criação de grupo com permissões."""
        # Pega algumas permissões
        permissions = Permission.objects.all()[:3]
        group_data = {
            "name": "GroupWithPerms",
            "permissions": [p.id for p in permissions]
        }
        url = reverse("group-create")
        response = auth_client.post(url, group_data, format="json")
        assert response.status_code == 201
        
        # Verifica que as permissões foram atribuídas
        group = Group.objects.get(name="GroupWithPerms")
        assert group.permissions.count() == 3
    
    def test_create_group_duplicate_name(self, auth_client, create_groups):
        """Testa criação com nome duplicado."""
        group_data = {"name": "Admin"}  # Já existe
        url = reverse("group-create")
        response = auth_client.post(url, group_data, format="json")
        assert response.status_code == 400


@pytest.mark.django_db
class TestGroupList:
    """Testes para listagem de grupos."""
    
    def test_list_groups_requires_auth(self, client):
        """Testa que listagem requer autenticação."""
        url = reverse("group-list")
        response = client.get(url)
        assert response.status_code == 401
    
    def test_list_groups_authenticated(self, auth_client, create_groups):
        """Testa listagem para usuário autenticado."""
        url = reverse("group-list")
        response = auth_client.get(url)
        assert response.status_code == 200
        assert len(response.data) >= 2  # Admin e User
        # Verifica que não inclui permissões na listagem (campos resumidos)
        assert all("permissions" not in item or item["permissions"] == [] for item in response.data)


@pytest.mark.django_db
class TestGroupDetail:
    """Testes para detalhamento de grupos."""
    
    def test_detail_group_requires_auth(self, client, create_groups):
        """Testa que detalhamento requer autenticação."""
        group = Group.objects.get(name="Admin")
        url = reverse("group-detail", kwargs={"pk": group.pk})
        response = client.get(url)
        assert response.status_code == 401
    
    def test_detail_group_authenticated(self, auth_client, create_groups):
        """Testa detalhamento por usuário autenticado."""
        group = Group.objects.get(name="Admin")
        url = reverse("group-detail", kwargs={"pk": group.pk})
        response = auth_client.get(url)
        assert response.status_code == 200
        assert response.data["id"] == group.id
        assert response.data["name"] == group.name
        # Detalhe deve incluir permissões
        assert "permissions" in response.data
    
    def test_detail_group_not_found(self, auth_client):
        """Testa acesso a grupo inexistente."""
        url = reverse("group-detail", kwargs={"pk": 99999})
        response = auth_client.get(url)
        assert response.status_code == 404


@pytest.mark.django_db
class TestGroupUpdate:
    """Testes para atualização de grupos."""
    
    def test_update_group_requires_auth(self, client, create_groups):
        """Testa que atualização requer autenticação."""
        group = Group.objects.get(name="User")
        url = reverse("group-update", kwargs={"pk": group.pk})
        data = {"name": "UpdatedUser"}
        response = client.patch(url, data, format="json")
        assert response.status_code == 401
    
    def test_update_group_authenticated(self, auth_client, create_groups):
        """Testa atualização por usuário autenticado."""
        group = Group.objects.create(name="TestGroup")
        url = reverse("group-update", kwargs={"pk": group.pk})
        data = {"name": "UpdatedGroup"}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 200
        assert response.data["name"] == "UpdatedGroup"
        
        # Verifica no banco
        group.refresh_from_db()
        assert group.name == "UpdatedGroup"
    
    def test_update_group_permissions(self, auth_client, db):
        """Testa atualização de permissões do grupo."""
        group = Group.objects.create(name="TestGroup")
        permissions = Permission.objects.all()[:2]
        
        url = reverse("group-update", kwargs={"pk": group.pk})
        data = {"permissions": [p.id for p in permissions]}
        response = auth_client.patch(url, data, format="json")
        assert response.status_code == 200
        
        # Verifica que as permissões foram atualizadas
        group.refresh_from_db()
        assert group.permissions.count() == 2


@pytest.mark.django_db
class TestGroupDelete:
    """Testes para exclusão de grupos."""
    
    def test_delete_group_requires_auth(self, client, create_groups):
        """Testa que exclusão requer autenticação."""
        group = Group.objects.create(name="DeleteGroup")
        url = reverse("group-delete", kwargs={"pk": group.pk})
        response = client.delete(url)
        assert response.status_code == 401
    
    def test_delete_group_authenticated(self, auth_client, db):
        """Testa exclusão por usuário autenticado."""
        group = Group.objects.create(name="DeleteGroup")
        url = reverse("group-delete", kwargs={"pk": group.pk})
        response = auth_client.delete(url)
        assert response.status_code == 204
        assert not Group.objects.filter(pk=group.pk).exists()
    
    def test_delete_group_not_found(self, auth_client):
        """Testa exclusão de grupo inexistente."""
        url = reverse("group-delete", kwargs={"pk": 99999})
        response = auth_client.delete(url)
        assert response.status_code == 404

