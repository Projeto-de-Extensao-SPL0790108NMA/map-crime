# api/views/Denuncia/__init__.py

from .create import DenunciaCreateView
from .list import DenunciaListView
from .detail import DenunciaDetailView
from .update import DenunciaUpdateView
from .delete import DenunciaDeleteView

__all__ = [
    "DenunciaCreateView",
    "DenunciaListView",
    "DenunciaDetailView",
    "DenunciaUpdateView",
    "DenunciaDeleteView",
]
