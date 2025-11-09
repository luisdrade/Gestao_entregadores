from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import EntregadorMeView, TestView, EstatisticasUsuarioView, UploadFotoPerfilView
from .auth.auth_views import (
    LoginView,
    RegisterView,
    LogoutView,
    RefreshTokenView,
    UserProfileView,
    ChangePasswordView,
    TwoFactorLoginView,
    TwoFactorSetupView,
    TwoFactorVerifyView,
    TwoFactorDisableView,
    TwoFactorStatusView,
    TwoFactorResendView,
    TrustedDevicesView,
    Force2FAView,
    TestEmailView,
    RegistrationVerifyView,
    RegistrationResendView
)
from .admin_views import AdminUsersAPIView, AdminStatsAPIView


app_name = 'usuarios'

router = DefaultRouter()
router.register(r'entregadores', views.EntregadorViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('test/', TestView.as_view(), name='test'),
    
    # Endpoints de autenticação organizados
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/login/2fa/', TwoFactorLoginView.as_view(), name='auth_login_2fa'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/register/verify/', RegistrationVerifyView.as_view(), name='auth_register_verify'),
    path('auth/register/resend/', RegistrationResendView.as_view(), name='auth_register_resend'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='auth_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='auth_profile'),
    path('auth/change-password/', ChangePasswordView.as_view(), name='auth_change_password'),
    
    # Endpoints de 2FA
    path('auth/2fa/setup/', TwoFactorSetupView.as_view(), name='auth_2fa_setup'),
    path('auth/2fa/verify/', TwoFactorVerifyView.as_view(), name='auth_2fa_verify'),
    path('auth/2fa/disable/', TwoFactorDisableView.as_view(), name='auth_2fa_disable'),
    path('auth/2fa/status/', TwoFactorStatusView.as_view(), name='auth_2fa_status'),
    path('auth/2fa/resend/', TwoFactorResendView.as_view(), name='auth_2fa_resend'),
    
    # Dispositivos confiáveis
    path('auth/devices/', TrustedDevicesView.as_view(), name='auth_devices'),
    path('auth/force-2fa/', Force2FAView.as_view(), name='auth_force_2fa'),
    
    # Teste de email
    path('auth/test-email/', TestEmailView.as_view(), name='auth_test_email'),
    
    path('entregadores/me/', EntregadorMeView.as_view(), name='entregador_me'),
    
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
]
