import os

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

API_PUBLIC_URL = os.getenv('API_PUBLIC_URL', getattr(settings, 'API_PUBLIC_URL', None))
API_TITLE = getattr(settings, "PROJECT_NAME", os.getenv("APP_NAME", "Base_Project_Django"))

schema_view = get_schema_view(
    openapi.Info(
        title=f"{API_TITLE} API",
        default_version='v1',
        description="API docs",
        contact=openapi.Contact(email="suporte@prdl.shop"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    url=API_PUBLIC_URL
)

urlpatterns = [
    # panel admin
    path('admin/', admin.site.urls),
    # auth urls
    path('auth/', include('accounts.urls'), name='auth'),
    # api urls
    path('api/', include('api.urls'), name='api'),
    # Documentação da API
    path('documentation/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
