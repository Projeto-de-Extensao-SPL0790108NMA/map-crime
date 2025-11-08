# api/serializers/Denuncia/update.py

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from api.models import Denuncia
from accounts.permissions.groups import IsAdmin
from .utils import enforce_file_upload_limit

class DenunciaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = [
            "id", "protocolo", "usuario", "categoria", "descricao",
            "localizacao", "midia", "audio", "status", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "protocolo", "localizacao"]

    def validate(self, attrs):
        enforce_file_upload_limit(self)
        return super().validate(attrs)
    
    def update(self, instance, validated_data):
        request = self.context.get("request")
        # Verifica se o campo 'usuario' está sendo alterado
        if "usuario" in validated_data and validated_data["usuario"] != instance.usuario:
            if not request or not request.user:
                raise PermissionDenied("Você precisa estar autenticado para alterar o campo 'usuario'.")
            # Reutiliza a lógica da classe IsAdmin
            permission_check = IsAdmin()
            if not permission_check.has_permission(request, None):
                raise PermissionDenied("Somente administradores podem alterar o campo 'usuario'.")
        
        return super().update(instance, validated_data)
