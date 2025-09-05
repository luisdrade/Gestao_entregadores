from django.shortcuts import render, redirect
from .models import Postagem, AnuncioVeiculo
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

@csrf_exempt
@require_http_methods(["GET", "POST"])
def comunidade(request):
    # Detectar se é uma requisição do app mobile
    is_mobile_app = (
        'application/json' in request.META.get('HTTP_ACCEPT', '') or
        'Expo' in request.META.get('HTTP_USER_AGENT', '') or
        'ReactNative' in request.META.get('HTTP_USER_AGENT', '')
    )
    
    # Form simples via POST para postar novo tópico no fórum
    if request.method == "POST":
        if 'submit_postagem' in request.POST:
            autor = request.POST.get('autor')
            titulo = request.POST.get('titulo')
            conteudo = request.POST.get('conteudo')
            if autor and titulo and conteudo:
                postagem = Postagem.objects.create(autor=autor, titulo=titulo, conteudo=conteudo)
                if is_mobile_app:
                    return JsonResponse({
                        'success': True,
                        'message': 'Postagem criada com sucesso!',
                        'postagem_id': postagem.id
                    })
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
                anuncio = AnuncioVeiculo.objects.create(
                    modelo=modelo,
                    ano=ano,
                    quilometragem=quilometragem,
                    preco=preco,
                    localizacao=localizacao,
                    link_externo=link_externo,
                    foto=foto
                )
                if is_mobile_app:
                    return JsonResponse({
                        'success': True,
                        'message': 'Anúncio criado com sucesso!',
                        'anuncio_id': anuncio.id
                    })
                return redirect('comunidade')

    postagens = Postagem.objects.order_by('-data_criacao')
    anuncios = AnuncioVeiculo.objects.order_by('-data_publicacao')

    # Se for requisição do app mobile, retornar JSON
    if is_mobile_app:
        return JsonResponse({
            'postagens': [
                {
                    'id': p.id,
                    'autor': p.autor,
                    'titulo': p.titulo,
                    'conteudo': p.conteudo,
                    'data_criacao': p.data_criacao.isoformat()
                } for p in postagens
            ],
            'anuncios': [
                {
                    'id': a.id,
                    'modelo': a.modelo,
                    'ano': a.ano,
                    'quilometragem': a.quilometragem,
                    'preco': float(a.preco),
                    'localizacao': a.localizacao,
                    'link_externo': a.link_externo,
                    'foto': a.foto.url if a.foto else None,
                    'data_publicacao': a.data_publicacao.isoformat()
                } for a in anuncios
            ]
        })

    return render(request, 'comunidade/index.html', {
        'postagens': postagens,
        'anuncios': anuncios,
    })
