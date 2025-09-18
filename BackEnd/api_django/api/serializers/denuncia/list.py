# api/serializers/Denuncia/list.py

from rest_framework import serializers
from api.models import Denuncia

class DenunciaListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = '__all__'  # campos resumidos para listagem