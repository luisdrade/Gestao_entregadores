from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from .models import Entregador
from .auth_serializers import UserListSerializer
import logging

logger = logging.getLogger(__name__)

class AdminDashboardView(TemplateView):
    """
    View para o dashboard do admin
    """
    template_name = 'usuarios/admin_dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Estatísticas básicas
        total_entregadores = Entregador.objects.count()
        entregadores_ativos = Entregador.objects.filter(is_active=True).count()
        entregadores_inativos = Entregador.objects.filter(is_active=False).count()
        
        # Entregadores registrados hoje
        hoje = timezone.now().date()
        registrados_hoje = Entregador.objects.filter(date_joined__date=hoje).count()
        
        # Entregadores registrados na última semana
        semana_passada = hoje - timedelta(days=7)
        registrados_semana = Entregador.objects.filter(date_joined__date__gte=semana_passada).count()
        
        # Entregadores registrados no último mês
        mes_passado = hoje - timedelta(days=30)
        registrados_mes = Entregador.objects.filter(date_joined__date__gte=mes_passado).count()
        
        context.update({
            'total_entregadores': total_entregadores,
            'entregadores_ativos': entregadores_ativos,
            'entregadores_inativos': entregadores_inativos,
            'registrados_hoje': registrados_hoje,
            'registrados_semana': registrados_semana,
            'registrados_mes': registrados_mes,
        })
        
        return context

@method_decorator(csrf_exempt, name='dispatch')
class AdminUsersAPIView(APIView):
    """
    API para gerenciar usuários (apenas para admin)
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Listar todos os entregadores com filtros
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Parâmetros de filtro
            search = request.GET.get('search', '')
            status_filter = request.GET.get('status', 'all')  # all, active, inactive
            page = int(request.GET.get('page', 1))
            per_page = int(request.GET.get('per_page', 10))
            
            # Query base
            queryset = Entregador.objects.all()
            
            # Filtro de busca
            if search:
                queryset = queryset.filter(
                    Q(nome__icontains=search) |
                    Q(email__icontains=search) |
                    Q(cpf__icontains=search)
                )
            
            # Filtro de status
            if status_filter == 'active':
                queryset = queryset.filter(is_active=True)
            elif status_filter == 'inactive':
                queryset = queryset.filter(is_active=False)
            
            # Ordenação
            queryset = queryset.order_by('-date_joined')
            
            # Paginação
            start = (page - 1) * per_page
            end = start + per_page
            entregadores = queryset[start:end]
            
            # Serializar dados
            serializer = UserListSerializer(entregadores, many=True)
            
            # Estatísticas
            total_count = queryset.count()
            active_count = Entregador.objects.filter(is_active=True).count()
            inactive_count = Entregador.objects.filter(is_active=False).count()
            
            return Response({
                'success': True,
                'data': {
                    'entregadores': serializer.data,
                    'pagination': {
                        'page': page,
                        'per_page': per_page,
                        'total': total_count,
                        'total_pages': (total_count + per_page - 1) // per_page
                    },
                    'stats': {
                        'total': total_count,
                        'active': active_count,
                        'inactive': inactive_count
                    }
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao listar usuários: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self, request, user_id):
        """
        Ativar/desativar usuário
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Buscar usuário
            try:
                entregador = Entregador.objects.get(id=user_id)
            except Entregador.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Usuário não encontrado'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Atualizar status
            is_active = request.data.get('is_active')
            if is_active is not None:
                entregador.is_active = is_active
                entregador.save()
                
                status_text = 'ativado' if is_active else 'desativado'
                logger.info(f"Usuário {entregador.email} {status_text} pelo admin {request.user.email}")
                
                return Response({
                    'success': True,
                    'message': f'Usuário {status_text} com sucesso',
                    'data': UserListSerializer(entregador).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'error': 'Campo is_active é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            logger.error(f"Erro ao atualizar usuário: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@method_decorator(csrf_exempt, name='dispatch')
class AdminStatsAPIView(APIView):
    """
    API para estatísticas do admin
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """
        Obter estatísticas detalhadas
        """
        try:
            # Verificar se é admin
            if not request.user.is_staff:
                return Response({
                    'success': False,
                    'error': 'Acesso negado. Apenas administradores podem acessar esta funcionalidade.'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Estatísticas básicas
            total_entregadores = Entregador.objects.count()
            entregadores_ativos = Entregador.objects.filter(is_active=True).count()
            entregadores_inativos = Entregador.objects.filter(is_active=False).count()
            
            # Estatísticas por período
            hoje = timezone.now().date()
            semana_passada = hoje - timedelta(days=7)
            mes_passado = hoje - timedelta(days=30)
            
            registrados_hoje = Entregador.objects.filter(date_joined__date=hoje).count()
            registrados_semana = Entregador.objects.filter(date_joined__date__gte=semana_passada).count()
            registrados_mes = Entregador.objects.filter(date_joined__date__gte=mes_passado).count()
            
            # Estatísticas por mês (últimos 6 meses)
            stats_por_mes = []
            for i in range(6):
                data_inicio = hoje.replace(day=1) - timedelta(days=30*i)
                data_fim = data_inicio.replace(day=1) + timedelta(days=32)
                data_fim = data_fim.replace(day=1) - timedelta(days=1)
                
                count = Entregador.objects.filter(
                    date_joined__date__gte=data_inicio,
                    date_joined__date__lte=data_fim
                ).count()
                
                stats_por_mes.append({
                    'mes': data_inicio.strftime('%Y-%m'),
                    'count': count
                })
            
            return Response({
                'success': True,
                'data': {
                    'total_entregadores': total_entregadores,
                    'entregadores_ativos': entregadores_ativos,
                    'entregadores_inativos': entregadores_inativos,
                    'registrados_hoje': registrados_hoje,
                    'registrados_semana': registrados_semana,
                    'registrados_mes': registrados_mes,
                    'stats_por_mes': stats_por_mes
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas: {str(e)}")
            return Response({
                'success': False,
                'error': 'Erro interno do servidor'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
