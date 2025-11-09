from typing import ClassVar

from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser
from api.serializers import UserDetailSerializer

User = get_user_model()


class UserDetailView(RetrieveAPIView):
    """Retorna os detalhes de um registro específico de User."""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Users"],
        operation_description="Recupera os detalhes de um registro de User.",
        responses={200: UserDetailSerializer()},
        operation_id="user_detail",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
