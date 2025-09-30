from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'veiculos', views.VeiculoViewSet, basename='veiculo')

urlpatterns = [
    # Rotas da API (sem o prefixo /api/ pois já está incluído no sistema principal)
    path('', include(router.urls)),
    
    # Rota de template removida - usando apenas API
]
