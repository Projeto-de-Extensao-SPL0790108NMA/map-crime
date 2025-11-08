from rest_framework.generics import ListAPIView
from django.contrib.auth import get_user_model
User = get_user_model()
from api.serializers import UserListSerializer
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

class UserListView(ListAPIView):
    """Lista todos os registros de User."""
    queryset = User.objects.all().order_by('email')  # Ordena por email (alfabético)
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]
    pagination_class = CustomPagination

    @swagger_auto_schema(
        tags=["Users"],
        operation_description="Lista todos os registros de User.",
        responses={200: UserListSerializer(many=True)},
        operation_id="user_list",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)