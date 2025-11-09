# api/views/Denuncia/__init__.py

from .create import DenunciaCreateView
from .delete import DenunciaDeleteView
from .detail import DenunciaDetailView
from .list import DenunciaListView
from .report import DenunciaReportView
from .update import DenunciaUpdateView

__all__ = [
    "DenunciaCreateView",
    "DenunciaDeleteView",
    "DenunciaDetailView",
    "DenunciaListView",
    "DenunciaReportView",
    "DenunciaUpdateView",
]
