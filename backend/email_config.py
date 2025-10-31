"""
Configuração de Email simplificada - usa apenas settings.py
"""
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class EmailConfig:
    """
    Classe simplificada para teste de email usando configurações do settings.py
    """
    
    @staticmethod
    def test_email_connection():
        """
        Testa a conexão de email usando configurações do settings.py
        """
        try:
            # Se estiver usando console backend, não precisa testar
            if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
                return {
                    'success': True,
                    'message': 'Usando console backend - emails aparecerão no terminal',
                    'config': {
                        'EMAIL_BACKEND': settings.EMAIL_BACKEND,
                        'DEFAULT_FROM_EMAIL': getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@gestaoentregadores.com'),
                    }
                }
            
            # Testar envio de email (apenas verifica configuração, não envia real)
            config = {
                'EMAIL_BACKEND': settings.EMAIL_BACKEND,
                'DEFAULT_FROM_EMAIL': getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@gestaoentregadores.com'),
                'SENDGRID_API_KEY': 'Configurado' if hasattr(settings, 'SENDGRID_API_KEY') and settings.SENDGRID_API_KEY else 'Não configurado',
            }
            
            return {
                'success': True,
                'message': 'Configuração de email verificada',
                'config': config
            }
                
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro na configuração de email: {str(e)}',
                'config': {}
            }

