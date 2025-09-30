from django.urls import path
from . import views
from .admin_views import (
    AdminComunidadeAPIView, 
    AdminModerarPostagemAPIView, 
    AdminModerarAnuncioAPIView,
    AdminComunidadeStatsAPIView
)
# Views de template removidas - usando apenas API

urlpatterns = [
    # URLs públicas
    path('', views.comunidade, name='comunidade'),
    
    # URLs de API específicas
    path('api/postagens/', views.comunidade_api, name='comunidade_postagens'),
    path('api/anuncios/', views.comunidade_api, name='comunidade_anuncios'),
    
    # URLs de template removidas - usando apenas API
    
    # URLs de administração API (JSON)
    path('admin/api/', AdminComunidadeAPIView.as_view(), name='admin_comunidade_api'),
    path('admin/api/stats/', AdminComunidadeStatsAPIView.as_view(), name='admin_comunidade_api_stats'),
    path('admin/api/postagens/<int:postagem_id>/', AdminModerarPostagemAPIView.as_view(), name='admin_moderar_postagem_api'),
    path('admin/api/anuncios/<int:anuncio_id>/', AdminModerarAnuncioAPIView.as_view(), name='admin_moderar_anuncio_api'),
]
