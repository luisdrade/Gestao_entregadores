from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

class CSRFExemptAPIMiddleware(MiddlewareMixin):
    """
    Middleware para desabilitar CSRF em rotas de API
    """
    
    def process_request(self, request):
        # Lista de rotas que devem ser isentas de CSRF
        api_routes = [
            '/api/auth/login/',
            '/api/auth/register/',
            '/api/auth/logout/',
            '/api/auth/refresh/',
            '/api/auth/profile/',
            '/api/auth/change-password/',
        ]
        
        # Verificar se a rota atual é uma API que deve ser isenta de CSRF
        if any(request.path.startswith(route) for route in api_routes):
            # Marcar a requisição como isenta de CSRF
            setattr(request, '_dont_enforce_csrf_checks', True)
            logger.info(f"CSRF desabilitado para rota: {request.path}")
        
        return None
