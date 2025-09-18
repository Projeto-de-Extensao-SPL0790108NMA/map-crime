from rest_framework.generics import CreateAPIView
from api.models import Denuncia
from api.serializers import DenunciaCreateSerializer

# autenticated
from rest_framework.permissions import IsAuthenticated
from api.permissions.grupos import IsAdmin, IsUser, IsExample

# from drf_yasg.utils import swagger_auto_schema
from drf_yasg.utils import swagger_auto_schema

class DenunciaCreateView(CreateAPIView):
    queryset = Denuncia.objects.all()
    serializer_class = DenunciaCreateSerializer
    permission_classes = [IsAuthenticated, IsAdmin | IsUser | IsExample]

    @swagger_auto_schema(
        operation_description="Cria um novo exemplo.",
        responses={201: DenunciaCreateSerializer()},
        operation_id="Denuncias_create",
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)