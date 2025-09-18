# api/serializers/Denuncia/update.py

from rest_framework import serializers
from api.models import Denuncia

class DenunciaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Denuncia
        fields = '__all__'  # apenas os campos que podem ser atualizados
