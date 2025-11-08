from rest_framework.generics import RetrieveAPIView
from django.contrib.auth.models import Group
from api.serializers.group import GroupDetailSerializer

# autenticated
from rest_framework.permissions import IsAuthenticated
from accounts.permissions.groups import IsAdmin, IsUser

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema

class GroupDetailView(RetrieveAPIView):
    """Retorna os detalhes de um registro específico de Group."""
    queryset = Group.objects.all()
    serializer_class = GroupDetailSerializer  # Corrigido: estava usando GroupDeleteSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Groups"],
        operation_description="Recupera os detalhes de um registro de Group.",
        responses={200: GroupDetailSerializer()},
        operation_id="group_detail",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)