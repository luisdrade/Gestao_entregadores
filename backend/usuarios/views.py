from django.shortcuts import render, redirect
from .forms import EntregadorForm
from .models import Entregador

from django.http import HttpResponse


def cadastro_entregador(request):
    if request.method == 'POST':
        form = EntregadorForm(request.POST)
        if form.is_valid():
            entregador = form.save(commit=False)
            entregador.set_password(form.cleaned_data['password'])  # Criptografa
            entregador.save()
            return redirect('cadastro_sucesso')  # redireciona para página de sucesso
    else:
        form = EntregadorForm()

    return render(request, 'usuarios/cadastro.html', {'form': form})

def cadastro_sucesso(request):
    return HttpResponse("Cadastro realizado com sucesso!")
