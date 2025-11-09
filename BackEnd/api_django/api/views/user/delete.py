from typing import ClassVar

from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser
from api.serializers import UserDeleteSerializer

User = get_user_model()


class UserDeleteView(DestroyAPIView):
    """Remove um registro específico de User."""
    queryset = User.objects.all()
    serializer_class = UserDeleteSerializer
    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Users"],
        operation_description="Remove um registro de User.",
        responses={204: "No Content"},
        operation_id="user_delete",
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
