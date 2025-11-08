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
    queryset = Denuncia.objects.all().order_by('-created_at')  # Ordena por data de criação (mais recente primeiro)
    serializer_class = DenunciaListSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]
    pagination_class = CustomPagination

    status_param = openapi.Parameter(
        "status",
        openapi.IN_QUERY,
        description="Filtra denúncias pelo status. Utilize valores definidos em STATUS_CHOICES.",
        type=openapi.TYPE_STRING,
        required=False,
    )
    categoria_param = openapi.Parameter(
        "categoria",
        openapi.IN_QUERY,
        description="Filtra denúncias pela categoria (correspondência exata, case-insensitive).",
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
        manual_parameters=[status_param, categoria_param, created_from_param, created_to_param],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()  # Já vem ordenado por '-created_at'

        status_value = self.request.query_params.get("status")
        if status_value:
            queryset = queryset.filter(status=status_value)

        categoria_value = self.request.query_params.get("categoria")
        if categoria_value:
            queryset = queryset.filter(categoria__iexact=categoria_value)

        created_from_raw = self.request.query_params.get("created_from")
        created_to_raw = self.request.query_params.get("created_to")

        if created_from_raw:
            created_from_value, value_type = self._parse_datetime_param(
                created_from_raw, "created_from"
            )
            if value_type == "datetime":
                queryset = queryset.filter(created_at__gte=created_from_value)
            else:
                queryset = queryset.filter(created_at__date__gte=created_from_value)
        if created_to_raw:
            created_to_value, value_type = self._parse_datetime_param(
                created_to_raw, "created_to"
            )
            if value_type == "datetime":
                queryset = queryset.filter(created_at__lte=created_to_value)
            else:
                queryset = queryset.filter(created_at__date__lte=created_to_value)

        return queryset.order_by('-created_at')  # Garante ordenação mesmo após filtros

    def _parse_datetime_param(self, raw_value, param_name):
        """Retorna tupla com valor parseado e tipo ('datetime' ou 'date')."""
        parsed_dt = parse_datetime(raw_value)
        if parsed_dt:
            if timezone.is_naive(parsed_dt):
                parsed_dt = timezone.make_aware(parsed_dt, timezone.get_current_timezone())
            return parsed_dt, "datetime"

        day = parse_date(raw_value)
        if day:
            return day, "date"

        raise ValidationError(
            {
                param_name: "Formato inválido. Use ISO-8601 (YYYY-MM-DD ou YYYY-MM-DDThh:mm:ss)."
            }
        )
