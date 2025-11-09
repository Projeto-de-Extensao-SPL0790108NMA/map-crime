from datetime import datetime, time
from typing import ClassVar

from django.contrib.gis.geos import Polygon
from django.utils import timezone
from django.utils.dateparse import parse_date as dj_parse_date
from django.utils.dateparse import parse_datetime
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny

from api.models import Denuncia
from api.serializers.denuncia.heatmap import DenunciaHeatmapSerializer


class DenunciaHeatmapList(ListAPIView):
    serializer_class = DenunciaHeatmapSerializer
    permission_classes: ClassVar = [AllowAny]
    pagination_class: ClassVar = None

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
        description="Data inicial (ISO-8601). Ex: 2025-10-01. Qualquer horário enviado será ignorado.",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATETIME,
        required=False,
    )
    end_date_param = openapi.Parameter(
        "end_date",
        openapi.IN_QUERY,
        description="Data final (ISO-8601). Ex: 2025-10-31. Qualquer horário enviado será ignorado.",
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

    def parse_date_param(self, raw_value):
        if not raw_value:
            return None

        parsed_dt = parse_datetime(raw_value)
        if parsed_dt:
            return parsed_dt.date()

        return dj_parse_date(raw_value)

    def get_queryset(self):
        qs = Denuncia.objects.all().only("id", "localizacao").order_by("-created_at")
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
        start = self.parse_date_param(self.request.query_params.get("start_date", ""))
        end = self.parse_date_param(self.request.query_params.get("end_date", ""))
        if start:
            start_dt = timezone.make_aware(
                datetime.combine(start, time.min),
                timezone.get_current_timezone(),
            )
            qs = qs.filter(created_at__gte=start_dt) if hasattr(Denuncia, "created_at") else qs
        if end:
            end_dt = timezone.make_aware(
                datetime.combine(end, time.max),
                timezone.get_current_timezone(),
            )
            qs = qs.filter(created_at__lte=end_dt) if hasattr(Denuncia, "created_at") else qs
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
