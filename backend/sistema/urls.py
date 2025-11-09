from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static


def test_root(request):
    """View simples para testar se o Django está funcionando"""
    return JsonResponse({
        'success': True,
        'message': 'Django está funcionando!',
        'status': 'OK'
    })


def test_api(request):
    """View simples para testar se a API está funcionando"""
    return JsonResponse({
        'success': True,
        'message': 'API está funcionando!',
        'endpoints': {
            'registro_trabalho': '/registro/api/registro-trabalho/',
            'registro_despesa': '/registro/api/registro-despesa/',
            'dashboard_data': '/registro/api/dashboard-data/',
        }
    })


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', test_root, name='test_root'),
    path('api/test/', test_api, name='test_api'),
    path('api/', include('usuarios.urls')),
    path('api/', include('cadastro_veiculo.urls')),
    path('api/', include('relatorios_dashboard.api_urls')),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/password/reset/confirm/', include('django.contrib.auth.urls')),
    path('registro/', include('registro_entregadespesa.urls')),
    path('comunidade/', include('comunidade.urls')),
]

# Servir arquivos de mídia em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)