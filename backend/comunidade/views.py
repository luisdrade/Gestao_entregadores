from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Postagem, AnuncioVeiculo
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
@require_http_methods(["GET", "POST"])
def comunidade(request):
    # Se for uma requisição JSON (API), retornar dados em JSON
    if request.content_type == 'application/json' or 'application/json' in request.META.get('HTTP_ACCEPT', ''):
        return comunidade_api(request)
    
    # Form simples via POST para postar novo tópico no fórum (interface web)
    if request.method == "POST":
        if 'submit_postagem' in request.POST:
            autor = request.POST.get('autor')
            titulo = request.POST.get('titulo')
            conteudo = request.POST.get('conteudo')
            if autor and titulo and conteudo:
                Postagem.objects.create(autor=autor, titulo=titulo, conteudo=conteudo)
                return redirect('comunidade')
        elif 'submit_anuncio' in request.POST:
            modelo = request.POST.get('modelo')
            ano = request.POST.get('ano')
            quilometragem = request.POST.get('quilometragem')
            preco = request.POST.get('preco')
            localizacao = request.POST.get('localizacao')
            link_externo = request.POST.get('link_externo')
            foto = request.FILES.get('foto')
            if modelo and ano and quilometragem and preco and localizacao and link_externo:
                AnuncioVeiculo.objects.create(
                    modelo=modelo,
                    ano=ano,
                    quilometragem=quilometragem,
                    preco=preco,
                    localizacao=localizacao,
                    link_externo=link_externo,
                    foto=foto
                )
                return redirect('comunidade')

    # Filtrar apenas conteúdo aprovado e visível
    postagens = Postagem.objects.filter(status='aprovado', is_visivel=True).order_by('-data_criacao')
    anuncios = AnuncioVeiculo.objects.filter(status='aprovado', is_visivel=True).order_by('-data_publicacao')

    return render(request, 'comunidade/index.html', {
        'postagens': postagens,
        'anuncios': anuncios,
    })

@csrf_exempt
@require_http_methods(["GET", "POST"])
def comunidade_api(request):
    """API JSON para a comunidade"""
    try:
        if request.method == "GET":
            # Buscar postagens e anúncios (apenas aprovados e visíveis)
            postagens = Postagem.objects.filter(status='aprovado', is_visivel=True).order_by('-data_criacao')
            anuncios = AnuncioVeiculo.objects.filter(status='aprovado', is_visivel=True).order_by('-data_publicacao')
            
            # Converter para formato JSON
            postagens_data = []
            for post in postagens:
                postagens_data.append({
                    'id': post.id,
                    'autor': post.autor,
                    'titulo': post.titulo,
                    'conteudo': post.conteudo,
                    'data_criacao': post.data_criacao.isoformat(),
                })
            
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
                })
            
            return JsonResponse({
                'success': True,
                'postagens': postagens_data,
                'anuncios': anuncios_data,
            })
        
        elif request.method == "POST":
            # Criar nova postagem ou anúncio
            if request.content_type == 'application/json':
                # Dados JSON
                data = json.loads(request.body)
                
                if 'titulo' in data and 'conteudo' in data:
                    # Criar postagem
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
            
            else:
                # Dados FormData (para upload de fotos)
                if 'submit_postagem' in request.POST:
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
        return JsonResponse({
            'success': False,
            'message': f'Erro interno: {str(e)}'
        }, status=500)
