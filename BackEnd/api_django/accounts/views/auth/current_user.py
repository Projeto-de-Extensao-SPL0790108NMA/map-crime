from typing import ClassVar

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import UserSerializer


class CurrentUserView(APIView):
    permission_classes: ClassVar = [IsAuthenticated]

    @swagger_auto_schema(
        tags=["Accounts"],
        operation_description="Retorna os dados do usuário autenticado atualmente.",
        responses={
            200: openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                    "email": openapi.Schema(type=openapi.TYPE_STRING, format="email"),
                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                    "is_social_account": openapi.Schema(type=openapi.TYPE_BOOLEAN),
                    "groups": openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(type=openapi.TYPE_STRING),
                        description="Nomes dos grupos Django aos quais o usuário pertence",
                    ),
                },
            ),
            401: openapi.Response("Credenciais de autenticação inválidas ou ausentes."),
        },
    )
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
