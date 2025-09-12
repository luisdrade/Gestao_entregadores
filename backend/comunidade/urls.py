from django.urls import path
from . import views
from .admin_views import (
    AdminComunidadeAPIView, 
    AdminModerarPostagemAPIView, 
    AdminModerarAnuncioAPIView,
    AdminComunidadeStatsAPIView
)
from .web_admin_views import (
    admin_dashboard,
    admin_posts,
    admin_anuncios,
    admin_moderar_item,
    admin_stats
)

urlpatterns = [
    # URLs públicas
    path('', views.comunidade, name='comunidade'),
    
    # URLs de administração WEB (templates)
    path('admin/dashboard/', admin_dashboard, name='admin_comunidade_dashboard'),
    path('admin/posts/', admin_posts, name='admin_comunidade_posts'),
    path('admin/anuncios/', admin_anuncios, name='admin_comunidade_anuncios'),
    path('admin/moderar/<str:item_type>/<int:item_id>/', admin_moderar_item, name='admin_moderar_item'),
    path('admin/stats/', admin_stats, name='admin_comunidade_stats'),
    
    # URLs de administração API (JSON)
    path('admin/api/', AdminComunidadeAPIView.as_view(), name='admin_comunidade_api'),
    path('admin/api/stats/', AdminComunidadeStatsAPIView.as_view(), name='admin_comunidade_api_stats'),
    path('admin/api/postagens/<int:postagem_id>/', AdminModerarPostagemAPIView.as_view(), name='admin_moderar_postagem_api'),
    path('admin/api/anuncios/<int:anuncio_id>/', AdminModerarAnuncioAPIView.as_view(), name='admin_moderar_anuncio_api'),
]
