from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils import timezone
from ..models import Entregador
from .auth_serializers import (
    LoginSerializer, RegisterSerializer, UserProfileSerializer,
    ChangePasswordSerializer, AdminCreateUserSerializer, UserListSerializer,
    TwoFactorSetupSerializer, TwoFactorVerifySerializer, TwoFactorDisableSerializer
)
from ..email.registration_verification_service import RegistrationVerificationService
from ..email.email_service import TwoFactorEmailService
from ..email.smart_2fa_service import Smart2FAService
from email_config import EmailConfig
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """
    View para login de usuários (admin e entregador)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Tentar autenticar o usuário
            user = authenticate(request, email=email, password=password)
            
            if user is None:
                return Response({
                    'success': False,
                    'error': 'Credenciais inválidas'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            if not user.is_active:
                return Response({
                    'success': False,
                    'error': 'Conta desativada'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Atualizar last_login apenas se for login do app mobile
            # Verificar se é do app mobile através de múltiplos indicadores
            user_agent = request.META.get('HTTP_USER_AGENT', '')
            app_source = request.META.get('HTTP_X_APP_SOURCE', '')
            is_mobile_app = (
                request.data.get('is_mobile_app', False) or 
                app_source == 'mobile-app' or
                'mobile' in user_agent.lower() or
                'expo' in user_agent.lower()
            )
            
            if is_mobile_app:
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])
                logger.info(f"Last login atualizado para usuário: {user.email} (App Mobile)")
            else:
                logger.info(f"Login do usuário: {user.email} (Web) - Last login não atualizado")
            
            # Verificar se deve pedir 2FA usando sistema inteligente
            device_id = request.data.get('device_id')
            device_name = request.data.get('device_name', 'Dispositivo Mobile')
            device_type = request.data.get('device_type', 'mobile')
            
            smart_2fa_result = Smart2FAService.should_require_2fa(
                user, device_id, device_name, device_type
            )
            
            if smart_2fa_result['require_2fa']:
                # Enviar código 2FA por email
                email_result = TwoFactorEmailService.send_2fa_code(user, 'login')
                
                if not email_result['success']:
                    return Response({
                        'success': False,
                        'error': 'Erro ao enviar código de verificação'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
                return Response({
                    'success': True,
                    'message': 'Código de verificação enviado para seu email',
                    'requires_2fa': True,
                    'user_email': user.email,
                    'reason': smart_2fa_result['reason'],
                    'expires_at': email_result['expires_at']
                }, status=status.HTTP_200_OK)
            
            # Gerar tokens JWT (apenas se 2FA não estiver ativado)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Determinar tipo de usuário
            user_type = 'admin' if user.is_staff else 'entregador'
            
            # Usar serializer para dados do usuário
            user_serializer = UserProfileSerializer(user)
            user_data = user_serializer.data
            
            logger.info(f"Login bem-sucedido para usuário: {user.email} (Tipo: {user_type})")
            logger.info(f"Dados do usuário retornados: {user_data}")
            
            return Response({
                'success': True,
                'message': 'Login realizado com sucesso',
                'requires_2fa': False,
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'user': user_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro no login: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    """
    View para registro de novos entregadores
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            # Log dos dados recebidos para debug
            logger.info(f"Dados recebidos no registro: {request.data}")
            logger.info(f"Tipo dos dados: {type(request.data)}")
            logger.info(f"Headers: {request.headers}")
            
            serializer = RegisterSerializer(data=request.data)
            if not serializer.is_valid():
                logger.error(f"Erro de validação no serializer: {serializer.errors}")
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar o usuário usando o serializer
            user = serializer.save()
            
            # Usar serializer para dados do usuário criado
            user_serializer = UserProfileSerializer(user)
            
            logger.info(f"Novo usuário registrado: {user.email} - Aguardando verificação")
            
            # Retornar resposta indicando que precisa de verificação
            # NÃO gerar tokens JWT ainda - só após verificação
            return Response({
                'success': True,
                'message': 'Cadastro realizado com sucesso. Verificação necessária.',
                'requires_verification': True,
                'user_email': user.email,
                'user_phone': user.telefone,
                'user_data': user_serializer.data
            }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"Erro no registro: {str(e)}")
            logger.error(f"Tipo do erro: {type(e)}")
            import traceback
            logger.error(f"Traceback completo: {traceback.format_exc()}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """
    View para logout de usuários
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            # Em um sistema JWT, o logout é feito no frontend
            # Aqui podemos registrar o logout para auditoria
            logger.info(f"Logout realizado para usuário: {request.user.email}")
            
            return Response({
                'success': True,
                'message': 'Logout realizado com sucesso'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro no logout: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class RefreshTokenView(APIView):
    """
    View para renovar o token de acesso
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            
            if not refresh_token:
                return Response({
                    'success': False,
                    'error': 'Token de refresh é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar e renovar o token
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            return Response({
                'success': True,
                'access': access_token
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro na renovação do token: {str(e)}")
            return Response({
                'success': False,
                'error': 'Token inválido ou expirado'
            }, status=status.HTTP_401_UNAUTHORIZED)

@method_decorator(csrf_exempt, name='dispatch')
class UserProfileView(APIView):
    """
    View para obter e atualizar perfil do usuário
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Obter perfil do usuário logado"""
        try:
            user = request.user
            serializer = UserProfileSerializer(user)
            
            return Response({
                'success': True,
                'user': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao obter perfil: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        """Atualizar perfil do usuário logado"""
        try:
            user = request.user
            
            # Usar serializer para validação e atualização
            serializer = UserProfileSerializer(user, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            serializer.save()
            
            logger.info(f"Perfil atualizado para usuário: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Perfil atualizado com sucesso',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao atualizar perfil: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class ChangePasswordView(APIView):
    """
    View para alterar senha do usuário
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            serializer = ChangePasswordSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            current_password = serializer.validated_data['current_password']
            new_password = serializer.validated_data['new_password']
            
            # Verificar se a senha atual está correta
            if not user.check_password(current_password):
                return Response({
                    'success': False,
                    'error': 'Senha atual incorreta'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se a nova senha é diferente da atual
            if user.check_password(new_password):
                return Response({
                    'success': False,
                    'error': 'A nova senha deve ser diferente da atual'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Alterar a senha
            user.set_password(new_password)
            user.save()
            
            logger.info(f"Senha alterada para usuário: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Senha alterada com sucesso'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao alterar senha: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class AdminUserManagementView(APIView):
    """
    View para administradores gerenciarem usuários
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Listar todos os usuários (apenas para admin)"""
        try:
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            users = Entregador.objects.all().order_by('-date_joined')
            serializer = UserListSerializer(users, many=True)
            
            return Response({
                'success': True,
                'users': serializer.data,
                'total': len(serializer.data)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao listar usuários: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request):
        """Criar novo usuário (apenas para admin)"""
        try:
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            serializer = AdminCreateUserSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar o usuário usando o serializer
            user = serializer.save()
            
            logger.info(f"Novo usuário criado por admin {request.user.email}: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Usuário criado com sucesso',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)
                
        except Exception as e:
            logger.error(f"Erro ao criar usuário: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TwoFactorLoginView(APIView):
    """
    View para verificar código 2FA durante o login
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            code = request.data.get('code')
            
            if not email or not code:
                return Response({
                    'success': False,
                    'error': 'Email e código são obrigatórios'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Buscar usuário
            try:
                user = Entregador.objects.get(email=email)
            except Entregador.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Usuário não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Verificar se 2FA está ativado
            if not user.two_factor_enabled:
                return Response({
                    'success': False,
                    'error': '2FA não está ativado para este usuário'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar código usando o serviço de email
            verification_result = TwoFactorEmailService.verify_code(user, code, 'login')
            
            if not verification_result['success']:
                return Response({
                    'success': False,
                    'error': verification_result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Adicionar dispositivo como confiável
            device_id = request.data.get('device_id')
            device_name = request.data.get('device_name', 'Dispositivo Mobile')
            device_type = request.data.get('device_type', 'mobile')
            
            if device_id:
                Smart2FAService.add_trusted_device(user, device_id, device_name, device_type)
            
            # Gerar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Determinar tipo de usuário
            user_type = 'admin' if user.is_staff else 'entregador'
            
            # Usar serializer para dados do usuário
            user_serializer = UserProfileSerializer(user)
            user_data = user_serializer.data
            
            logger.info(f"Login 2FA bem-sucedido para usuário: {user.email} (Tipo: {user_type})")
            
            return Response({
                'success': True,
                'message': 'Login realizado com sucesso',
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'user': user_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro no login 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ==================== VIEWS DE 2FA ====================

@method_decorator(csrf_exempt, name='dispatch')
class TwoFactorSetupView(APIView):
    """
    View para configurar 2FA via email
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            
            # Se já tem 2FA ativado, retornar erro
            if user.two_factor_enabled:
                return Response({
                    'success': False,
                    'error': '2FA já está ativado para este usuário'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enviar código de verificação por email
            email_result = TwoFactorEmailService.send_2fa_code(user, 'setup')
            
            if not email_result['success']:
                return Response({
                    'success': False,
                    'error': email_result['message']
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.info(f"2FA setup iniciado para usuário: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Código de verificação enviado para seu email',
                'email': user.email,
                'expires_at': email_result['expires_at']
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro no setup 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TwoFactorVerifyView(APIView):
    """
    View para verificar código 2FA e ativar
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            serializer = TwoFactorVerifySerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            code = serializer.validated_data['code']
            
            # Verificar código usando o serviço de email
            verification_result = TwoFactorEmailService.verify_code(user, code, 'setup')
            
            if not verification_result['success']:
                return Response({
                    'success': False,
                    'error': verification_result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Ativar 2FA
            user.two_factor_enabled = True
            user.save(update_fields=['two_factor_enabled'])
            
            logger.info(f"2FA ativado para usuário: {user.email}")
            
            return Response({
                'success': True,
                'message': '2FA ativado com sucesso'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro na verificação 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TwoFactorDisableView(APIView):
    """
    View para desabilitar 2FA
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            serializer = TwoFactorDisableSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'success': False,
                    'error': 'Dados inválidos',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user = request.user
            password = serializer.validated_data['password']
            code = serializer.validated_data['code']
            
            # Verificar senha
            if not user.check_password(password):
                return Response({
                    'success': False,
                    'error': 'Senha incorreta'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se 2FA está ativado
            if not user.two_factor_enabled:
                return Response({
                    'success': False,
                    'error': '2FA não está ativado'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enviar código de verificação por email primeiro
            email_result = TwoFactorEmailService.send_2fa_code(user, 'disable')
            
            if not email_result['success']:
                return Response({
                    'success': False,
                    'error': email_result['message']
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Verificar código usando o serviço de email
            verification_result = TwoFactorEmailService.verify_code(user, code, 'disable')
            
            if not verification_result['success']:
                return Response({
                    'success': False,
                    'error': verification_result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Desabilitar 2FA
            user.two_factor_enabled = False
            user.save(update_fields=['two_factor_enabled'])
            
            logger.info(f"2FA desabilitado para usuário: {user.email}")
            
            return Response({
                'success': True,
                'message': '2FA desabilitado com sucesso'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao desabilitar 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TwoFactorStatusView(APIView):
    """
    View para verificar status do 2FA
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            
            return Response({
                'success': True,
                'two_factor_enabled': user.two_factor_enabled,
                'email': user.email
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao verificar status 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TwoFactorResendView(APIView):
    """
    View para reenviar código 2FA
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            purpose = request.data.get('purpose', 'login')
            
            if not email:
                return Response({
                    'success': False,
                    'error': 'Email é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Buscar usuário
            try:
                user = Entregador.objects.get(email=email)
            except Entregador.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Usuário não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Verificar se 2FA está ativado (exceto para setup)
            if purpose != 'setup' and not user.two_factor_enabled:
                return Response({
                    'success': False,
                    'error': '2FA não está ativado para este usuário'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enviar código
            email_result = TwoFactorEmailService.send_2fa_code(user, purpose)
            
            if not email_result['success']:
                return Response({
                    'success': False,
                    'error': email_result['message']
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.info(f"Código 2FA reenviado para {user.email} (purpose: {purpose})")
            
            return Response({
                'success': True,
                'message': 'Código reenviado com sucesso',
                'email': user.email,
                'expires_at': email_result['expires_at']
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao reenviar código 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TrustedDevicesView(APIView):
    """
    View para gerenciar dispositivos confiáveis
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Listar dispositivos confiáveis"""
        try:
            user = request.user
            devices = Smart2FAService.get_trusted_devices(user)
            
            return Response({
                'success': True,
                'devices': devices
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao listar dispositivos confiáveis: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request):
        """Remover dispositivo confiável"""
        try:
            user = request.user
            device_id = request.data.get('device_id')
            
            if not device_id:
                return Response({
                    'success': False,
                    'error': 'ID do dispositivo é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            result = Smart2FAService.remove_trusted_device(user, device_id)
            
            if not result['success']:
                return Response({
                    'success': False,
                    'error': result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({
                'success': True,
                'message': result['message']
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao remover dispositivo confiável: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class Force2FAView(APIView):
    """
    View para forçar 2FA em todos os dispositivos (logout de todos)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            
            result = Smart2FAService.force_2fa_for_all_devices(user)
            
            if not result['success']:
                return Response({
                    'success': False,
                    'error': result['message']
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            logger.info(f"2FA forçado para todos os dispositivos: {user.email}")
            
            return Response({
                'success': True,
                'message': result['message']
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao forçar 2FA: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class TestEmailView(APIView):
    """
    View para testar configuração de email
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            
            # Testar configuração de email
            email_test = EmailConfig.test_email_connection()
            
            if email_test['success']:
                # Enviar email de teste real
                test_result = TwoFactorEmailService.send_2fa_code(user, 'login')
                
                if test_result['success']:
                    return Response({
                        'success': True,
                        'message': 'Email de teste enviado com sucesso!',
                        'email_config': email_test['config'],
                        'test_email_sent': True
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        'success': False,
                        'error': 'Configuração OK, mas falha ao enviar email de teste',
                        'email_config': email_test['config']
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({
                    'success': False,
                    'error': email_test['message'],
                    'email_config': email_test['config']
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Erro ao testar email: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class RegistrationVerifyView(APIView):
    """
    View para verificar código de verificação pós-cadastro
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            code = request.data.get('code')
            verification_method = request.data.get('verification_method', 'email')
            
            if not email or not code:
                return Response({
                    'success': False,
                    'error': 'Email e código são obrigatórios'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Buscar usuário
            try:
                user = Entregador.objects.get(email=email)
            except Entregador.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Usuário não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Verificar se já está verificado
            if user.registration_verified:
                return Response({
                    'success': False,
                    'error': 'Este usuário já foi verificado'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar código usando o serviço unificado
            verification_result = RegistrationVerificationService.verify_code(
                user, code, verification_method
            )
            
            if not verification_result['success']:
                return Response({
                    'success': False,
                    'error': verification_result['message']
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Gerar tokens JWT após verificação bem-sucedida
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Usar serializer para dados do usuário
            user_serializer = UserProfileSerializer(user)
            user_data = user_serializer.data
            
            logger.info(f"Usuário {user.email} verificado com sucesso via {verification_method}")
            
            return Response({
                'success': True,
                'message': 'Verificação realizada com sucesso',
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'user': user_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro na verificação de cadastro: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class RegistrationResendView(APIView):
    """
    View para reenviar código de verificação pós-cadastro
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        try:
            email = request.data.get('email')
            verification_method = request.data.get('verification_method', 'email')
            
            if not email:
                return Response({
                    'success': False,
                    'error': 'Email é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Buscar usuário
            try:
                user = Entregador.objects.get(email=email)
            except Entregador.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Usuário não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Verificar se já está verificado
            if user.registration_verified:
                return Response({
                    'success': False,
                    'error': 'Este usuário já foi verificado'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Enviar código usando o serviço unificado
            send_result = RegistrationVerificationService.send_verification_code(
                user, verification_method
            )
            
            if not send_result['success']:
                return Response({
                    'success': False,
                    'error': send_result['message'],
                    'reason': send_result.get('reason')
                }, status=status.HTTP_400_BAD_REQUEST)
            
            logger.info(f"Código de verificação reenviado para {user.email} via {verification_method}")
            
            return Response({
                'success': True,
                'message': send_result['message'],
                'expires_at': send_result['expires_at'],
                'attempts_remaining': send_result.get('attempts_remaining', 0)
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao reenviar código de verificação: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
