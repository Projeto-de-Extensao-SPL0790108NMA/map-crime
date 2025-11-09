from typing import ClassVar

from django.contrib.auth.models import Group
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser  # ou outra lógica de permissão
from api.serializers.group import GroupCreateSerializer


class GroupCreateView(CreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupCreateSerializer
    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Groups"],
        operation_description="Cria um novo grupo.",
        responses={201: GroupCreateSerializer()},
        operation_id="group_create",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
