from django.urls import path
from . import views

urlpatterns = [
    path('api/registro-entrega-despesa/', views.registro_entrega_despesa, name='registro_entrega_despesa'),
    path('api/registro-trabalho/', views.registro_trabalho, name='registro_trabalho'),
    path('api/registro-trabalho/<int:registro_id>/', views.registro_trabalho_detail, name='registro_trabalho_detail'),
    path('api/registro-despesa/', views.registro_despesa, name='registro_despesa'),
    path('api/registro-despesa/<int:despesa_id>/', views.registro_despesa_detail, name='registro_despesa_detail'),
    path('api/categorias-despesas/', views.categorias_despesas, name='categorias_despesas'),
    path('api/categorias-despesas/<int:categoria_id>/', views.categoria_despesa_detail, name='categoria_despesa_detail'),
    path('api/dashboard-data/', views.dashboard_data, name='dashboard_data'),
]
