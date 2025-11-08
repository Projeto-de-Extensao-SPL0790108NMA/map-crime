from rest_framework import serializers
from django.contrib.gis.geos import Point
from api.models import Denuncia

class DenunciaCreateSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField(write_only=True, required=True)
    longitude = serializers.FloatField(write_only=True, required=True)

    class Meta:
        model = Denuncia
        fields = [
            "id",
            "protocolo",
            "usuario",
            "categoria",
            "descricao",
            "localizacao",
            "latitude",
            "longitude",
            "midia",
            "audio",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "localizacao", "protocolo", "usuario"]

    def validate_latitude(self, value):
        """Valida que a latitude está no intervalo válido (-90 a 90)."""
        if not -90 <= value <= 90:
            raise serializers.ValidationError("Latitude deve estar entre -90 e 90 graus.")
        return value

    def validate_longitude(self, value):
        """Valida que a longitude está no intervalo válido (-180 a 180)."""
        if not -180 <= value <= 180:
            raise serializers.ValidationError("Longitude deve estar entre -180 e 180 graus.")
        return value

    def create(self, validated_data):
        lat = validated_data.pop("latitude")
        lon = validated_data.pop("longitude")
        validated_data["localizacao"] = Point(lon, lat, srid=4326)
        return super().create(validated_data)
