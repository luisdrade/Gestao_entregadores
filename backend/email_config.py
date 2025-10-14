"""
Configuração de Email para o Sistema de Gestão de Entregadores
"""
import os
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class EmailConfig:
    """
    Classe para configuração e teste de email
    """
    
    @staticmethod
    def get_smtp_config():
        """
        Retorna configuração SMTP baseada nas variáveis de ambiente
        """
        return {
            'EMAIL_BACKEND': os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend'),
            'EMAIL_HOST': os.getenv('EMAIL_HOST', 'smtp.gmail.com'),
            'EMAIL_PORT': int(os.getenv('EMAIL_PORT', '587')),
            'EMAIL_USE_TLS': os.getenv('EMAIL_USE_TLS', 'True').lower() in ['1', 'true', 'yes', 'on'],
            'EMAIL_HOST_USER': os.getenv('EMAIL_HOST_USER', ''),
            'EMAIL_HOST_PASSWORD': os.getenv('EMAIL_HOST_PASSWORD', ''),
            'DEFAULT_FROM_EMAIL': os.getenv('DEFAULT_FROM_EMAIL', 'noreply@gestaoentregadores.com'),
        }
    
    @staticmethod
    def test_email_connection():
        """
        Testa a conexão de email
        """
        try:
            # Configuração de teste
            config = EmailConfig.get_smtp_config()
            
            # Se estiver usando console, não precisa testar
            if config['EMAIL_BACKEND'] == 'django.core.mail.backends.console.EmailBackend':
                return {
                    'success': True,
                    'message': 'Usando console backend - emails aparecerão no terminal',
                    'config': config
                }
            
            # Testar envio de email
            test_result = send_mail(
                subject='Teste de Configuração de Email',
                message='Este é um email de teste para verificar se a configuração está funcionando.',
                from_email=config['DEFAULT_FROM_EMAIL'],
                recipient_list=[config['EMAIL_HOST_USER']],  # Enviar para si mesmo
                fail_silently=False,
            )
            
            if test_result:
                return {
                    'success': True,
                    'message': 'Email de teste enviado com sucesso!',
                    'config': config
                }
            else:
                return {
                    'success': False,
                    'message': 'Falha ao enviar email de teste',
                    'config': config
                }
                
        except Exception as e:
            return {
                'success': False,
                'message': f'Erro na configuração de email: {str(e)}',
                'config': EmailConfig.get_smtp_config()
            }
    
    @staticmethod
    def get_gmail_config():
        """
        Retorna configuração específica para Gmail
        """
        return {
            'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
            'EMAIL_HOST': 'smtp.gmail.com',
            'EMAIL_PORT': 587,
            'EMAIL_USE_TLS': True,
            'EMAIL_HOST_USER': 'seu-email@gmail.com',  # Substitua pelo seu email
            'EMAIL_HOST_PASSWORD': 'sua-senha-de-app',  # Use senha de app, não a senha normal
            'DEFAULT_FROM_EMAIL': 'noreply@gestaoentregadores.com',
        }
    
    @staticmethod
    def get_outlook_config():
        """
        Retorna configuração específica para Outlook/Hotmail
        """
        return {
            'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
            'EMAIL_HOST': 'smtp-mail.outlook.com',
            'EMAIL_PORT': 587,
            'EMAIL_USE_TLS': True,
            'EMAIL_HOST_USER': 'seu-email@outlook.com',
            'EMAIL_HOST_PASSWORD': 'sua-senha',
            'DEFAULT_FROM_EMAIL': 'noreply@gestaoentregadores.com',
        }
    
    @staticmethod
    def get_yahoo_config():
        """
        Retorna configuração específica para Yahoo
        """
        return {
            'EMAIL_BACKEND': 'django.core.mail.backends.smtp.EmailBackend',
            'EMAIL_HOST': 'smtp.mail.yahoo.com',
            'EMAIL_PORT': 587,
            'EMAIL_USE_TLS': True,
            'EMAIL_HOST_USER': 'seu-email@yahoo.com',
            'EMAIL_HOST_PASSWORD': 'sua-senha-de-app',
            'DEFAULT_FROM_EMAIL': 'noreply@gestaoentregadores.com',
        }

# Exemplo de uso:
if __name__ == "__main__":
    # Testar configuração atual
    result = EmailConfig.test_email_connection()
    print(f"Status: {result['success']}")
    print(f"Mensagem: {result['message']}")
    print(f"Configuração: {result['config']}")

