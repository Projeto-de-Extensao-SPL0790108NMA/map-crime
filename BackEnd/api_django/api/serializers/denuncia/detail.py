# api/serializers/Denuncia/detail.py

from rest_framework import serializers

from api.models import Denuncia
from api.serializers.user.detail import UserDetailSerializer


class DenunciaDetailSerializer(serializers.ModelSerializer):
    usuario = UserDetailSerializer(read_only=True)

    class Meta:
        model = Denuncia
        fields = '__all__'  # ou lista de campos completa
