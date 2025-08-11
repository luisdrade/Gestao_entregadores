from django.shortcuts import render, redirect
from .forms import RegistroEntregaDespesaForm
from .models import RegistroEntregaDespesa

def index(request):
    form = RegistroEntregaDespesaForm(request.POST or None)
    resultado = None

    if request.method == 'POST' and form.is_valid():
        registro = form.save()
        ganho = registro.calcular_ganho()
        lucro = registro.calcular_lucro()
        resultado = {
            'ganho': ganho,
            'despesa': registro.valor_despesa,
            'lucro': lucro,
            'entregues': registro.pacotes_entregues,
            'nao_entregues': registro.pacotes_nao_entregues,
        }

    return render(request, 'registro_entregadespesa/index.html', {
        'form': form,
        'resultado': resultado
    })
