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
    print(f"=== DEBUG: registro_trabalho chamada ===")
    print(f"Método HTTP: {request.method}")
    print(f"URL: {request.path}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Body: {request.body}")
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            campos_obrigatorios = ['data', 'hora_inicio', 'hora_fim', 'quantidade_entregues', 
                                  'tipo_pagamento', 'valor']
            
            # Validar campos obrigatórios (exceto quantidade_nao_entregues que pode ser 0)
            for campo in campos_obrigatorios:
                if campo not in data or (data[campo] is None and campo != 'quantidade_nao_entregues'):
                    print(f"Campo obrigatório faltando: {campo}")
                    return JsonResponse({
                        'success': False, 
                        'error': f'Campo obrigatorio nao informado: {campo}'
                    })
            
            # Validar quantidade_nao_entregues separadamente (pode ser 0)
            if 'quantidade_nao_entregues' not in data:
                print("Campo obrigatório faltando: quantidade_nao_entregues")
                return JsonResponse({
                    'success': False, 
                    'error': 'Campo obrigatorio nao informado: quantidade_nao_entregues'
                })
            
            # Validar se as quantidades são números válidos
            try:
                quantidade_entregues = int(data['quantidade_entregues'])
                quantidade_nao_entregues = int(data['quantidade_nao_entregues'])
                
                if quantidade_entregues < 0:
                    return JsonResponse({
                        'success': False, 
                        'error': 'Quantidade de entregas deve ser maior ou igual a zero'
                    })
                
                if quantidade_nao_entregues < 0:
                    return JsonResponse({
                        'success': False, 
                        'error': 'Quantidade de não entregas deve ser maior ou igual a zero'
                    })
                    
            except (ValueError, TypeError):
                return JsonResponse({
                    'success': False, 
                    'error': 'Quantidades devem ser números válidos'
                })
            
            # Buscar o entregador (em produção, usar autenticação)
            entregador = Entregador.objects.first()
            if not entregador:
                print("Nenhum entregador encontrado")
                return JsonResponse({
                    'success': False, 
                    'error': 'Nenhum entregador cadastrado no sistema'
                })
            
            print(f"Entregador encontrado: {entregador.nome}")
            
            # Validar formato da data
            try:
                from datetime import datetime
                
                # Tentar formato brasileiro primeiro (DD/MM/YYYY)
                try:
                    data_obj = datetime.strptime(data['data'], '%d/%m/%Y').date()
                    print(f"Data validada (formato BR): {data_obj}")
                except ValueError:
                    # Tentar formato internacional (YYYY-MM-DD)
                    try:
                        data_obj = datetime.strptime(data['data'], '%Y-%m-%d').date()
                        print(f"Data validada (formato INT): {data_obj}")
                    except ValueError:
                        # Tentar outros formatos comuns
                        try:
                            data_obj = datetime.strptime(data['data'], '%d-%m-%Y').date()
                            print(f"Data validada (formato BR com hífen): {data_obj}")
                        except ValueError:
                            raise ValueError(f"Formato de data inválido: {data['data']}. Use DD/MM/YYYY ou YYYY-MM-DD")
                
            except ValueError as e:
                print(f"Erro na data: {data['data']}")
                return JsonResponse({
                    'success': False, 
                    'error': str(e)
                })
            
            # Validar formato das horas
            try:
                hora_inicio = datetime.strptime(data['hora_inicio'], '%H:%M').time()
                hora_fim = datetime.strptime(data['hora_fim'], '%H:%M').time()
                print(f"Horas validadas: {hora_inicio} - {hora_fim}")
            except ValueError:
                print(f"Erro nas horas: {data['hora_inicio']} - {data['hora_fim']}")
                return JsonResponse({
                    'success': False, 
                    'error': 'Formato de hora invalido. Use HH:MM'
                })
            
            # Criar registro de trabalho
            registro = RegistroTrabalho.objects.create(
                data=data_obj,
                hora_inicio=hora_inicio,
                hora_fim=hora_fim,
                quantidade_entregues=quantidade_entregues,
                quantidade_nao_entregues=quantidade_nao_entregues,
                tipo_pagamento=data['tipo_pagamento'],
                valor=float(data['valor']),
                entregador=entregador
            )
            
            print(f"Registro criado com sucesso! ID: {registro.id}")
            
            return JsonResponse({
                'success': True, 
                'message': 'Dia de trabalho registrado com sucesso',
                'id': registro.id
            })
        except Exception as e:
            print(f"Erro na criação: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)})
    
    elif request.method == 'GET':
        # Retornar informações sobre o endpoint para teste
        return JsonResponse({
            'success': True,
            'message': 'Endpoint de teste - Use POST para registrar trabalho',
            'method': request.method,
            'url': request.path,
            'exemplo_dados': {
                'data': '2025-08-19',
                'hora_inicio': '08:00',
                'hora_fim': '17:00',
                'quantidade_entregues': 10,
                'quantidade_nao_entregues': 0,
                'tipo_pagamento': 'diaria',
                'valor': '100.00'
            },
            'campos_obrigatorios': [
                'data', 'hora_inicio', 'hora_fim', 'quantidade_entregues',
                'quantidade_nao_entregues', 'tipo_pagamento', 'valor'
            ]
        })
    
    else:
        print(f"Método {request.method} não permitido")
        return JsonResponse({'success': False, 'error': f'Método {request.method} não permitido'})

@csrf_exempt
def registro_despesa(request):
    print(f"=== DEBUG: registro_despesa chamada ===")
    print(f"Método HTTP: {request.method}")
    print(f"URL: {request.path}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Body: {request.body}")
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            campos_obrigatorios = ['tipo_despesa', 'descricao', 'valor', 'data']
            
            for campo in campos_obrigatorios:
                if campo not in data or not data[campo]:
                    print(f"Campo obrigatório faltando: {campo}")
                    return JsonResponse({
                        'success': False, 
                        'error': f'Campo obrigatorio nao informado: {campo}'
                    })
            
            # Buscar o entregador (em produção, usar autenticação)
            entregador = Entregador.objects.first()
            if not entregador:
                print("Nenhum entregador encontrado")
                return JsonResponse({
                    'success': False, 
                    'error': 'Nenhum entregador cadastrado no sistema'
                })
            
            print(f"Entregador encontrado: {entregador.nome}")
            
            # Validar formato da data
            try:
                from datetime import datetime
                
                # Tentar formato brasileiro primeiro (DD/MM/YYYY)
                try:
                    data_obj = datetime.strptime(data['data'], '%d/%m/%Y').date()
                    print(f"Data validada (formato BR): {data_obj}")
                except ValueError:
                    # Tentar formato internacional (YYYY-MM-DD)
                    try:
                        data_obj = datetime.strptime(data['data'], '%Y-%m-%d').date()
                        print(f"Data validada (formato INT): {data_obj}")
                    except ValueError:
                        # Tentar outros formatos comuns
                        try:
                            data_obj = datetime.strptime(data['data'], '%d-%m-%Y').date()
                            print(f"Data validada (formato BR com hífen): {data_obj}")
                        except ValueError:
                            raise ValueError(f"Formato de data inválido: {data['data']}. Use DD/MM/YYYY ou YYYY-MM-DD")
                
            except ValueError as e:
                print(f"Erro na data: {data['data']}")
                return JsonResponse({
                    'success': False, 
                    'error': str(e)
                })
            
            # Validar valor
            try:
                valor = float(data['valor'])
                if valor <= 0:
                    print(f"Valor inválido: {valor}")
                    return JsonResponse({
                        'success': False, 
                        'error': 'Valor deve ser maior que zero'
                    })
                print(f"Valor validado: {valor}")
            except ValueError:
                print(f"Erro no valor: {data['valor']}")
                return JsonResponse({
                    'success': False, 
                    'error': 'Valor invalido'
                })
            
            # Criar registro de despesa
            despesa = Despesa.objects.create(
                tipo_despesa=data['tipo_despesa'],
                descricao=data['descricao'],
                valor=valor,
                data=data_obj,
                entregador=entregador
            )
            
            print(f"Despesa criada com sucesso! ID: {despesa.id}")
            
            return JsonResponse({
                'success': True, 
                'message': 'Despesa registrada com sucesso',
                'id': despesa.id
            })
        except Exception as e:
            print(f"Erro na criação: {str(e)}")
            return JsonResponse({'success': False, 'error': str(e)})
    elif request.method == 'GET':
        # Retornar informações sobre o endpoint para teste
        return JsonResponse({
            'success': True,
            'message': 'Endpoint de teste - Use POST para registrar despesa',
            'method': request.method,
            'url': request.path,
            'exemplo_dados': {
                'tipo_despesa': 'combustivel',
                'descricao': 'Abastecimento do veículo',
                'valor': '50.00',
                'data': '2025-08-19'
            },
            'campos_obrigatorios': [
                'tipo_despesa', 'descricao', 'valor', 'data'
            ],
            'tipos_despesa_validos': [
                'alimentacao', 'combustivel', 'manutencao', 'pedagio',
                'estacionamento', 'seguro', 'licenciamento', 'outros'
            ]
        })
    
    else:
        print(f"Método {request.method} não permitido")
    
    return JsonResponse({'success': False, 'error': 'Metodo nao permitido'})

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

@csrf_exempt
def test_connection(request):
    """View simples para testar conexão com o banco"""
    if request.method == 'GET':
        try:
            # Teste simples de conexão com o banco
            from django.db import connection
            cursor = connection.cursor()
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
            return JsonResponse({
                'success': True,
                'message': 'Conexão com banco OK!',
                'test_query': result[0],
                'database': connection.settings_dict['ENGINE'],
                'endpoint': 'test-connection funcionando!'
            })
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'error': f'Erro na conexão com banco: {str(e)}'
            })
    
    return JsonResponse({'success': False, 'error': 'Método não permitido'})
