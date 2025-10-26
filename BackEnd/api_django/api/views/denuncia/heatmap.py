from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from django.contrib.gis.geos import Polygon
from datetime import datetime
from api.models import Denuncia
from api.serializers.denuncia.heatmap import DenunciaHeatmapSerializer

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class DenunciaHeatmapList(ListAPIView):
    serializer_class = DenunciaHeatmapSerializer
    permission_classes = [AllowAny]
    pagination_class = None

    # parametros para documentação Swagger/OpenAPI
    bbox_param = openapi.Parameter(
        "bbox",
        openapi.IN_QUERY,
        description="Bounding box: minx,miny,maxx,maxy (lon,lat, EPSG:4326)",
        type=openapi.TYPE_STRING,
        required=False,
    )
    start_date_param = openapi.Parameter(
        "start_date",
        openapi.IN_QUERY,
        description="Data inicial (ISO-8601). Ex: 2025-10-01T00:00:00",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATETIME,
        required=False,
    )
    end_date_param = openapi.Parameter(
        "end_date",
        openapi.IN_QUERY,
        description="Data final (ISO-8601). Ex: 2025-10-31T23:59:59",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATETIME,
        required=False,
    )
    limit_param = openapi.Parameter(
        "limit",
        openapi.IN_QUERY,
        description="Limita número de pontos retornados",
        type=openapi.TYPE_INTEGER,
        required=False,
    )

    @swagger_auto_schema(
        tags=["Heatmap"],
        operation_description="Retorna lista leve de pontos para construir heatmap. Suporta filtros: bbox, start_date, end_date e limit.",
        manual_parameters=[bbox_param, start_date_param, end_date_param, limit_param],
        responses={200: DenunciaHeatmapSerializer(many=True)},
        operation_id="denuncia_heatmap_list",
    )
    def get(self, request, *args, **kwargs):
        """Rota GET documentada para retornar pontos do heatmap."""
        return super().get(request, *args, **kwargs)

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