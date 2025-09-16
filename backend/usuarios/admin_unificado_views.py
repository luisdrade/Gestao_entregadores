from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import Entregador
from comunidade.models import Postagem, AnuncioVeiculo
from comunidade.admin_views import AdminComunidadeStatsAPIView
import logging

logger = logging.getLogger(__name__)

def admin_required(view_func):
    """Decorator para verificar se o usuário é admin"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            messages.error(request, 'Você precisa estar logado para acessar esta página.')
            return redirect('usuarios:login')
        
        if not request.user.is_staff:
            messages.error(request, 'Acesso negado. Apenas administradores podem acessar esta página.')
            return redirect('comunidade')
        
        return view_func(request, *args, **kwargs)
    return wrapper

@login_required
@admin_required
def admin_unificado_dashboard(request):
    """Dashboard principal unificado"""
    try:
        # Estatísticas de usuários
        total_usuarios = Entregador.objects.count()
        usuarios_ativos = Entregador.objects.filter(is_active=True).count()
        usuarios_inativos = Entregador.objects.filter(is_active=False).count()
        
        # Usuários do último mês
        mes_passado = timezone.now().date() - timedelta(days=30)
        usuarios_mes = Entregador.objects.filter(date_joined__date__gte=mes_passado).count()
        
        # Estatísticas da comunidade
        total_postagens = Postagem.objects.count()
        total_anuncios = AnuncioVeiculo.objects.count()
        total_conteudo = total_postagens + total_anuncios
        
        # Status do conteúdo
        postagens_aprovadas = Postagem.objects.filter(status='aprovado').count()
        postagens_pendentes = Postagem.objects.filter(status='pendente').count()
        postagens_rejeitadas = Postagem.objects.filter(status='rejeitado').count()
        postagens_removidas = Postagem.objects.filter(status='removido').count()
        
        anuncios_aprovados = AnuncioVeiculo.objects.filter(status='aprovado').count()
        anuncios_pendentes = AnuncioVeiculo.objects.filter(status='pendente').count()
        anuncios_rejeitados = AnuncioVeiculo.objects.filter(status='rejeitado').count()
        anuncios_removidos = AnuncioVeiculo.objects.filter(status='removido').count()
        
        conteudo_aprovado = postagens_aprovadas + anuncios_aprovados
        conteudo_pendente = postagens_pendentes + anuncios_pendentes
        conteudo_rejeitado = postagens_rejeitadas + anuncios_rejeitados
        conteudo_removido = postagens_removidas + anuncios_removidos
        
        # Conteúdo do último mês
        conteudo_mes = Postagem.objects.filter(data_criacao__date__gte=mes_passado).count() + \
                      AnuncioVeiculo.objects.filter(data_publicacao__date__gte=mes_passado).count()
        
        # Conteúdo pendente (últimos 10)
        postagens_pendentes_list = Postagem.objects.filter(status='pendente').order_by('-data_criacao')[:5]
        anuncios_pendentes_list = AnuncioVeiculo.objects.filter(status='pendente').order_by('-data_publicacao')[:5]
        
        pending_content = []
        for post in postagens_pendentes_list:
            pending_content.append({
                'type': 'postagem',
                'id': post.id,
                'titulo': post.titulo,
                'autor': post.autor,
                'data': post.data_criacao
            })
        
        for anuncio in anuncios_pendentes_list:
            pending_content.append({
                'type': 'anuncio',
                'id': anuncio.id,
                'modelo': anuncio.modelo,
                'ano': anuncio.ano,
                'autor': 'Sistema',
                'data': anuncio.data_publicacao
            })
        
        # Ordenar por data
        pending_content.sort(key=lambda x: x['data'], reverse=True)
        
        # Atividade recente (simulada - você pode implementar um sistema de logs)
        recent_activity = [
            {
                'icon': 'user-check',
                'color': 'success',
                'title': 'Usuário Ativado',
                'message': 'João Silva foi ativado pelo sistema',
                'time': '2 horas atrás'
            },
            {
                'icon': 'check',
                'color': 'success',
                'title': 'Postagem Aprovada',
                'message': 'Postagem "Dicas de entrega" foi aprovada',
                'time': '4 horas atrás'
            },
            {
                'icon': 'times',
                'color': 'danger',
                'title': 'Anúncio Rejeitado',
                'message': 'Anúncio "Honda CG 160" foi rejeitado',
                'time': '6 horas atrás'
            },
            {
                'icon': 'user-plus',
                'color': 'info',
                'title': 'Novo Usuário',
                'message': 'Maria Santos se registrou no sistema',
                'time': '8 horas atrás'
            }
        ]
        
        context = {
            'stats': {
                'total_usuarios': total_usuarios,
                'usuarios_ativos': usuarios_ativos,
                'usuarios_inativos': usuarios_inativos,
                'usuarios_mes': usuarios_mes,
                'total_postagens': total_postagens,
                'total_anuncios': total_anuncios,
                'total_conteudo': total_conteudo,
                'conteudo_aprovado': conteudo_aprovado,
                'conteudo_pendente': conteudo_pendente,
                'conteudo_rejeitado': conteudo_rejeitado,
                'conteudo_removido': conteudo_removido,
                'conteudo_mes': conteudo_mes,
                'postagens_pendentes': postagens_pendentes,
                'anuncios_pendentes': anuncios_pendentes,
            },
            'pending_content': pending_content[:10],
            'recent_activity': recent_activity
        }
        
        return render(request, 'usuarios/dashboard_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro no dashboard unificado: {str(e)}")
        messages.error(request, 'Erro ao carregar o dashboard.')
        return render(request, 'usuarios/dashboard_unificado.html', {
            'stats': {
                'total_usuarios': 0,
                'usuarios_ativos': 0,
                'usuarios_inativos': 0,
                'usuarios_mes': 0,
                'total_postagens': 0,
                'total_anuncios': 0,
                'total_conteudo': 0,
                'conteudo_aprovado': 0,
                'conteudo_pendente': 0,
                'conteudo_rejeitado': 0,
                'conteudo_removido': 0,
                'conteudo_mes': 0,
                'postagens_pendentes': 0,
                'anuncios_pendentes': 0,
            },
            'pending_content': [],
            'recent_activity': []
        })

@login_required
@admin_required
def admin_unificado_usuarios(request):
    """Listagem de usuários para moderação"""
    try:
        # Parâmetros de filtro
        search = request.GET.get('search', '')
        status_filter = request.GET.get('status', 'all')
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
        paginator = Paginator(queryset, per_page)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        # Estatísticas
        total_count = queryset.count()
        active_count = Entregador.objects.filter(is_active=True).count()
        inactive_count = Entregador.objects.filter(is_active=False).count()
        
        context = {
            'usuarios': page_obj,
            'pagination': {
                'page': page_obj.number,
                'per_page': per_page,
                'total': paginator.count,
                'total_pages': paginator.num_pages,
                'page_range': range(1, paginator.num_pages + 1)
            },
            'stats': {
                'total': total_count,
                'active': active_count,
                'inactive': inactive_count
            }
        }
        
        return render(request, 'usuarios/usuarios_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro na listagem de usuários: {str(e)}")
        messages.error(request, 'Erro ao carregar os usuários.')
        return render(request, 'usuarios/usuarios_unificado.html', {
            'usuarios': [],
            'pagination': {'page': 1, 'per_page': 10, 'total': 0, 'total_pages': 0, 'page_range': []},
            'stats': {'total': 0, 'active': 0, 'inactive': 0}
        })

@login_required
@admin_required
def admin_unificado_posts(request):
    """Listagem de postagens para moderação"""
    try:
        # Parâmetros de filtro
        search = request.GET.get('search', '')
        status_filter = request.GET.get('status', 'all')
        per_page = int(request.GET.get('per_page', 10))
        
        # Query base
        queryset = Postagem.objects.all()
        
        # Filtro de busca
        if search:
            queryset = queryset.filter(
                Q(titulo__icontains=search) |
                Q(conteudo__icontains=search) |
                Q(autor__icontains=search)
            )
        
        # Filtro de status
        if status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        # Ordenação
        queryset = queryset.order_by('-data_criacao')
        
        # Paginação
        paginator = Paginator(queryset, per_page)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        context = {
            'postagens': page_obj,
            'pagination': {
                'page': page_obj.number,
                'per_page': per_page,
                'total': paginator.count,
                'total_pages': paginator.num_pages,
                'page_range': range(1, paginator.num_pages + 1)
            }
        }
        
        return render(request, 'usuarios/posts_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro na listagem de postagens: {str(e)}")
        messages.error(request, 'Erro ao carregar as postagens.')
        return render(request, 'usuarios/posts_unificado.html', {
            'postagens': [],
            'pagination': {'page': 1, 'per_page': 10, 'total': 0, 'total_pages': 0, 'page_range': []}
        })

@login_required
@admin_required
def admin_unificado_anuncios(request):
    """Listagem de anúncios para moderação"""
    try:
        # Parâmetros de filtro
        search = request.GET.get('search', '')
        status_filter = request.GET.get('status', 'all')
        per_page = int(request.GET.get('per_page', 10))
        
        # Query base
        queryset = AnuncioVeiculo.objects.all()
        
        # Filtro de busca
        if search:
            queryset = queryset.filter(
                Q(modelo__icontains=search) |
                Q(localizacao__icontains=search)
            )
        
        # Filtro de status
        if status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        
        # Ordenação
        queryset = queryset.order_by('-data_publicacao')
        
        # Paginação
        paginator = Paginator(queryset, per_page)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        
        context = {
            'anuncios': page_obj,
            'pagination': {
                'page': page_obj.number,
                'per_page': per_page,
                'total': paginator.count,
                'total_pages': paginator.num_pages,
                'page_range': range(1, paginator.num_pages + 1)
            }
        }
        
        return render(request, 'usuarios/anuncios_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro na listagem de anúncios: {str(e)}")
        messages.error(request, 'Erro ao carregar os anúncios.')
        return render(request, 'usuarios/anuncios_unificado.html', {
            'anuncios': [],
            'pagination': {'page': 1, 'per_page': 10, 'total': 0, 'total_pages': 0, 'page_range': []}
        })

@login_required
@admin_required
def admin_unificado_moderar(request, item_type, item_id):
    """Página de moderação individual unificada"""
    try:
        if item_type == 'postagem':
            item = get_object_or_404(Postagem, id=item_id)
        elif item_type == 'anuncio':
            item = get_object_or_404(AnuncioVeiculo, id=item_id)
        else:
            messages.error(request, 'Tipo de item inválido.')
            return redirect('admin_unificado_dashboard')
        
        context = {
            'item': item,
            'item_type': item_type
        }
        
        return render(request, 'usuarios/moderar_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro na moderação individual: {str(e)}")
        messages.error(request, 'Erro ao carregar o item para moderação.')
        return redirect('admin_unificado_dashboard')

@login_required
@admin_required
def admin_unificado_usuarios_stats(request):
    """Estatísticas de usuários"""
    try:
        # Estatísticas básicas
        total_usuarios = Entregador.objects.count()
        usuarios_ativos = Entregador.objects.filter(is_active=True).count()
        usuarios_inativos = Entregador.objects.filter(is_active=False).count()
        
        # Estatísticas por período
        hoje = timezone.now().date()
        semana_passada = hoje - timedelta(days=7)
        mes_passado = hoje - timedelta(days=30)
        
        usuarios_hoje = Entregador.objects.filter(date_joined__date=hoje).count()
        usuarios_semana = Entregador.objects.filter(date_joined__date__gte=semana_passada).count()
        usuarios_mes = Entregador.objects.filter(date_joined__date__gte=mes_passado).count()
        
        context = {
            'stats': {
                'total_usuarios': total_usuarios,
                'usuarios_ativos': usuarios_ativos,
                'usuarios_inativos': usuarios_inativos,
                'usuarios_hoje': usuarios_hoje,
                'usuarios_semana': usuarios_semana,
                'usuarios_mes': usuarios_mes,
            }
        }
        
        return render(request, 'usuarios/stats_usuarios_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro nas estatísticas de usuários: {str(e)}")
        messages.error(request, 'Erro ao carregar as estatísticas de usuários.')
        return render(request, 'usuarios/stats_usuarios_unificado.html', {
            'stats': {
                'total_usuarios': 0,
                'usuarios_ativos': 0,
                'usuarios_inativos': 0,
                'usuarios_hoje': 0,
                'usuarios_semana': 0,
                'usuarios_mes': 0,
            }
        })

@login_required
@admin_required
def admin_unificado_comunidade_stats(request):
    """Estatísticas da comunidade"""
    try:
        # Usar a mesma lógica da API de estatísticas
        api_view = AdminComunidadeStatsAPIView()
        api_view.request = request
        api_view.format_kwarg = None
        
        # Simular uma requisição GET
        response = api_view.get(request)
        
        if response.status_code == 200:
            stats = response.data['data']
        else:
            # Fallback para estatísticas básicas
            stats = {
                'postagens': {
                    'total': Postagem.objects.count(),
                    'aprovadas': Postagem.objects.filter(status='aprovado').count(),
                    'pendentes': Postagem.objects.filter(status='pendente').count(),
                    'rejeitadas': Postagem.objects.filter(status='rejeitado').count(),
                    'removidas': Postagem.objects.filter(status='removido').count(),
                    'ultimo_mes': 0
                },
                'anuncios': {
                    'total': AnuncioVeiculo.objects.count(),
                    'aprovados': AnuncioVeiculo.objects.filter(status='aprovado').count(),
                    'pendentes': AnuncioVeiculo.objects.filter(status='pendente').count(),
                    'rejeitados': AnuncioVeiculo.objects.filter(status='rejeitado').count(),
                    'removidos': AnuncioVeiculo.objects.filter(status='removido').count(),
                    'ultimo_mes': 0
                },
                'total_conteudo': 0,
                'conteudo_pendente': 0,
                'stats_por_mes': []
            }
        
        context = {
            'stats': stats
        }
        
        return render(request, 'usuarios/stats_comunidade_unificado.html', context)
        
    except Exception as e:
        logger.error(f"Erro nas estatísticas da comunidade: {str(e)}")
        messages.error(request, 'Erro ao carregar as estatísticas da comunidade.')
        return render(request, 'usuarios/stats_comunidade_unificado.html', {
            'stats': {
                'postagens': {'total': 0, 'aprovadas': 0, 'pendentes': 0, 'rejeitadas': 0, 'removidas': 0, 'ultimo_mes': 0},
                'anuncios': {'total': 0, 'aprovados': 0, 'pendentes': 0, 'rejeitados': 0, 'removidos': 0, 'ultimo_mes': 0},
                'total_conteudo': 0,
                'conteudo_pendente': 0,
                'stats_por_mes': []
            }
        })





