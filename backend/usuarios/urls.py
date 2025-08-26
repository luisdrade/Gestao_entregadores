from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import EntregadorMeView, LogoutView, LoginView, RegisterView, TestView, EstatisticasUsuarioView


router = DefaultRouter() # cria um router para o viewset | Cria o crud para o entregador
router.register(r'entregadores', views.EntregadorViewSet)

urlpatterns = [
    path('', include(router.urls)),  # raiz do app já é /api/
    path('cadastro/', views.cadastro_entregador, name='cadastro_entregador'),
    path('cadastro/sucesso/', views.cadastro_sucesso, name='cadastro_sucesso'),
    
    # Endpoint de teste
    path('test/', TestView.as_view(), name='test'),
    
    # Endpoints de autenticação customizados
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    
    path('entregadores/me/', EntregadorMeView.as_view(), name='entregador_me'), # EntregadorMeView para ver o usuário logado

    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Endpoint para verificar username (mantido para compatibilidade)
    path('check-username/<str:username>/', views.check_username, name='check_username'),
    
    # Endpoint para alterar senha
    path('change-password/<int:pk>/', views.change_password, name='change_password'),
    
    # Endpoint para estatísticas do usuário
    path('estatisticas/', EstatisticasUsuarioView.as_view(), name='estatisticas_usuario'),
]
