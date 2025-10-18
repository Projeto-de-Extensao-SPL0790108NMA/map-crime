from django.shortcuts import render
from api.views.example import (
    ClienteCreateView,
    ClienteListView,
    ClienteUpdateView,
    ClienteDeleteView,
    ClienteDetailView
)

from api.views.denuncia import (
    DenunciaCreateView,
    DenunciaListView,
    DenunciaDetailView,
    DenunciaUpdateView,
    DenunciaDeleteView,
    DenunciaGeolocalizedListView,
    DenunciaGeolocalizedDetailView,
    DenunciaByCategoriaListView,
)
