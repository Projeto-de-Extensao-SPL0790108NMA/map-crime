# api/serializers/Denuncia/detail.py

from rest_framework import serializers

from api.models import Denuncia


class DenunciaDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = '__all__'  # ou lista de campos completa