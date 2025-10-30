from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)

class RegistrationVerificationService:
    """
    Serviço unificado para gerenciar verificação pós-cadastro
    """
    
    MAX_ATTEMPTS = 5  # Máximo de tentativas de reenvio
    BLOCK_DURATION_MINUTES = 5  # Duração do bloqueio em minutos
    CODE_EXPIRY_MINUTES = 10  # Expiração do código em minutos
    
    @staticmethod
    def is_user_blocked(user):
        """
        Verifica se o usuário está bloqueado por excesso de tentativas
        
        Args:
            user: Instância do usuário
        
        Returns:
            dict: Status do bloqueio
        """
        if not user.registration_code_blocked_until:
            return {'blocked': False}
        
        if timezone.now() < user.registration_code_blocked_until:
            remaining_time = user.registration_code_blocked_until - timezone.now()
            return {
                'blocked': True,
                'blocked_until': user.registration_code_blocked_until.isoformat(),
                'remaining_minutes': int(remaining_time.total_seconds() / 60)
            }
        else:
            # Bloqueio expirado - limpar
            user.registration_code_blocked_until = None
            user.registration_code_attempts = 0
            user.save(update_fields=['registration_code_blocked_until', 'registration_code_attempts'])
            return {'blocked': False}
    
    @staticmethod
    def can_send_code(user):
        """
        Verifica se pode enviar código (não está bloqueado e não excedeu tentativas)
        
        Args:
            user: Instância do usuário
        
        Returns:
            dict: Status da permissão
        """
        # Verificar se está bloqueado
        block_status = RegistrationVerificationService.is_user_blocked(user)
        if block_status['blocked']:
            return {
                'can_send': False,
                'reason': 'blocked',
                'message': f'Você excedeu o limite de tentativas. Tente novamente em {block_status["remaining_minutes"]} minutos.',
                'blocked_until': block_status['blocked_until']
            }
        
        # Verificar se já está verificado
        if user.registration_verified:
            return {
                'can_send': False,
                'reason': 'already_verified',
                'message': 'Este usuário já foi verificado.'
            }
        
        return {'can_send': True}
    
    @staticmethod
    def send_verification_code(user, method='email'):
        """
        Envia código de verificação por email ou SMS
        
        Args:
            user: Instância do usuário
            method: 'email' ou 'sms'
        
        Returns:
            dict: Resultado da operação
        """
        try:
            # Verificar se pode enviar
            permission = RegistrationVerificationService.can_send_code(user)
            if not permission['can_send']:
                return {
                    'success': False,
                    'message': permission['message'],
                    'reason': permission['reason']
                }
            
            # Incrementar tentativas
            user.registration_code_attempts += 1
            user.save(update_fields=['registration_code_attempts'])
            
            # Verificar se atingiu limite de tentativas
            if user.registration_code_attempts > RegistrationVerificationService.MAX_ATTEMPTS:
                # Bloquear por 5 minutos
                user.registration_code_blocked_until = timezone.now() + timedelta(
                    minutes=RegistrationVerificationService.BLOCK_DURATION_MINUTES
                )
                user.save(update_fields=['registration_code_blocked_until'])
                
                return {
                    'success': False,
                    'message': f'Você excedeu o limite de {RegistrationVerificationService.MAX_ATTEMPTS} tentativas. Tente novamente em {RegistrationVerificationService.BLOCK_DURATION_MINUTES} minutos.',
                    'reason': 'max_attempts_exceeded'
                }
            
            # Enviar código conforme método escolhido COM TRATAMENTO DE ERRO
            try:
                if method == 'email':
                    from .email_service import TwoFactorEmailService
                    result = TwoFactorEmailService.send_registration_code(user)
                elif method == 'sms':
                    from .sms_service import SMSService
                    result = SMSService.send_registration_code(user, user.telefone)
                else:
                    return {
                        'success': False,
                        'message': 'Método de verificação inválido'
                    }
            except Exception as send_error:
                logger.error(f"❌ Erro ao chamar serviço de envio ({method}): {str(send_error)}", exc_info=True)
                import traceback
                logger.error(f"Traceback: {traceback.format_exc()}")
                return {
                    'success': False,
                    'message': f'Erro ao enviar código via {method}: {str(send_error)}'
                }
            
            if result['success']:
                logger.info(f"✅ Código de verificação enviado para {user.email} via {method}")
                return {
                    'success': True,
                    'message': result['message'],
                    'expires_at': result['expires_at'],
                    'attempts_remaining': RegistrationVerificationService.MAX_ATTEMPTS - user.registration_code_attempts
                }
            else:
                logger.warning(f"⚠️ Falha no envio de código: {result.get('message')}")
                return result
                
        except Exception as e:
            logger.error(f"❌ Erro ao enviar código de verificação: {str(e)}", exc_info=True)
            import traceback
            logger.error(f"Traceback completo: {traceback.format_exc()}")
            return {
                'success': False,
                'message': f'Erro interno do servidor: {str(e)}'
            }
    
    @staticmethod
    def verify_code(user, code, method='email'):
        """
        Verifica código de verificação
        
        Args:
            user: Instância do usuário
            code: Código a ser verificado
            method: 'email' ou 'sms'
        
        Returns:
            dict: Resultado da verificação
        """
        try:
            # Verificar se está bloqueado
            block_status = RegistrationVerificationService.is_user_blocked(user)
            if block_status['blocked']:
                return {
                    'success': False,
                    'message': f'Usuário bloqueado. Tente novamente em {block_status["remaining_minutes"]} minutos.',
                    'reason': 'blocked'
                }
            
            # Verificar se já está verificado
            if user.registration_verified:
                return {
                    'success': False,
                    'message': 'Este usuário já foi verificado.',
                    'reason': 'already_verified'
                }
            
            # Verificar código conforme método
            if method == 'email':
                from .email_service import TwoFactorEmailService
                result = TwoFactorEmailService.verify_registration_code(user, code)
            elif method == 'sms':
                from .sms_service import SMSService
                result = SMSService.verify_code(user, code)
            else:
                return {
                    'success': False,
                    'message': 'Método de verificação inválido'
                }
            
            if result['success']:
                # Limpar campos de verificação
                user.registration_code = None
                user.registration_code_expires_at = None
                user.registration_code_attempts = 0
                user.registration_code_blocked_until = None
                user.registration_verified = True
                user.save(update_fields=[
                    'registration_code', 'registration_code_expires_at', 
                    'registration_code_attempts', 'registration_code_blocked_until',
                    'registration_verified'
                ])
                
                logger.info(f"Usuário {user.email} verificado com sucesso via {method}")
            
            return result
                
        except Exception as e:
            logger.error(f"Erro ao verificar código: {str(e)}")
            return {
                'success': False,
                'message': 'Erro interno do servidor'
            }
    
    @staticmethod
    def get_verification_status(user):
        """
        Obtém status da verificação do usuário
        
        Args:
            user: Instância do usuário
        
        Returns:
            dict: Status da verificação
        """
        block_status = RegistrationVerificationService.is_user_blocked(user)
        
        return {
            'verified': user.registration_verified,
            'blocked': block_status['blocked'],
            'attempts_remaining': max(0, RegistrationVerificationService.MAX_ATTEMPTS - user.registration_code_attempts),
            'has_code': bool(user.registration_code),
            'code_expires_at': user.registration_code_expires_at.isoformat() if user.registration_code_expires_at else None,
            'blocked_until': block_status.get('blocked_until'),
            'remaining_minutes': block_status.get('remaining_minutes')
        }
