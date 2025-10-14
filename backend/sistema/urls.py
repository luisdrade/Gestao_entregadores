
from django.contrib import admin
from django.urls import path, include
# from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView, )
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
            'test_connection': '/registro/api/test-connection/',
            'registro_trabalho': '/registro/api/registro-trabalho/',
            'registro_despesa': '/registro/api/registro-despesa/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Teste de conexão na raiz
    path('', test_root, name='test_root'),
    
    # Teste da API
    path('api/test/', test_api, name='test_api'),

    # API de usuários
    path('api/', include('usuarios.urls')),

    # API de veículos
    path('api/', include('cadastro_veiculo.urls')),

    # API de relatórios (DRF)
    path('api/', include('relatorios_dashboard.api_urls')),

    # Endpoints REST de autenticação
    path('api/auth/', include('dj_rest_auth.urls')),             # login/logout/password reset
    
    # URLs para reset de senha (necessárias para o dj-rest-auth funcionar)
    path('api/auth/password/reset/confirm/', include('django.contrib.auth.urls')),
    
    # URLs de template removidas - usando apenas API
    
    path('registro/', include('registro_entregadespesa.urls')),
    
    # Comunidade
    path('comunidade/', include('comunidade.urls')),
    
]

# Servir arquivos de mídia em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)