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
from .models import Entregador
from .auth_serializers import (
    LoginSerializer, RegisterSerializer, UserProfileSerializer,
    ChangePasswordSerializer, AdminCreateUserSerializer, UserListSerializer
)
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
            
            # Gerar tokens JWT
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
            
            # Gerar tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            # Usar serializer para dados do usuário criado
            user_serializer = UserProfileSerializer(user)
            
            logger.info(f"Novo usuário registrado: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Usuário criado com sucesso',
                'tokens': {
                    'access': access_token,
                    'refresh': refresh_token
                },
                'user': user_serializer.data
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
