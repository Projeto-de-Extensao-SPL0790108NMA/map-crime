# api/serializers/Denuncia/create.py

from rest_framework import serializers
from api.models import Denuncia

class DenunciaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = '__all__'  # adapte os campos