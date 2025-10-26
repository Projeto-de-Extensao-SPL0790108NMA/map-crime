from rest_framework.generics import UpdateAPIView
from api.models import Denuncia
from api.serializers import DenunciaUpdateSerializer

# autenticated
from rest_framework.permissions import IsAuthenticated
from accounts.permissions.groups import IsAdmin, IsUser

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema

class DenunciaUpdateView(UpdateAPIView):
    """Atualiza um registro existente de Denuncia."""
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaUpdateSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Atualiza um registro de Denuncia.",
        responses={200: DenunciaUpdateSerializer()},
        operation_id="denuncia_update",
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Atualiza parcialmente um registro de Denuncia.",
        responses={200: DenunciaUpdateSerializer()},
        operation_id="denuncia_update_partial",
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)