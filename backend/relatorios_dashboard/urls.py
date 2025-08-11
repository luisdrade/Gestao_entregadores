from django.urls import path
from . import views

app_name = 'relatorios_dashboard'

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('relatorios/', views.relatorios, name='relatorios'),
]
