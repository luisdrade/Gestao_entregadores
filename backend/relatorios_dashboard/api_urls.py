from django.urls import path
from . import api_views

app_name = 'relatorios_dashboard_api'

urlpatterns = [
    path('relatorios/estatisticas/', api_views.EstatisticasUsuarioView.as_view(), name='estatisticas_usuario'),
    path('relatorios/trabalho/', api_views.relatorio_trabalho, name='relatorio_trabalho'),
    path('relatorios/despesas/', api_views.relatorio_despesas, name='relatorio_despesas'),
]


