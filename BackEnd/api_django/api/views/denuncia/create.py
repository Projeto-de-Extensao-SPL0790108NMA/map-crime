from rest_framework.generics import CreateAPIView
from api.models import Denuncia
from api.serializers import DenunciaCreateSerializer

from rest_framework.permissions import IsAuthenticated
from accounts.permissions.groups import IsAdmin, IsUser

from drf_yasg.utils import swagger_auto_schema

class DenunciaCreateView(CreateAPIView):
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaCreateSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser]

    @swagger_auto_schema(
        tags=["Denuncias"],
        operation_description="Cria uma nova denúncia.",
        responses={201: DenunciaCreateSerializer()},
        operation_id="denuncia_create",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)