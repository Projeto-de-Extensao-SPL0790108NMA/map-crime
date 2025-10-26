from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.contrib.gis.geos import Polygon
from datetime import datetime
from api.models import Denuncia
from api.serializers.denuncia.heatmap import DenunciaHeatmapSerializer

class DenunciaHeatmapList(ListAPIView):
    serializer_class = DenunciaHeatmapSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    def parse_date(self, s):
        try:
            return datetime.fromisoformat(s)
        except Exception:
            return None

    def get_queryset(self):
        qs = Denuncia.objects.all().only("id", "localizacao")  # carregue outros campos se necessário
        # filtro bbox: minx,miny,maxx,maxy
        bbox = self.request.query_params.get("bbox")
        if bbox:
            try:
                minx, miny, maxx, maxy = map(float, bbox.split(","))
                poly = Polygon.from_bbox((minx, miny, maxx, maxy))
                qs = qs.filter(localizacao__within=poly)
            except Exception:
                pass
        # filtro por datas (ISO-8601)
        start = self.parse_date(self.request.query_params.get("start_date", "") )
        end = self.parse_date(self.request.query_params.get("end_date", "") )
        if start:
            qs = qs.filter(created_at__gte=start) if hasattr(Denuncia, "created_at") else qs
        if end:
            qs = qs.filter(created_at__lte=end) if hasattr(Denuncia, "created_at") else qs
        # limitar quantidade
        limit = self.request.query_params.get("limit")
        if limit:
            try:
                limit = int(limit)
                if limit > 0:
                    qs = qs[:limit]
            except Exception:
                pass
        return qs