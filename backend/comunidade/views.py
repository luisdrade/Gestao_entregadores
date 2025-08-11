from django.shortcuts import render, redirect
from .models import Postagem, AnuncioVeiculo
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET", "POST"])
def comunidade(request):
    # Form simples via POST para postar novo tópico no fórum
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

    postagens = Postagem.objects.order_by('-data_criacao')
    anuncios = AnuncioVeiculo.objects.order_by('-data_publicacao')

    return render(request, 'comunidade/index.html', {
        'postagens': postagens,
        'anuncios': anuncios,
    })
