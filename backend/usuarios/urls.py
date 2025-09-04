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
    ChangePasswordView,
    AdminUserManagementView
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
    path('upload-foto/', UploadFotoPerfilView.as_view(), name='upload_foto_perfil'),
    
    # Endpoints de relatórios
    path('relatorios/trabalho/', views.relatorio_trabalho, name='relatorio_trabalho'),
    path('relatorios/despesas/', views.relatorio_despesas, name='relatorio_despesas'),
    
    # Endpoints de administração (apenas para admin)
    path('admin/users/', AdminUserManagementView.as_view(), name='admin_users'),
]
