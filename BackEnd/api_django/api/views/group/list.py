from rest_framework.generics import ListAPIView
from django.contrib.auth.models import Group
from api.serializers.group import GroupListSerializer  # Corrigido: usar GroupListSerializer
# paginations
from rest_framework.pagination import PageNumberPagination

# autenticated
from rest_framework.permissions import IsAuthenticated
from accounts.permissions.groups import IsAdmin, IsUser

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema


class CustomPagination(PageNumberPagination):
    page_size = 20  # Número de itens por página
    page_size_query_param = 'page_size'  # permite o uso de ?page_size=20 na URL
    max_page_size = 100  # limite máximo

class GroupListView(ListAPIView):
    """Lista todos os registros de Group."""
    queryset = Group.objects.all().order_by('name')  # Ordena por nome (alfabético)
    serializer_class = GroupListSerializer  # Corrigido: usar GroupListSerializer em vez de GroupDeleteSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]
    pagination_class = CustomPagination

    @swagger_auto_schema(
        tags=["Groups"],
        operation_description="Lista todos os registros de Group.",
        responses={200: GroupListSerializer(many=True)},
        operation_id="group_list",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)