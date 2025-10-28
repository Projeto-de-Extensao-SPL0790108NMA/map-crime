from datetime import datetime, time

from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser
from api.models import Denuncia
from api.serializers import DenunciaListSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema


class CustomPagination(PageNumberPagination):
    page_size = 20  # Número de itens por página
    page_size_query_param = 'page_size'  # permite o uso de ?page_size=20 na URL
    max_page_size = 100  # limite máximo

class DenunciaListView(ListAPIView):
    """Lista todos os registros de Denuncia."""
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaListSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]
    pagination_class = CustomPagination  # 👈 Aqui tá a mágica

    status_param = openapi.Parameter(
        "status",
        openapi.IN_QUERY,
        description="Filtra denúncias pelo status. Utilize valores definidos em STATUS_CHOICES.",
        type=openapi.TYPE_STRING,
        required=False,
    )
    created_from_param = openapi.Parameter(
        "created_from",
        openapi.IN_QUERY,
        description="Filtra por data inicial de criação (ISO-8601). Aceita formatos YYYY-MM-DD ou YYYY-MM-DDThh:mm:ss.",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATETIME,
        required=False,
    )
    created_to_param = openapi.Parameter(
        "created_to",
        openapi.IN_QUERY,
        description="Filtra por data final de criação (ISO-8601). Aceita formatos YYYY-MM-DD ou YYYY-MM-DDThh:mm:ss.",
        type=openapi.TYPE_STRING,
        format=openapi.FORMAT_DATETIME,
        required=False,
    )

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Lista todos os registros de Denuncia.",
        responses={200: DenunciaListSerializer(many=True)},
        operation_id="denuncia_list",
        manual_parameters=[status_param, created_from_param, created_to_param],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()

        status_value = self.request.query_params.get("status")
        if status_value:
            queryset = queryset.filter(status=status_value)

        created_from_raw = self.request.query_params.get("created_from")
        created_to_raw = self.request.query_params.get("created_to")

        if created_from_raw:
            queryset = queryset.filter(
                created_at__gte=self._parse_datetime_param(created_from_raw, "created_from")
            )
        if created_to_raw:
            queryset = queryset.filter(
                created_at__lte=self._parse_datetime_param(created_to_raw, "created_to", is_end=True)
            )

        return queryset

    def _parse_datetime_param(self, raw_value, param_name, is_end=False):
        """Aceita data ou datetime e garante retorno timezone-aware."""
        parsed = parse_datetime(raw_value)
        if not parsed:
            day = parse_date(raw_value)
            if day:
                parsed = datetime.combine(day, time.max if is_end else time.min)
        if not parsed:
            raise ValidationError(
                {
                    param_name: "Formato inválido. Use ISO-8601 (YYYY-MM-DD ou YYYY-MM-DDThh:mm:ss)."
                }
            )
        if timezone.is_naive(parsed):
            parsed = timezone.make_aware(parsed, timezone.get_current_timezone())
        return parsed
