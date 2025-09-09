from django.shortcuts import redirect
from django.urls import reverse
from django.contrib.auth import logout
from django.contrib import messages

class EmailValidationMiddleware:
    """
    Middleware para verificar se usuários não-admin têm email validado
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Lista de URLs que não precisam de validação de email
        exempt_urls = [
            '/admin/login/',
            '/admin/logout/',
            '/auth/login/',
            '/usuarios/login/',
            '/usuarios/email-validation/',
            '/usuarios/resend-code/',
            '/admin/',
            '/api/',
        ]
        
        # Verificar se a URL atual está na lista de exceções
        if any(request.path.startswith(url) for url in exempt_urls):
            response = self.get_response(request)
            return response
        
        # Se o usuário está autenticado
        if request.user.is_authenticated:
            # Se é admin, permitir acesso
            if request.user.is_staff:
                response = self.get_response(request)
                return response
            
            # Se não é admin e email não está validado, redirecionar para validação
            if not request.user.email_validado:
                # Evitar redirecionamento infinito
                if not request.path.startswith('/usuarios/email-validation/'):
                    return redirect('usuarios:email_validation')
        
        response = self.get_response(request)
        return response
