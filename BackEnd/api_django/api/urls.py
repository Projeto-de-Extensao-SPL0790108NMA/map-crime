from django.urls import path

from api.views.user import (
    UserListView,
    UserCreateView,
    UserDetailView,
    UserUpdateView,
    UserDeleteView,
)
from api.views.group import (
    GroupListView,
    GroupCreateView,
    GroupDetailView,
    GroupUpdateView,
    GroupDeleteView,
)

from api.views.denuncia import (
    DenunciaListView,
    DenunciaCreateView,
    DenunciaDetailView,
    DenunciaUpdateView,
    DenunciaDeleteView,
)
from api.views.denuncia.heatmap import DenunciaHeatmapList

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
    path("denuncias/<int:pk>/", DenunciaDetailView.as_view(), name="denuncia_detail"),
    path("denuncias/<int:pk>/update/", DenunciaUpdateView.as_view(), name="denuncia_update"),
    path("denuncias/<int:pk>/delete/", DenunciaDeleteView.as_view(), name="denuncia_delete"),
    path("denuncias/heatmap/", DenunciaHeatmapList.as_view(), name="denuncia-heatmap"),
]