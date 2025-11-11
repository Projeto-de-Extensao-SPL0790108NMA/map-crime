from django.urls import path

from api.views.denuncia import (
    DenunciaCreateView,
    DenunciaDeleteView,
    DenunciaDetailProtocoloView,
    DenunciaDetailView,
    DenunciaListView,
    DenunciaReportView,
    DenunciaUpdateView,
)
from api.views.denuncia.heatmap import DenunciaHeatmapList
from api.views.group import (
    GroupCreateView,
    GroupDeleteView,
    GroupDetailView,
    GroupListView,
    GroupUpdateView,
)
from api.views.user import (
    UserCreateView,
    UserDeleteView,
    UserDetailView,
    UserListView,
    UserUpdateView,
)

urlpatterns = [
    # Users
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/create/", UserCreateView.as_view(), name="user-create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("users/<int:pk>/update/", UserUpdateView.as_view(), name="user-update"),
    path("users/<int:pk>/delete/", UserDeleteView.as_view(), name="user-delete"),

    # Groups (paths distintos para evitar sobrescrita)
    path("groups/", GroupListView.as_view(), name="group-list"),
    path("groups/create/", GroupCreateView.as_view(), name="group-create"),
    path("groups/<int:pk>/", GroupDetailView.as_view(), name="group-detail"),
    path("groups/<int:pk>/update/", GroupUpdateView.as_view(), name="group-update"),
    path("groups/<int:pk>/delete/", GroupDeleteView.as_view(), name="group-delete"),

    # Denuncias
    path("denuncias/", DenunciaListView.as_view(), name="denuncia_list"),
    path("denuncias/create/", DenunciaCreateView.as_view(), name="denuncia_create"),
    path("denuncias/<uuid:pk>/", DenunciaDetailView.as_view(), name="denuncia_detail"),
    path(
        "denuncias/protocolo/<str:protocolo>/",
        DenunciaDetailProtocoloView.as_view(),
        name="denuncia_detail_protocolo",
    ),
    path("denuncias/<uuid:pk>/update/", DenunciaUpdateView.as_view(), name="denuncia_update"),
    path("denuncias/<uuid:pk>/delete/", DenunciaDeleteView.as_view(), name="denuncia_delete"),
    path("denuncias/heatmap/", DenunciaHeatmapList.as_view(), name="denuncia-heatmap"),
    path("denuncias/relatorios/", DenunciaReportView.as_view(), name="denuncia-report"),
]
