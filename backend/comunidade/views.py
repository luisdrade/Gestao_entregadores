"""
Views para a comunidade - postagens e anúncios de veículos
"""
import json
import logging

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Postagem, AnuncioVeiculo

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["GET", "POST"])
def comunidade_api(request):
    """API JSON para a comunidade - postagens e anúncios"""
    try:
        if request.method == "GET":
            return _get_comunidade_data()
        
        elif request.method == "POST":
            return _create_comunidade_item(request)
        
    except Exception as e:
        logger.error(f"Erro na API da comunidade: {str(e)}", exc_info=True)
        return JsonResponse({
            'success': False,
            'message': 'Erro interno do servidor'
        }, status=500)


def _get_comunidade_data():
    """Retorna postagens e anúncios aprovados"""
    postagens = Postagem.objects.filter(
        status='aprovado', 
        is_visivel=True
    ).order_by('-data_criacao')
    
    anuncios = AnuncioVeiculo.objects.filter(
        status='aprovado', 
        is_visivel=True
    ).order_by('-data_publicacao')
    
    postagens_data = [
        {
            'id': p.id,
            'autor': p.autor,
            'titulo': p.titulo,
            'conteudo': p.conteudo,
            'data_criacao': p.data_criacao.isoformat(),
            'curtidas': getattr(p, 'curtidas', 0),
            'comentarios': getattr(p, 'comentarios', 0),
        }
        for p in postagens
    ]
    
    anuncios_data = [
        {
            'id': a.id,
            'modelo': a.modelo,
            'ano': a.ano,
            'quilometragem': a.quilometragem,
            'preco': float(a.preco),
            'localizacao': a.localizacao,
            'link_externo': a.link_externo,
            'foto': a.foto.url if a.foto else None,
            'data_publicacao': a.data_publicacao.isoformat(),
            'vendedor': getattr(a, 'vendedor', 'Usuário'),
        }
        for a in anuncios
    ]
    
    return JsonResponse({
        'success': True,
        'postagens': postagens_data,
        'anuncios': anuncios_data,
    })


def _create_comunidade_item(request):
    """Cria nova postagem ou anúncio"""
    # Tentar processar como JSON
    data = None
    try:
        if request.body:
            data = json.loads(request.body)
    except json.JSONDecodeError:
        data = None
    
    if data:
        if 'titulo' in data and 'conteudo' in data:
            return _create_postagem(data)
        elif 'modelo' in data:
            return _create_anuncio(data)
    
    # Tentar FormData
    if 'submit_postagem' in request.POST:
        return _create_postagem_from_formdata(request.POST)
    elif 'submit_anuncio' in request.POST:
        return _create_anuncio_from_formdata(request.POST, request.FILES)
    
    return JsonResponse({
        'success': False,
        'message': 'Dados inválidos'
    }, status=400)


def _create_postagem(data):
    """Cria uma nova postagem"""
    postagem = Postagem.objects.create(
        autor=data.get('autor', 'Usuário'),
        titulo=data['titulo'],
        conteudo=data['conteudo']
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Postagem criada com sucesso!',
        'postagem': {
            'id': postagem.id,
            'autor': postagem.autor,
            'titulo': postagem.titulo,
            'conteudo': postagem.conteudo,
            'data_criacao': postagem.data_criacao.isoformat(),
        }
    })


def _create_anuncio(data):
    """Cria um novo anúncio de veículo"""
    anuncio = AnuncioVeiculo.objects.create(
        modelo=data['modelo'],
        ano=data['ano'],
        quilometragem=data['quilometragem'],
        preco=data['preco'],
        localizacao=data['localizacao'],
        link_externo=data.get('link_externo', ''),
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Anúncio criado com sucesso!',
        'anuncio': {
            'id': anuncio.id,
            'modelo': anuncio.modelo,
            'ano': anuncio.ano,
            'quilometragem': anuncio.quilometragem,
            'preco': float(anuncio.preco),
            'localizacao': anuncio.localizacao,
            'link_externo': anuncio.link_externo,
            'data_publicacao': anuncio.data_publicacao.isoformat(),
        }
    })


def _create_postagem_from_formdata(post_data):
    """Cria postagem a partir de FormData"""
    autor = post_data.get('autor', 'Usuário')
    titulo = post_data.get('titulo')
    conteudo = post_data.get('conteudo')
    
    if not (titulo and conteudo):
        return JsonResponse({
            'success': False,
            'message': 'Título e conteúdo são obrigatórios'
        }, status=400)
    
    postagem = Postagem.objects.create(
        autor=autor,
        titulo=titulo,
        conteudo=conteudo
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Postagem criada com sucesso!',
        'postagem': {
            'id': postagem.id,
            'autor': postagem.autor,
            'titulo': postagem.titulo,
            'conteudo': postagem.conteudo,
            'data_criacao': postagem.data_criacao.isoformat(),
        }
    })


def _create_anuncio_from_formdata(post_data, files_data):
    """Cria anúncio a partir de FormData"""
    modelo = post_data.get('modelo')
    ano = post_data.get('ano')
    quilometragem = post_data.get('quilometragem')
    preco = post_data.get('preco')
    localizacao = post_data.get('localizacao')
    link_externo = post_data.get('link_externo')
    foto = files_data.get('foto')
    
    if not all([modelo, ano, quilometragem, preco, localizacao]):
        return JsonResponse({
            'success': False,
            'message': 'Campos obrigatórios faltando'
        }, status=400)
    
    anuncio = AnuncioVeiculo.objects.create(
        modelo=modelo,
        ano=ano,
        quilometragem=quilometragem,
        preco=preco,
        localizacao=localizacao,
        link_externo=link_externo or '',
        foto=foto
    )
    
    return JsonResponse({
        'success': True,
        'message': 'Anúncio criado com sucesso!',
        'anuncio': {
            'id': anuncio.id,
            'modelo': anuncio.modelo,
            'ano': anuncio.ano,
            'quilometragem': anuncio.quilometragem,
            'preco': float(anuncio.preco),
            'localizacao': anuncio.localizacao,
            'link_externo': anuncio.link_externo,
            'foto': anuncio.foto.url if anuncio.foto else None,
            'data_publicacao': anuncio.data_publicacao.isoformat(),
        }
    })


# Alias para compatibilidade
comunidade = comunidade_api