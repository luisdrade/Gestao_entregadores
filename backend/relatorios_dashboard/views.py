# relatorios_dashboard/views.py

from django.shortcuts import render
from cadastro_veiculo.models import Veiculo
from registro_entregadespesa.models import RegistroEntregaDespesa
from datetime import date, timedelta
from django.db.models import Sum

def dashboard(request):
    total_veiculos = Veiculo.objects.count()

    data_fim = date.today()
    data_inicio = data_fim - timedelta(days=7)
    registros = RegistroEntregaDespesa.objects.filter(data__range=(data_inicio, data_fim))

    total_ganho = sum(r.calcular_ganho() for r in registros)
    total_despesa = registros.aggregate(Sum('valor_despesa'))['valor_despesa__sum'] or 0
    lucro = total_ganho - total_despesa

    ultimos_registros = registros.order_by('-data')[:5]

    context = {
        'total_veiculos': total_veiculos,
        'total_ganho': total_ganho,
        'total_despesa': total_despesa,
        'lucro': lucro,
        'ultimos_registros': ultimos_registros,
    }
    return render(request, 'relatorios_dashboard/dashboard.html', context)

def relatorios(request):
    data_fim = date.today()
    data_inicio = data_fim - timedelta(days=7)
    registros = RegistroEntregaDespesa.objects.filter(data__range=(data_inicio, data_fim))

    total_ganho = sum(r.calcular_ganho() for r in registros)
    total_despesa = registros.aggregate(Sum('valor_despesa'))['valor_despesa__sum'] or 0
    lucro = total_ganho - total_despesa

    context = {
        'registros': registros,
        'total_ganho': total_ganho,
        'total_despesa': total_despesa,
        'lucro': lucro,
        'data_inicio': data_inicio,
        'data_fim': data_fim,
    }
    return render(request, 'relatorios_dashboard/relatorios.html', context)
