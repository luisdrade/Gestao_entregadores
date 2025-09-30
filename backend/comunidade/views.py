from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Postagem, AnuncioVeiculo
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
@require_http_methods(["GET", "POST"])
def comunidade(request):
    # Sempre usar a API JSON - remover lógica duplicada
    return comunidade_api(request)

@csrf_exempt
@require_http_methods(["GET", "POST"])
def comunidade_api(request):
    """API JSON para a comunidade"""
    try:
        if request.method == "GET":
            # Buscar postagens e anúncios (apenas aprovados e visíveis)
            postagens = Postagem.objects.filter(status='aprovado', is_visivel=True).order_by('-data_criacao')
            anuncios = AnuncioVeiculo.objects.filter(status='aprovado', is_visivel=True).order_by('-data_publicacao')
            
            # Serializar postagens
            postagens_data = []
            for postagem in postagens:
                postagens_data.append({
                    'id': postagem.id,
                    'autor': postagem.autor,
                    'titulo': postagem.titulo,
                    'conteudo': postagem.conteudo,
                    'data_criacao': postagem.data_criacao.isoformat(),
                    'curtidas': getattr(postagem, 'curtidas', 0),
                    'comentarios': getattr(postagem, 'comentarios', 0),
                })
            
            # Serializar anúncios
            anuncios_data = []
            for anuncio in anuncios:
                anuncios_data.append({
                    'id': anuncio.id,
                    'modelo': anuncio.modelo,
                    'ano': anuncio.ano,
                    'quilometragem': anuncio.quilometragem,
                    'preco': float(anuncio.preco),
                    'localizacao': anuncio.localizacao,
                    'link_externo': anuncio.link_externo,
                    'foto': anuncio.foto.url if anuncio.foto else None,
                    'data_publicacao': anuncio.data_publicacao.isoformat(),
                    'vendedor': getattr(anuncio, 'vendedor', 'Usuário'),
                })
            
            return JsonResponse({
                'success': True,
                'postagens': postagens_data,
                'anuncios': anuncios_data,
            })
        
        elif request.method == "POST":
            # Debug: verificar o content_type
            print(f"🔍 DEBUG - Content-Type: {request.content_type}")
            print(f"🔍 DEBUG - META Content-Type: {request.META.get('CONTENT_TYPE', 'N/A')}")
            print(f"🔍 DEBUG - Body: {request.body}")
            print(f"🔍 DEBUG - POST data: {request.POST}")
            print(f"🔍 DEBUG - FILES data: {request.FILES}")
            print(f"🔍 DEBUG - All META keys: {list(request.META.keys())}")
            print(f"🔍 DEBUG - HTTP_CONTENT_TYPE: {request.META.get('HTTP_CONTENT_TYPE', 'N/A')}")
            
            # Tentar processar como JSON primeiro
            data = None
            try:
                if request.body:
                    data = json.loads(request.body)
                    print(f"🔍 DEBUG - JSON data: {data}")
            except json.JSONDecodeError:
                print("🔍 DEBUG - Não é JSON válido, tentando FormData")
                data = None
            
            # Processar dados JSON se disponível
            if data:
                if 'titulo' in data and 'conteudo' in data:
                    # Criar postagem
                    autor = data.get('autor', 'Usuário')
                    print(f"🔍 DEBUG - Autor recebido: {autor}")
                    print(f"🔍 DEBUG - Dados completos: {data}")
                    
                    postagem = Postagem.objects.create(
                        autor=autor,
                        titulo=data['titulo'],
                        conteudo=data['conteudo']
                    )
                    print(f"🔍 DEBUG - Postagem criada com autor: {postagem.autor}")
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
                
                elif 'modelo' in data:
                    # Criar anúncio de veículo
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
            
            # Se não é JSON, tentar FormData
            if 'submit_postagem' in request.POST:
                # Dados FormData para postagem
                autor = request.POST.get('autor', 'Usuário')
                titulo = request.POST.get('titulo')
                conteudo = request.POST.get('conteudo')
                if titulo and conteudo:
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
            
            elif 'submit_anuncio' in request.POST:
                # Dados FormData para anúncio
                modelo = request.POST.get('modelo')
                ano = request.POST.get('ano')
                quilometragem = request.POST.get('quilometragem')
                preco = request.POST.get('preco')
                localizacao = request.POST.get('localizacao')
                link_externo = request.POST.get('link_externo')
                foto = request.FILES.get('foto')
                
                if modelo and ano and quilometragem and preco and localizacao:
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
            
            return JsonResponse({
                'success': False,
                'message': 'Dados inválidos'
            }, status=400)

    except Exception as e:
        print(f"❌ Erro na API da comunidade: {str(e)}")
        return JsonResponse({
            'success': False,
            'message': 'Erro interno do servidor'
        }, status=500)