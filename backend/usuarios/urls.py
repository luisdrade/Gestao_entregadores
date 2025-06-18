from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter() # cria um router para o viewset | Cria o crud para o entregador
router.register(r'entregadores', views.EntregadorViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('cadastro/', views.cadastro_entregador, name='cadastro_entregador'),
    path('cadastro/sucesso/', views.cadastro_sucesso, name='cadastro_sucesso'),
]
