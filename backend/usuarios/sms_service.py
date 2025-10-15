from django.utils import timezone
from datetime import timedelta
import secrets
import logging
import os

logger = logging.getLogger(__name__)

class SMSService:
    """
    Serviço para envio de códigos 2FA por SMS
    """
    
    @staticmethod
    def generate_code():
        """Gera um código de 6 dígitos"""
        return f"{secrets.randbelow(1000000):06d}"
    
    @staticmethod
    def send_registration_code(user, phone_number):
        """
        Envia código de verificação pós-cadastro por SMS
        
        Args:
            user: Instância do usuário
            phone_number: Número de telefone para envio
        
        Returns:
            dict: Resultado da operação
        """
        try:
            # Gerar código
            code = SMSService.generate_code()
            
            # Definir tempo de expiração (10 minutos)
            expires_at = timezone.now() + timedelta(minutes=10)
            
            # Atualizar campos do usuário
            user.registration_code = code
            user.registration_code_expires_at = expires_at
            user.save(update_fields=['registration_code', 'registration_code_expires_at'])
            
            # Aqui você integraria com um provedor de SMS real
            # Por exemplo: Twilio, AWS SNS, etc.
            # Por enquanto, vamos simular o envio
            
            # Verificar se há configuração de SMS
            sms_enabled = os.getenv('SMS_ENABLED', 'false').lower() == 'true'
            
            if sms_enabled:
                # Aqui seria a integração real com provedor de SMS
                # Exemplo com Twilio:
                # from twilio.rest import Client
                # client = Client(account_sid, auth_token)
                # message = client.messages.create(
                #     body=f'Seu código de verificação é: {code}\n\nEste código expira em 10 minutos.',
                #     from_=twilio_phone,
                #     to=phone_number
                # )
                
                # Por enquanto, apenas logamos o código (para desenvolvimento)
                logger.info(f"SMS enviado para {phone_number}: Código de verificação: {code}")
                
                return {
                    'success': True,
                    'message': 'Código enviado por SMS com sucesso',
                    'expires_at': expires_at.isoformat()
                }
            else:
                # Modo de desenvolvimento - apenas logar o código
                logger.info(f"[DESENVOLVIMENTO] SMS para {phone_number}: Código de verificação: {code}")
                
                return {
                    'success': True,
                    'message': 'Código gerado (modo desenvolvimento)',
                    'expires_at': expires_at.isoformat(),
                    'debug_code': code  # Apenas para desenvolvimento
                }
                
        except Exception as e:
            logger.error(f"Erro ao enviar SMS: {str(e)}")
            return {
                'success': False,
                'message': 'Erro interno do servidor'
            }
    
    @staticmethod
    def verify_code(user, code):
        """
        Verifica código de verificação pós-cadastro
        
        Args:
            user: Instância do usuário
            code: Código a ser verificado
        
        Returns:
            dict: Resultado da verificação
        """
        try:
            # Verificar se há código armazenado
            if not user.registration_code:
                return {
                    'success': False,
                    'message': 'Nenhum código de verificação encontrado'
                }
            
            # Verificar se o código confere
            if user.registration_code != code:
                return {
                    'success': False,
                    'message': 'Código inválido'
                }
            
            # Verificar se não expirou
            if user.registration_code_expires_at and timezone.now() > user.registration_code_expires_at:
                # Limpar código expirado
                user.registration_code = None
                user.registration_code_expires_at = None
                user.save(update_fields=['registration_code', 'registration_code_expires_at'])
                
                return {
                    'success': False,
                    'message': 'Código expirado'
                }
            
            # Código válido - limpar campos
            user.registration_code = None
            user.registration_code_expires_at = None
            user.registration_verified = True
            user.save(update_fields=['registration_code', 'registration_code_expires_at', 'registration_verified'])
            
            logger.info(f"Código SMS verificado para {user.email}")
            
            return {
                'success': True,
                'message': 'Código verificado com sucesso'
            }
            
        except Exception as e:
            logger.error(f"Erro ao verificar código SMS: {str(e)}")
            return {
                'success': False,
                'message': 'Erro interno do servidor'
            }
    
    @staticmethod
    def cleanup_expired_codes():
        """Remove códigos expirados"""
        try:
            from .models import Entregador
            
            expired_users = Entregador.objects.filter(
                registration_code_expires_at__lt=timezone.now(),
                registration_verified=False
            )
            
            count = 0
            for user in expired_users:
                user.registration_code = None
                user.registration_code_expires_at = None
                user.save(update_fields=['registration_code', 'registration_code_expires_at'])
                count += 1
            
            logger.info(f"Removidos {count} códigos SMS expirados")
            return count
            
        except Exception as e:
            logger.error(f"Erro ao limpar códigos SMS expirados: {str(e)}")
            return 0
