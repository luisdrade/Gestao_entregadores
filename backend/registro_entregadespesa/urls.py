from django.urls import path
from . import views

urlpatterns = [
    path('api/registro-entrega-despesa/', views.registro_entrega_despesa, name='registro_entrega_despesa'),
    path('api/registro-trabalho/', views.registro_trabalho, name='registro_trabalho'),
    path('api/registro-despesa/', views.registro_despesa, name='registro_despesa'),
    path('api/dashboard-data/', views.dashboard_data, name='dashboard_data'),
    path('api/test-connection/', views.test_connection, name='test_connection'),
    path('api/test-dashboard/', views.test_dashboard_endpoint, name='test_dashboard_endpoint'),
    path('api/test-auth/', views.test_auth, name='test_auth'),
]
