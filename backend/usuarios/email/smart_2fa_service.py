from django.utils import timezone
from datetime import timedelta
from ..models import Entregador, TrustedDevice
import logging

logger = logging.getLogger(__name__)

class Smart2FAService:
    """
    Serviço inteligente para decidir quando pedir 2FA
    """
    
    @staticmethod
    def should_require_2fa(user, device_id=None, device_name=None, device_type='mobile'):
        """
        Decide se deve pedir 2FA baseado em regras inteligentes
        
        Args:
            user: Usuário fazendo login
            device_id: ID único do dispositivo
            device_name: Nome do dispositivo
            device_type: Tipo do dispositivo
        
        Returns:
            dict: Resultado da decisão
        """
        try:
            # Se 2FA não está ativado, não pedir
            if not user.two_factor_enabled:
                return {
                    'require_2fa': False,
                    'reason': '2FA not enabled'
                }
            
            # Se usuário forçou 2FA (ex: clicou em "Fazer logout de todos os dispositivos")
            if user.two_factor_required:
                return {
                    'require_2fa': True,
                    'reason': 'User forced 2FA'
                }
            
            # Se não tem device_id, pedir 2FA (dispositivo desconhecido)
            if not device_id:
                return {
                    'require_2fa': True,
                    'reason': 'Unknown device'
                }
            
            # Verificar se é dispositivo confiável
            try:
                trusted_device = TrustedDevice.objects.get(
                    user=user,
                    device_id=device_id,
                    is_active=True
                )
                
                # Atualizar último uso
                trusted_device.last_used = timezone.now()
                trusted_device.save(update_fields=['last_used'])
                
                # Dispositivo confiável - não pedir 2FA
                return {
                    'require_2fa': False,
                    'reason': 'Trusted device',
                    'device_name': trusted_device.device_name
                }
                
            except TrustedDevice.DoesNotExist:
                # Dispositivo não confiável - pedir 2FA
                return {
                    'require_2fa': True,
                    'reason': 'Untrusted device'
                }
                
        except Exception as e:
            logger.error(f"Erro ao verificar 2FA: {str(e)}")
            # Em caso de erro, pedir 2FA por segurança
            return {
                'require_2fa': True,
                'reason': 'Error - defaulting to secure'
            }
    
    @staticmethod
    def add_trusted_device(user, device_id, device_name, device_type='mobile'):
        """
        Adiciona dispositivo como confiável após 2FA bem-sucedido
        
        Args:
            user: Usuário
            device_id: ID único do dispositivo
            device_name: Nome do dispositivo
            device_type: Tipo do dispositivo
        
        Returns:
            dict: Resultado da operação
        """
        try:
            # Criar ou atualizar dispositivo confiável
            device, created = TrustedDevice.objects.get_or_create(
                user=user,
                device_id=device_id,
                defaults={
                    'device_name': device_name,
                    'device_type': device_type,
                    'is_active': True
                }
            )
            
            if not created:
                # Atualizar dispositivo existente
                device.device_name = device_name
                device.device_type = device_type
                device.is_active = True
                device.last_used = timezone.now()
                device.save()
            
            # Limpar flag de 2FA obrigatório
            user.two_factor_required = False
            user.last_2fa_check = timezone.now()
            user.save(update_fields=['two_factor_required', 'last_2fa_check'])
            
            logger.info(f"Dispositivo confiável adicionado: {user.email} - {device_name}")
            
            return {
                'success': True,
                'message': 'Dispositivo adicionado como confiável',
                'device_name': device_name
            }
            
        except Exception as e:
            logger.error(f"Erro ao adicionar dispositivo confiável: {str(e)}")
            return {
                'success': False,
                'message': 'Erro ao adicionar dispositivo confiável'
            }
    
    @staticmethod
    def force_2fa_for_all_devices(user):
        """
        Força 2FA para todos os dispositivos (logout de todos)
        
        Args:
            user: Usuário
        
        Returns:
            dict: Resultado da operação
        """
        try:
            # Marcar que deve pedir 2FA no próximo login
            user.two_factor_required = True
            user.save(update_fields=['two_factor_required'])
            
            # Desativar todos os dispositivos confiáveis
            TrustedDevice.objects.filter(user=user).update(is_active=False)
            
            logger.info(f"2FA forçado para todos os dispositivos: {user.email}")
            
            return {
                'success': True,
                'message': '2FA será solicitado no próximo login de todos os dispositivos'
            }
            
        except Exception as e:
            logger.error(f"Erro ao forçar 2FA: {str(e)}")
            return {
                'success': False,
                'message': 'Erro ao forçar 2FA'
            }
    
    @staticmethod
    def get_trusted_devices(user):
        """
        Lista dispositivos confiáveis do usuário
        
        Args:
            user: Usuário
        
        Returns:
            list: Lista de dispositivos confiáveis
        """
        try:
            devices = TrustedDevice.objects.filter(
                user=user,
                is_active=True
            ).order_by('-last_used')
            
            return [
                {
                    'id': device.id,
                    'device_name': device.device_name,
                    'device_type': device.device_type,
                    'last_used': device.last_used.isoformat(),
                    'created_at': device.created_at.isoformat()
                }
                for device in devices
            ]
            
        except Exception as e:
            logger.error(f"Erro ao listar dispositivos confiáveis: {str(e)}")
            return []
    
    @staticmethod
    def remove_trusted_device(user, device_id):
        """
        Remove dispositivo confiável
        
        Args:
            user: Usuário
            device_id: ID do dispositivo
        
        Returns:
            dict: Resultado da operação
        """
        try:
            device = TrustedDevice.objects.get(
                user=user,
                device_id=device_id
            )
            
            device.is_active = False
            device.save(update_fields=['is_active'])
            
            logger.info(f"Dispositivo confiável removido: {user.email} - {device.device_name}")
            
            return {
                'success': True,
                'message': 'Dispositivo removido com sucesso'
            }
            
        except TrustedDevice.DoesNotExist:
            return {
                'success': False,
                'message': 'Dispositivo não encontrado'
            }
        except Exception as e:
            logger.error(f"Erro ao remover dispositivo confiável: {str(e)}")
            return {
                'success': False,
                'message': 'Erro ao remover dispositivo'
            }

