from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views_social import GoogleLogin

from .views import EntregadorMeView
from .views import LogoutView


router = DefaultRouter() # cria um router para o viewset | Cria o crud para o entregador
router.register(r'entregadores', views.EntregadorViewSet)

urlpatterns = [
    path('', include(router.urls)),  # raiz do app já é /api/
    path('cadastro/', views.cadastro_entregador, name='cadastro_entregador'),
    path('cadastro/sucesso/', views.cadastro_sucesso, name='cadastro_sucesso'),
    
    path('entregadores/me/', EntregadorMeView.as_view(), name='entregador_me'), # EntregadorMeView para ver o usuário logado

    path('google-login/', GoogleLogin.as_view(), name='google_login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
