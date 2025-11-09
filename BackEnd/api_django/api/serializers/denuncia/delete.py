# api/serializers/Denuncia/delete.py
from rest_framework import serializers

from api.models import Denuncia


class DenunciaDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = '__all__'  # apenas para documentação, mas não será usado