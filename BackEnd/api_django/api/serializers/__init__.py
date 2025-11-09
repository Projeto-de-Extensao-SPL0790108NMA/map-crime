# api/serializers/__init__.py

# Expondo também os serializers de Denuncia para importação direta via `from api.serializers import ...`
from .denuncia import (
    DenunciaCreateSerializer as DenunciaCreateSerializer,
)
from .denuncia import (
    DenunciaDeleteSerializer as DenunciaDeleteSerializer,
)
from .denuncia import (
    DenunciaDetailSerializer as DenunciaDetailSerializer,
)
from .denuncia import (
    DenunciaListSerializer as DenunciaListSerializer,
)
from .denuncia import (
    DenunciaUpdateSerializer as DenunciaUpdateSerializer,
)
from .group import (
    GroupCreateSerializer as GroupCreateSerializer,
)
from .group import (
    GroupDeleteSerializer as GroupDeleteSerializer,
)
from .group import (
    GroupDetailSerializer as GroupDetailSerializer,
)
from .group import (
    GroupListSerializer as GroupListSerializer,
)
from .group import (
    GroupUpdateSerializer as GroupUpdateSerializer,
)
from .user import (
    UserCreateSerializer as UserCreateSerializer,
)
from .user import (
    UserDeleteSerializer as UserDeleteSerializer,
)
from .user import (
    UserDetailSerializer as UserDetailSerializer,
)
from .user import (
    UserListSerializer as UserListSerializer,
)
from .user import (
    UserUpdateSerializer as UserUpdateSerializer,
)
