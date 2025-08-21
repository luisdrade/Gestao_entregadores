from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'veiculos', views.VeiculoViewSet, basename='veiculo')

urlpatterns = [
    # Rotas da API (sem o prefixo /api/ pois já está incluído no sistema principal)
    path('', include(router.urls)),
    
    # Rota para o template HTML (mantida para compatibilidade)
    path('cadastro/', views.cadastro_veiculo_view, name='cadastro_veiculo'),
]
