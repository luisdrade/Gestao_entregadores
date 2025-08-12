from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import RegistroEntregaDespesa, RegistroTrabalho, Despesa
from usuarios.models import Entregador

@csrf_exempt
def registro_entrega_despesa(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Lógica para salvar registro de entrega e despesa
            return JsonResponse({'success': True, 'message': 'Registro salvo com sucesso'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Método não permitido'})

@csrf_exempt
def registro_trabalho(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Buscar o entregador (em produção, usar autenticação)
            entregador = Entregador.objects.first()  # Placeholder
            
            # Criar registro de trabalho
            registro = RegistroTrabalho.objects.create(
                data=data['data'],
                hora_inicio=data['hora_inicio'],
                hora_fim=data['hora_fim'],
                quantidade_entregues=data['quantidade_entregues'],
                quantidade_nao_entregues=data['quantidade_nao_entregues'],
                tipo_pagamento=data['tipo_pagamento'],
                valor=data['valor'],
                entregador=entregador
            )
            
            return JsonResponse({
                'success': True, 
                'message': 'Dia de trabalho registrado com sucesso',
                'id': registro.id
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Método não permitido'})

@csrf_exempt
def registro_despesa(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Buscar o entregador (em produção, usar autenticação)
            entregador = Entregador.objects.first()  # Placeholder
            
            # Criar registro de despesa
            despesa = Despesa.objects.create(
                tipo_despesa=data['tipo_despesa'],
                descricao=data['descricao'],
                valor=data['valor'],
                data=data['data'],
                entregador=entregador
            )
            
            return JsonResponse({
                'success': True, 
                'message': 'Despesa registrada com sucesso',
                'id': despesa.id
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Método não permitido'})

@csrf_exempt
def dashboard_data(request):
    if request.method == 'GET':
        try:
            # Buscar o entregador (em produção, usar autenticação)
            entregador = Entregador.objects.first()  # Placeholder
            
            # Calcular dados do dashboard
            registros_trabalho = RegistroTrabalho.objects.filter(entregador=entregador)
            despesas = Despesa.objects.filter(entregador=entregador)
            
            # Dados mockados para demonstração
            dashboard_data = {
                'dias_trabalhados': 12,
                'entregas_realizadas': 1250,
                'entregas_nao_realizadas': 5,
                'lucro_liquido': 7500.00
            }
            
            return JsonResponse({
                'success': True,
                'data': dashboard_data
            })
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Método não permitido'})
