from typing import ClassVar

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.generics import CreateAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny

from api.models import Denuncia
from api.serializers import DenunciaCreateSerializer


class DenunciaCreateView(CreateAPIView):
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaCreateSerializer
    permission_classes: ClassVar = [AllowAny]
    parser_classes: ClassVar = [JSONParser, MultiPartParser, FormParser]  # Aceita JSON e form-data

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Cria uma nova denúncia.",
        manual_parameters=[
            openapi.Parameter("categoria", openapi.IN_FORM, description="Categoria", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("descricao", openapi.IN_FORM, description="Descricao", type=openapi.TYPE_STRING, required=True),
            openapi.Parameter("latitude", openapi.IN_FORM, description="Latitude (decimal)", type=openapi.TYPE_NUMBER, required=True),
            openapi.Parameter("longitude", openapi.IN_FORM, description="Longitude (decimal)", type=openapi.TYPE_NUMBER, required=True),
            openapi.Parameter(
                "midia",
                openapi.IN_FORM,
                description="Midia (arquivo). É possível enviar no máximo 3 arquivos por requisição somando midia/audio.",
                type=openapi.TYPE_FILE,
                required=False,
            ),
            openapi.Parameter(
                "audio",
                openapi.IN_FORM,
                description="Audio (arquivo). É possível enviar no máximo 3 arquivos por requisição somando midia/audio.",
                type=openapi.TYPE_FILE,
                required=False,
            ),
            openapi.Parameter("status", openapi.IN_FORM, description="Status", type=openapi.TYPE_STRING, required=False),
        ],
        consumes=["multipart/form-data", "application/json"],
        responses={201: DenunciaCreateSerializer()},
        operation_id="denuncia_create",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
