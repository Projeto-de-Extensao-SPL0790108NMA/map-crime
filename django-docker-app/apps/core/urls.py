from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Adicione outras rotas específicas da aplicação core aqui
]