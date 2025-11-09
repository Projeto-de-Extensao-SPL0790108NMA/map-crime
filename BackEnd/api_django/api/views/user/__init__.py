# api/views/User/__init__.py

from .create import UserCreateView
from .delete import UserDeleteView
from .detail import UserDetailView
from .list import UserListView
from .update import UserUpdateView

__all__ = [
    "UserCreateView",
    "UserDeleteView",
    "UserDetailView",
    "UserListView",
    "UserUpdateView",
]
