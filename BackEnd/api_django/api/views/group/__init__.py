# api/views/group/__init__.py

from .create import GroupCreateView
from .delete import GroupDeleteView
from .detail import GroupDetailView
from .list import GroupListView
from .update import GroupUpdateView

__all__ = [
    "GroupCreateView",
    "GroupDeleteView",
    "GroupDetailView",
    "GroupListView",
    "GroupUpdateView",
]
