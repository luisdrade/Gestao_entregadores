from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta
from .models import Postagem, AnuncioVeiculo
from .admin_views import AdminComunidadeStatsAPIView
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
def admin_dashboard(request):
    """Dashboard principal de moderação"""
    try:
        # Estatísticas básicas
        total_postagens = Postagem.objects.count()
        total_anuncios = AnuncioVeiculo.objects.count()
        
        # Estatísticas por status
        postagens_stats = {
            'total': total_postagens,
            'aprovadas': Postagem.objects.filter(status='aprovado').count(),
            'pendentes': Postagem.objects.filter(status='pendente').count(),
            'rejeitadas': Postagem.objects.filter(status='rejeitado').count(),
            'removidas': Postagem.objects.filter(status='removido').count(),
        }
        
        anuncios_stats = {
            'total': total_anuncios,
            'aprovados': AnuncioVeiculo.objects.filter(status='aprovado').count(),
            'pendentes': AnuncioVeiculo.objects.filter(status='pendente').count(),
            'rejeitados': AnuncioVeiculo.objects.filter(status='rejeitado').count(),
            'removidos': AnuncioVeiculo.objects.filter(status='removido').count(),
        }
        
        # Conteúdo pendente (últimos 10)
        postagens_pendentes = Postagem.objects.filter(status='pendente').order_by('-data_criacao')[:5]
        anuncios_pendentes = AnuncioVeiculo.objects.filter(status='pendente').order_by('-data_publicacao')[:5]
        
        pending_content = []
        for post in postagens_pendentes:
            pending_content.append({
                'type': 'postagem',
                'id': post.id,
                'titulo': post.titulo,
                'autor': post.autor,
                'data': post.data_criacao
            })
        
        for anuncio in anuncios_pendentes:
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
                'icon': 'check',
                'color': 'success',
                'time': '2 horas atrás',
                'message': 'Postagem "Dicas de entrega" aprovada'
            },
            {
                'icon': 'times',
                'color': 'danger',
                'time': '4 horas atrás',
                'message': 'Anúncio "Honda CG 160" rejeitado'
            },
            {
                'icon': 'comment',
                'color': 'info',
                'time': '6 horas atrás',
                'message': 'Nova postagem criada por João Silva'
            }
        ]
        
        context = {
            'stats': {
                'total_conteudo': total_postagens + total_anuncios,
                'conteudo_pendente': postagens_stats['pendentes'] + anuncios_stats['pendentes'],
                'postagens': postagens_stats,
                'anuncios': anuncios_stats,
            },
            'pending_content': pending_content[:10],
            'recent_activity': recent_activity
        }
        
        return render(request, 'comunidade/admin/dashboard.html', context)
        
    except Exception as e:
        logger.error(f"Erro no dashboard admin: {str(e)}")
        messages.error(request, 'Erro ao carregar o dashboard.')
        return render(request, 'comunidade/admin/dashboard.html', {
            'stats': {
                'total_conteudo': 0,
                'conteudo_pendente': 0,
                'postagens': {'total': 0, 'aprovadas': 0, 'pendentes': 0, 'rejeitadas': 0, 'removidas': 0},
                'anuncios': {'total': 0, 'aprovados': 0, 'pendentes': 0, 'rejeitados': 0, 'removidos': 0},
            },
            'pending_content': [],
            'recent_activity': []
        })

@login_required
@admin_required
def admin_posts(request):
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
        
        # Estatísticas
        total_count = queryset.count()
        active_count = Postagem.objects.filter(is_visivel=True).count()
        inactive_count = Postagem.objects.filter(is_visivel=False).count()
        
        context = {
            'postagens': page_obj,
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
        
        return render(request, 'comunidade/admin/posts.html', context)
        
    except Exception as e:
        logger.error(f"Erro na listagem de postagens: {str(e)}")
        messages.error(request, 'Erro ao carregar as postagens.')
        return render(request, 'comunidade/admin/posts.html', {
            'postagens': [],
            'pagination': {'page': 1, 'per_page': 10, 'total': 0, 'total_pages': 0, 'page_range': []},
            'stats': {'total': 0, 'active': 0, 'inactive': 0}
        })

@login_required
@admin_required
def admin_anuncios(request):
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
        
        # Estatísticas
        total_count = queryset.count()
        active_count = AnuncioVeiculo.objects.filter(is_visivel=True).count()
        inactive_count = AnuncioVeiculo.objects.filter(is_visivel=False).count()
        
        context = {
            'anuncios': page_obj,
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
        
        return render(request, 'comunidade/admin/anuncios.html', context)
        
    except Exception as e:
        logger.error(f"Erro na listagem de anúncios: {str(e)}")
        messages.error(request, 'Erro ao carregar os anúncios.')
        return render(request, 'comunidade/admin/anuncios.html', {
            'anuncios': [],
            'pagination': {'page': 1, 'per_page': 10, 'total': 0, 'total_pages': 0, 'page_range': []},
            'stats': {'total': 0, 'active': 0, 'inactive': 0}
        })

@login_required
@admin_required
def admin_moderar_item(request, item_type, item_id):
    """Página de moderação individual"""
    try:
        if item_type == 'postagem':
            item = get_object_or_404(Postagem, id=item_id)
        elif item_type == 'anuncio':
            item = get_object_or_404(AnuncioVeiculo, id=item_id)
        else:
            messages.error(request, 'Tipo de item inválido.')
            return redirect('admin_comunidade_dashboard')
        
        context = {
            'item': item,
            'item_type': item_type
        }
        
        return render(request, 'comunidade/admin/moderar_item.html', context)
        
    except Exception as e:
        logger.error(f"Erro na moderação individual: {str(e)}")
        messages.error(request, 'Erro ao carregar o item para moderação.')
        return redirect('admin_comunidade_dashboard')

@login_required
@admin_required
def admin_stats(request):
    """Página de estatísticas detalhadas"""
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
        
        return render(request, 'comunidade/admin/stats.html', context)
        
    except Exception as e:
        logger.error(f"Erro nas estatísticas: {str(e)}")
        messages.error(request, 'Erro ao carregar as estatísticas.')
        return render(request, 'comunidade/admin/stats.html', {
            'stats': {
                'postagens': {'total': 0, 'aprovadas': 0, 'pendentes': 0, 'rejeitadas': 0, 'removidas': 0, 'ultimo_mes': 0},
                'anuncios': {'total': 0, 'aprovados': 0, 'pendentes': 0, 'rejeitados': 0, 'removidos': 0, 'ultimo_mes': 0},
                'total_conteudo': 0,
                'conteudo_pendente': 0,
                'stats_por_mes': []
            }
        })
