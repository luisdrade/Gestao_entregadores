from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import EntregadorMeView, TestView, EstatisticasUsuarioView, UploadFotoPerfilView
from .auth_views import (
    LoginView,
    RegisterView,
    LogoutView,
    RefreshTokenView,
    UserProfileView,
    ChangePasswordView
)
from .admin_views import AdminUsersAPIView, AdminStatsAPIView
from .web_views import email_validation_view, resend_validation_code, custom_login_view
from .admin_unificado_views import (
    admin_unificado_dashboard,
    admin_unificado_usuarios,
    admin_unificado_posts,
    admin_unificado_anuncios,
    admin_unificado_moderar,
    admin_unificado_usuarios_stats,
    admin_unificado_comunidade_stats
)

app_name = 'usuarios'

router = DefaultRouter() # cria um router para o viewset | Cria o crud para o entregador
router.register(r'entregadores', views.EntregadorViewSet)

urlpatterns = [
    path('', include(router.urls)),  # raiz do app já é /api/
    path('cadastro/', views.cadastro_entregador, name='cadastro_entregador'),
    path('cadastro/sucesso/', views.cadastro_sucesso, name='cadastro_sucesso'),
    
    # Endpoint de teste
    path('test/', TestView.as_view(), name='test'),
    
    # Endpoints de autenticação organizados
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='auth_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='auth_profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    
    path('entregadores/me/', EntregadorMeView.as_view(), name='entregador_me'), # EntregadorMeView para ver o usuário logado
    
    # Endpoint para verificar username (mantido para compatibilidade)
    path('check-username/<str:username>/', views.check_username, name='check_username'),
    
    # Endpoint para alterar senha
    path('change-password/<int:pk>/', views.change_password, name='change_password'),
    
    # Endpoint para estatísticas do usuário
    path('estatisticas/', EstatisticasUsuarioView.as_view(), name='estatisticas_usuario'),
    
    # Endpoint para upload de foto de perfil
    path('usuarios/upload-foto/', UploadFotoPerfilView.as_view(), name='upload_foto_perfil'),
    
    # Endpoints de relatórios
    path('relatorios/trabalho/', views.relatorio_trabalho, name='relatorio_trabalho'),
    path('relatorios/despesas/', views.relatorio_despesas, name='relatorio_despesas'),
    
    # Endpoints de administração (apenas para admin)
    path('admin/users/', AdminUsersAPIView.as_view(), name='admin_users'),
    path('admin/users/<int:user_id>/', AdminUsersAPIView.as_view(), name='admin_user_detail'),
    path('admin/stats/', AdminStatsAPIView.as_view(), name='admin_stats'),
    
    # URLs para validação de email (web)
    path('login/', custom_login_view, name='custom_login'),
    path('email-validation/', email_validation_view, name='email_validation'),
    path('resend-code/', resend_validation_code, name='resend_code'),
    
    # URLs do Admin Unificado
    path('admin/unificado/', include([
        path('', admin_unificado_dashboard, name='admin_unificado_dashboard'),
        path('usuarios/', admin_unificado_usuarios, name='admin_unificado_usuarios'),
        path('posts/', admin_unificado_posts, name='admin_unificado_posts'),
        path('anuncios/', admin_unificado_anuncios, name='admin_unificado_anuncios'),
        path('moderar/<str:item_type>/<int:item_id>/', admin_unificado_moderar, name='admin_unificado_moderar'),
        path('stats/usuarios/', admin_unificado_usuarios_stats, name='admin_unificado_usuarios_stats'),
        path('stats/comunidade/', admin_unificado_comunidade_stats, name='admin_unificado_comunidade_stats'),
    ])),
]
