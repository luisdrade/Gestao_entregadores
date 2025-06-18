from django.urls import path
from .views import cadastro_entregador , cadastro_sucesso

urlpatterns = [
    path('cadastro/', cadastro_entregador, name='cadastro_entregador'),
    path('cadastro/sucesso/', cadastro_sucesso, name='cadastro_sucesso'),

]
