from typing import ClassVar

from django.contrib.auth.models import Group

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import DestroyAPIView

# autenticated
from rest_framework.permissions import IsAuthenticated

from accounts.permissions.groups import IsAdmin, IsUser
from api.serializers.group import GroupDeleteSerializer


class GroupDeleteView(DestroyAPIView):
    """Remove um registro específico de User."""
    queryset = Group.objects.all()
    serializer_class = GroupDeleteSerializer
    permission_classes: ClassVar = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Groups"],
        operation_description="Remove um registro de Group.",
        responses={204: "No Content"},
        operation_id="group_delete",
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
