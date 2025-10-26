# api/serializers/__init__.py

from .user import (
    UserCreateSerializer,
    UserUpdateSerializer,
    UserListSerializer,
    UserDetailSerializer,
    UserDeleteSerializer
)

from .group import (
    GroupCreateSerializer,
    GroupUpdateSerializer,
    GroupListSerializer,
    GroupDetailSerializer,
    GroupDeleteSerializer
)

# Expondo também os serializers de Denuncia para importação direta via `from api.serializers import ...`
from .denuncia import (
    DenunciaCreateSerializer,
    DenunciaUpdateSerializer,
    DenunciaListSerializer,
    DenunciaDetailSerializer,
    DenunciaDeleteSerializer,
)