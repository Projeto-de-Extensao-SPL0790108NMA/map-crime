from rest_framework import serializers
from api.models import Denuncia

class DenunciaHeatmapSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    lat = serializers.SerializerMethodField()
    lng = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    weight = serializers.SerializerMethodField()

    class Meta:
        model = Denuncia
        fields = ("id", "name", "lat", "lng", "date", "weight")

    def get_name(self, obj):
        return getattr(obj, "nome", getattr(obj, "titulo", ""))

    def get_lat(self, obj):
        loc = getattr(obj, "localizacao", None)
        return None if not loc else round(loc.y, 6)

    def get_lng(self, obj):
        loc = getattr(obj, "localizacao", None)
        return None if not loc else round(loc.x, 6)

    def get_date(self, obj):
        dt = getattr(obj, "created_at", None) or getattr(obj, "created", None) or getattr(obj, "data", None)
        if dt is None:
            return None
        return dt.isoformat()

    def get_weight(self, obj):
        # default 1; você pode alterar para ponderar por severidade
        return getattr(obj, "peso", 1)