"""
Views para gerenciamento de entregadores e funcionalidades extras.
As views de autenticação estão em usuarios/auth/auth_views.py
"""
import base64
import logging
import uuid

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Entregador
from .auth.auth_serializers import UserProfileSerializer as EntregadorSerializer

logger = logging.getLogger(__name__)


class TestView(APIView):
    """View simples para testar se o backend está funcionando"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({'message': 'Backend funcionando!'})


class EntregadorViewSet(viewsets.ModelViewSet):
    """ViewSet para CRUD de entregadores"""
    queryset = Entregador.objects.all()
    serializer_class = EntregadorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        """Permite criar conta sem estar autenticado"""
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Retorna o perfil do usuário logado"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Atualiza perfil do entregador"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response({
                'success': True,
                'message': 'Perfil atualizado com sucesso',
                'user': serializer.data
            })
        except Exception as e:
            logger.error(f"Erro ao atualizar perfil: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'message': f'Erro ao atualizar perfil: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EntregadorMeView(APIView):
    """View para retornar dados do entregador logado"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = EntregadorSerializer(request.user)
        return Response(serializer.data)


class UploadFotoPerfilView(APIView):
    """View para upload de foto de perfil"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            foto_data = request.data.get('foto')
            
            if not foto_data:
                return Response(
                    {'error': 'Nenhuma foto fornecida'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Decodificar base64
            try:
                if ';base64,' in foto_data:
                    foto_data = foto_data.split(';base64,')[1]
                
                foto_bytes = base64.b64decode(foto_data)
            except Exception as e:
                logger.error(f"Erro ao decodificar base64: {str(e)}")
                return Response(
                    {'error': 'Formato de imagem inválido'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Remover foto antiga se existir
            if user.foto:
                try:
                    if default_storage.exists(user.foto.name):
                        default_storage.delete(user.foto.name)
                except Exception as e:
                    logger.warning(f"Erro ao remover foto antiga: {str(e)}")
            
            # Salvar nova foto
            filename = f"perfil_{user.id}_{uuid.uuid4().hex[:8]}.jpg"
            user.foto.save(filename, ContentFile(foto_bytes), save=True)
            logger.info(f"Foto atualizada para usuário: {user.email}")
            
            return Response({
                'success': True,
                'message': 'Foto atualizada com sucesso',
                'foto_url': user.foto.url if user.foto else None
            })
                
        except Exception as e:
            logger.error(f"Erro ao fazer upload da foto: {str(e)}", exc_info=True)
            return Response(
                {'error': f'Erro ao fazer upload da foto: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([AllowAny])
def check_username(request, username):
    """Verifica se um username já está em uso"""
    try:
        exists = Entregador.objects.filter(username=username).exists()
        return Response({
            'available': not exists,
            'username': username
        })
    except Exception as e:
        logger.error(f"Erro ao verificar username: {str(e)}")
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def change_password(request, pk):
    """Altera senha do usuário"""
    try:
        entregador = Entregador.objects.get(pk=pk)
        
        if entregador != request.user:
            return Response({
                'success': False,
                'message': 'Você só pode alterar sua própria senha'
            }, status=status.HTTP_403_FORBIDDEN)
        
        current_password = request.data.get('senhaAtual')
        new_password = request.data.get('novaSenha')
        
        if not current_password or not new_password:
            return Response({
                'success': False,
                'message': 'Senha atual e nova senha são obrigatórias'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not entregador.check_password(current_password):
            return Response({
                'success': False,
                'message': 'Senha atual incorreta'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if entregador.check_password(new_password):
            return Response({
                'success': False,
                'message': 'A nova senha deve ser diferente da atual'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        entregador.set_password(new_password)
        entregador.save()
        
        logger.info(f"Senha alterada para usuário: {entregador.email}")
        return Response({
            'success': True,
            'message': 'Senha alterada com sucesso'
        })
        
    except Entregador.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Entregador não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Erro ao alterar senha: {str(e)}", exc_info=True)
        return Response({
            'success': False,
            'message': f'Erro ao alterar senha: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EstatisticasUsuarioView(APIView):
    """View para estatísticas do usuário - delega para relatorios_dashboard"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from relatorios_dashboard.api_views import EstatisticasUsuarioView as NovaView
        return NovaView.as_view()(request._request)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_trabalho(request):
    """Relatório de trabalho - delega para relatorios_dashboard"""
    from relatorios_dashboard.api_views import relatorio_trabalho as nova_func
    return nova_func(request._request)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_despesas(request):
    """Relatório de despesas - delega para relatorios_dashboard"""
    from relatorios_dashboard.api_views import relatorio_despesas as nova_func
    return nova_func(request._request)