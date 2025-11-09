from typing import ClassVar

from django.contrib.auth.models import Group

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import UpdateAPIView

# autenticated
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser
from api.serializers.group import GroupUpdateSerializer


class GroupUpdateView(UpdateAPIView):
    """Atualiza um registro existente de Group."""
    queryset = Group.objects.all()
    serializer_class = GroupUpdateSerializer  # Corrigido: estava usando GroupDeleteSerializer
    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]
    
    @swagger_auto_schema(
        tags=["Groups"],
        operation_description="Atualiza um registro de Group.",
        responses={200: GroupUpdateSerializer()},
        operation_id="group_update",
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["Groups"],
        operation_description="Atualiza parcialmente um registro de Group.",
        responses={200: GroupUpdateSerializer()},
        operation_id="group_update_partial",
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
