from typing import ClassVar

from django.contrib.auth import get_user_model
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser
from api.serializers import UserCreateSerializer

User = get_user_model()


class UserCreateView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Users"],
        operation_description="Cria um novo User.",
        responses={201: UserCreateSerializer()},
        operation_id="user_create",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
