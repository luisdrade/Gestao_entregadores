from django.urls import path
from . import views

urlpatterns = [
    path('api/registro-entrega-despesa/', views.registro_entrega_despesa, name='registro_entrega_despesa'),
    path('api/registro-trabalho/', views.registro_trabalho, name='registro_trabalho'),
    path('api/registro-despesa/', views.registro_despesa, name='registro_despesa'),
    path('api/dashboard-data/', views.dashboard_data, name='dashboard_data'),
]
