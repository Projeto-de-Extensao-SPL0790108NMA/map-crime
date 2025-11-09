# from drf_yasg.utils import swagger_auto_schema
from typing import ClassVar

from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import RetrieveAPIView

# autenticated
from rest_framework.permissions import AllowAny

from api.models import Denuncia
from api.serializers import DenunciaDetailSerializer


class DenunciaDetailView(RetrieveAPIView):
    """Retorna os detalhes de um registro específico de Denuncia."""
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaDetailSerializer
    permission_classes: ClassVar = [AllowAny]

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Recupera os detalhes de um registro de Denuncia.",
        responses={200: DenunciaDetailSerializer()},
        operation_id="denuncia_detail",
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
