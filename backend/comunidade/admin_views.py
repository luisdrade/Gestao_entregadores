from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Q, Count
from .models import Postagem, AnuncioVeiculo
from .serializers import PostagemSerializer, AnuncioVeiculoSerializer
import logging

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class AdminComunidadeAPIView(APIView):
    """
    API para administradores gerenciarem conteúdo da comunidade
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Listar posts e anúncios para moderação
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Parâmetros de filtro
            tipo = request.GET.get('tipo', 'all')  # all, postagens, anuncios
            status_filter = request.GET.get('status', 'all')  # all, aprovado, pendente, rejeitado, removido
            search = request.GET.get('search', '')
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Query base para postagens
            postagens_queryset = Postagem.objects.all()
            anuncios_queryset = AnuncioVeiculo.objects.all()
            
            # Filtro de busca
            if search:
                postagens_queryset = postagens_queryset.filter(
                    Q(titulo__icontains=search) |
                    Q(conteudo__icontains=search) |
                    Q(autor__icontains=search)
                )
                anuncios_queryset = anuncios_queryset.filter(
                    Q(modelo__icontains=search) |
                    Q(localizacao__icontains=search)
                )
            
            # Filtro de status
            if status_filter != 'all':
                postagens_queryset = postagens_queryset.filter(status=status_filter)
                anuncios_queryset = anuncios_queryset.filter(status=status_filter)
            
            # Paginação
            start = (page - 1) * per_page
            end = start + per_page
            
            # Serializar dados baseado no tipo
            if tipo == 'postagens':
                postagens = postagens_queryset[start:end]
                serializer = PostagemSerializer(postagens, many=True)
                total_count = postagens_queryset.count()
                
                return Response({
                    'success': True,
                    'data': {
                        'postagens': serializer.data,
                        'pagination': {
                            'page': page,
                            'per_page': per_page,
                            'total': total_count,
                            'total_pages': (total_count + per_page - 1) // per_page
                        }
                    }
                }, status=status.HTTP_200_OK)
                
            elif tipo == 'anuncios':
                anuncios = anuncios_queryset[start:end]
                serializer = AnuncioVeiculoSerializer(anuncios, many=True)
                total_count = anuncios_queryset.count()
                
                return Response({
                    'success': True,
                    'data': {
                        'anuncios': serializer.data,
                        'pagination': {
                            'page': page,
                            'per_page': per_page,
                            'total': total_count,
                            'total_pages': (total_count + per_page - 1) // per_page
                        }
                    }
                }, status=status.HTTP_200_OK)
            
            else:  # tipo == 'all'
                # Combinar postagens e anúncios
                postagens = postagens_queryset[:per_page//2]
                anuncios = anuncios_queryset[:per_page//2]
                
                postagens_serializer = PostagemSerializer(postagens, many=True)
                anuncios_serializer = AnuncioVeiculoSerializer(anuncios, many=True)
                
                total_postagens = postagens_queryset.count()
                total_anuncios = anuncios_queryset.count()
                
                return Response({
                    'success': True,
                    'data': {
                        'postagens': postagens_serializer.data,
                        'anuncios': anuncios_serializer.data,
                        'stats': {
                            'total_postagens': total_postagens,
                            'total_anuncios': total_anuncios,
                            'total_conteudo': total_postagens + total_anuncios
                        }
                    }
                }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao listar conteúdo da comunidade: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class AdminModerarPostagemAPIView(APIView):
    """
    API para moderar postagens específicas
    """
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, postagem_id):
        """
        Moderar uma postagem (aprovar, rejeitar, remover)
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Buscar postagem
            try:
                postagem = Postagem.objects.get(id=postagem_id)
            except Postagem.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Postagem não encontrada'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Atualizar status
            status_moderacao = request.data.get('status')
            motivo = request.data.get('motivo', '')
            
            if status_moderacao not in ['aprovado', 'pendente', 'rejeitado', 'removido']:
                return Response({
                    'success': False,
                    'error': 'Status inválido. Use: aprovado, pendente, rejeitado ou removido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Atualizar postagem
            postagem.status = status_moderacao
            postagem.moderado_por = request.user
            postagem.data_moderacao = timezone.now()
            postagem.motivo_moderacao = motivo
            postagem.is_visivel = status_moderacao in ['aprovado', 'pendente']
            postagem.save()
            
            # Log da ação
            logger.info(f"Postagem {postagem.id} moderada por {request.user.email}: {status_moderacao}")
            
            return Response({
                'success': True,
                'message': f'Postagem {status_moderacao} com sucesso',
                'data': PostagemSerializer(postagem).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao moderar postagem: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, postagem_id):
        """
        Deletar permanentemente uma postagem
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Buscar postagem
            try:
                postagem = Postagem.objects.get(id=postagem_id)
            except Postagem.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Postagem não encontrada'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Log antes de deletar
            logger.info(f"Postagem {postagem.id} deletada permanentemente por {request.user.email}")
            
            # Deletar postagem
            postagem.delete()
            
            return Response({
                'success': True,
                'message': 'Postagem deletada permanentemente'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao deletar postagem: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class AdminModerarAnuncioAPIView(APIView):
    """
    API para moderar anúncios específicos
    """
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, anuncio_id):
        """
        Moderar um anúncio (aprovar, rejeitar, remover)
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Buscar anúncio
            try:
                anuncio = AnuncioVeiculo.objects.get(id=anuncio_id)
            except AnuncioVeiculo.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Anúncio não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Atualizar status
            status_moderacao = request.data.get('status')
            motivo = request.data.get('motivo', '')
            
            if status_moderacao not in ['aprovado', 'pendente', 'rejeitado', 'removido']:
                return Response({
                    'success': False,
                    'error': 'Status inválido. Use: aprovado, pendente, rejeitado ou removido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Atualizar anúncio
            anuncio.status = status_moderacao
            anuncio.moderado_por = request.user
            anuncio.data_moderacao = timezone.now()
            anuncio.motivo_moderacao = motivo
            anuncio.is_visivel = status_moderacao in ['aprovado', 'pendente']
            anuncio.save()
            
            # Log da ação
            logger.info(f"Anúncio {anuncio.id} moderado por {request.user.email}: {status_moderacao}")
            
            return Response({
                'success': True,
                'message': f'Anúncio {status_moderacao} com sucesso',
                'data': AnuncioVeiculoSerializer(anuncio).data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao moderar anúncio: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, anuncio_id):
        """
        Deletar permanentemente um anúncio
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Buscar anúncio
            try:
                anuncio = AnuncioVeiculo.objects.get(id=anuncio_id)
            except AnuncioVeiculo.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Anúncio não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Log antes de deletar
            logger.info(f"Anúncio {anuncio.id} deletado permanentemente por {request.user.email}")
            
            # Deletar anúncio
            anuncio.delete()
            
            return Response({
                'success': True,
                'message': 'Anúncio deletado permanentemente'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao deletar anúncio: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class AdminComunidadeStatsAPIView(APIView):
    """
    API para estatísticas da comunidade (admin)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Obter estatísticas da comunidade
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Estatísticas de postagens
            total_postagens = Postagem.objects.count()
            postagens_aprovadas = Postagem.objects.filter(status='aprovado').count()
            postagens_pendentes = Postagem.objects.filter(status='pendente').count()
            postagens_rejeitadas = Postagem.objects.filter(status='rejeitado').count()
            postagens_removidas = Postagem.objects.filter(status='removido').count()
            
            # Estatísticas de anúncios
            total_anuncios = AnuncioVeiculo.objects.count()
            anuncios_aprovados = AnuncioVeiculo.objects.filter(status='aprovado').count()
            anuncios_pendentes = AnuncioVeiculo.objects.filter(status='pendente').count()
            anuncios_rejeitados = AnuncioVeiculo.objects.filter(status='rejeitado').count()
            anuncios_removidos = AnuncioVeiculo.objects.filter(status='removido').count()
            
            # Estatísticas por período (últimos 30 dias)
            from datetime import timedelta
            hoje = timezone.now().date()
            mes_passado = hoje - timedelta(days=30)
            
            postagens_mes = Postagem.objects.filter(data_criacao__date__gte=mes_passado).count()
            anuncios_mes = AnuncioVeiculo.objects.filter(data_publicacao__date__gte=mes_passado).count()
            
            return Response({
                'success': True,
                'data': {
                    'postagens': {
                        'total': total_postagens,
                        'aprovadas': postagens_aprovadas,
                        'pendentes': postagens_pendentes,
                        'rejeitadas': postagens_rejeitadas,
                        'removidas': postagens_removidas,
                        'ultimo_mes': postagens_mes
                    },
                    'anuncios': {
                        'total': total_anuncios,
                        'aprovados': anuncios_aprovados,
                        'pendentes': anuncios_pendentes,
                        'rejeitados': anuncios_rejeitados,
                        'removidos': anuncios_removidos,
                        'ultimo_mes': anuncios_mes
                    },
                    'total_conteudo': total_postagens + total_anuncios,
                    'conteudo_pendente': postagens_pendentes + anuncios_pendentes
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas da comunidade: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

