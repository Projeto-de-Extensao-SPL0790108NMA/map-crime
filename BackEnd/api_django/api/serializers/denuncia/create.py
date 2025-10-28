# ...existing code...
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
        read_only_fields = ["id", "created_at", "updated_at", "localizacao"]

    def create(self, validated_data):
        lat = validated_data.pop("latitude")
        lon = validated_data.pop("longitude")
        validated_data["localizacao"] = Point(lon, lat, srid=4326)
        return super().create(validated_data)
