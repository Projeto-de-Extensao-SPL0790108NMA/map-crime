from rest_framework.generics import DestroyAPIView
from api.models import Denuncia
from api.serializers import DenunciaDeleteSerializer

# autenticated
from rest_framework.permissions import IsAuthenticated
from accounts.permissions.groups import IsAdmin, IsUser

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema

class DenunciaDeleteView(DestroyAPIView):
    """Remove um registro específico de Denuncia."""
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaDeleteSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Remove um registro de Denuncia.",
        responses={204: "No Content"},
        operation_id="denuncia_delete",
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)