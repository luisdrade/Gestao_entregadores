from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import RegistroEntregaDespesa, RegistroTrabalho, Despesa
from usuarios.models import Entregador
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

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

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def registro_trabalho(request):
    print(f"=== DEBUG: registro_trabalho chamada ===")
    print(f"Método HTTP: {request.method}")
    print(f"URL: {request.path}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Body: {request.body}")
    
    if request.method == 'POST':
        try:
            data = request.data
            print(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            campos_obrigatorios = ['data', 'hora_inicio', 'hora_fim', 'quantidade_entregues', 
                                  'tipo_pagamento', 'valor']
            
            # Validar campos obrigatórios (exceto quantidade_nao_entregues que pode ser 0)
            for campo in campos_obrigatorios:
                if campo not in data or (data[campo] is None and campo != 'quantidade_nao_entregues'):
                    print(f"Campo obrigatório faltando: {campo}")
                    return Response({
                        'success': False, 
                        'error': f'Campo obrigatorio nao informado: {campo}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar quantidade_nao_entregues separadamente (pode ser 0)
            if 'quantidade_nao_entregues' not in data:
                print("Campo obrigatório faltando: quantidade_nao_entregues")
                return Response({
                    'success': False, 
                    'error': 'Campo obrigatorio nao informado: quantidade_nao_entregues'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar se as quantidades são números válidos
            try:
                quantidade_entregues = int(data['quantidade_entregues'])
                quantidade_nao_entregues = int(data['quantidade_nao_entregues'])
                
                if quantidade_entregues < 0:
                    return Response({
                        'success': False, 
                        'error': 'Quantidade de entregas deve ser maior ou igual a zero'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if quantidade_nao_entregues < 0:
                    return Response({
                        'success': False, 
                        'error': 'Quantidade de não entregas deve ser maior ou igual a zero'
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
            except (ValueError, TypeError):
                return Response({
                    'success': False, 
                    'error': 'Quantidades devem ser números válidos'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Usar o usuário autenticado
            user = request.user
            print(f"Entregador autenticado: {user.nome}")
            
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
                return Response({
                    'success': False, 
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar formato das horas
            try:
                hora_inicio = datetime.strptime(data['hora_inicio'], '%H:%M').time()
                hora_fim = datetime.strptime(data['hora_fim'], '%H:%M').time()
                print(f"Horas validadas: {hora_inicio} - {hora_fim}")
            except ValueError:
                print(f"Erro nas horas: {data['hora_inicio']} - {data['hora_fim']}")
                return Response({
                    'success': False, 
                    'error': 'Formato de hora invalido. Use HH:MM'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar registro de trabalho
            registro = RegistroTrabalho.objects.create(
                data=data_obj,
                hora_inicio=hora_inicio,
                hora_fim=hora_fim,
                quantidade_entregues=quantidade_entregues,
                quantidade_nao_entregues=quantidade_nao_entregues,
                tipo_pagamento=data['tipo_pagamento'],
                valor=float(data['valor']),
                entregador=user
            )
            
            print(f"Registro criado com sucesso! ID: {registro.id}")
            
            return Response({
                'success': True, 
                'message': 'Dia de trabalho registrado com sucesso',
                'id': registro.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Erro na criação: {str(e)}")
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'GET':
        # Retornar informações sobre o endpoint para teste
        return Response({
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
        return Response({
            'success': False, 
            'error': f'Método {request.method} não permitido'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def registro_despesa(request):
    print(f"=== DEBUG: registro_despesa chamada ===")
    print(f"Método HTTP: {request.method}")
    print(f"URL: {request.path}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Body: {request.body}")
    
    if request.method == 'POST':
        try:
            data = request.data
            print(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            campos_obrigatorios = ['tipo_despesa', 'descricao', 'valor', 'data']
            
            for campo in campos_obrigatorios:
                if campo not in data or not data[campo]:
                    print(f"Campo obrigatório faltando: {campo}")
                    return Response({
                        'success': False, 
                        'error': f'Campo obrigatorio nao informado: {campo}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Usar o usuário autenticado
            user = request.user
            print(f"Entregador autenticado: {user.nome}")
            
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
                return Response({
                    'success': False, 
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar valor
            try:
                valor = float(data['valor'])
                if valor <= 0:
                    print(f"Valor inválido: {valor}")
                    return Response({
                        'success': False, 
                        'error': 'Valor deve ser maior que zero'
                    }, status=status.HTTP_400_BAD_REQUEST)
                print(f"Valor validado: {valor}")
            except ValueError:
                print(f"Erro no valor: {data['valor']}")
                return Response({
                    'success': False, 
                    'error': 'Valor invalido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar registro de despesa
            despesa = Despesa.objects.create(
                tipo_despesa=data['tipo_despesa'],
                descricao=data['descricao'],
                valor=valor,
                data=data_obj,
                entregador=user
            )
            
            print(f"Despesa criada com sucesso! ID: {despesa.id}")
            
            return Response({
                'success': True, 
                'message': 'Despesa registrada com sucesso',
                'id': despesa.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Erro na criação: {str(e)}")
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'GET':
        # Retornar informações sobre o endpoint para teste
        return Response({
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
        return Response({
            'success': False, 
            'error': f'Método {request.method} não permitido'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    if request.method == 'GET':
        try:
            from datetime import datetime, timedelta
            from django.utils import timezone
            from django.db.models import Sum, Count, Q
            
            # Debug: verificar autenticação
            print(f"🔍 Backend - Usuário autenticado: {request.user}")
            print(f"🔍 Backend - ID do usuário: {request.user.id}")
            print(f"🔍 Backend - Nome do usuário: {request.user.nome}")
            print(f"🔍 Backend - Email do usuário: {request.user.email}")
            print(f"🔍 Backend - Headers da requisição: {dict(request.headers)}")
            
            # Buscar o entregador autenticado através do token JWT
            user = request.user
            if not hasattr(user, 'id'):
                print("❌ Backend - Usuário não tem ID")
                return Response({
                    'success': False, 
                    'error': 'Usuário não autenticado'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            print(f"✅ Backend - Usuário validado com sucesso: {user.nome}")
            
            # Parâmetros de período
            periodo = request.GET.get('periodo', 'mes')  # 'semana' ou 'mes'
            print(f"🔍 Backend - Período solicitado: {periodo}")
            
            # Calcular datas base
            hoje = timezone.now().date()
            if periodo == 'semana':
                data_inicio = hoje - timedelta(days=7)
            else:  # mês
                data_inicio = hoje - timedelta(days=30)
            
            print(f"🔍 Backend - Período calculado: {data_inicio} até {hoje}")
            
            # Filtrar registros por período e pelo entregador autenticado
            registros_trabalho = RegistroTrabalho.objects.filter(
                entregador=user,
                data__gte=data_inicio,
                data__lte=hoje
            )
            
            despesas = Despesa.objects.filter(
                entregador=user,
                data__gte=data_inicio,
                data__lte=hoje
            )
            
            print(f"🔍 Backend - Registros encontrados: {registros_trabalho.count()}")
            print(f"🔍 Backend - Despesas encontradas: {despesas.count()}")
            
            # Dados do período selecionado
            total_entregas_realizadas = registros_trabalho.aggregate(
                total=Sum('quantidade_entregues')
            )['total'] or 0
            
            total_entregas_nao_realizadas = registros_trabalho.aggregate(
                total=Sum('quantidade_nao_entregues')
            )['total'] or 0
            
            total_ganhos = registros_trabalho.aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            total_despesas = despesas.aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            lucro_liquido = total_ganhos - total_despesas
            dias_trabalhados = registros_trabalho.count()
            
            # Dados de hoje
            registros_hoje = RegistroTrabalho.objects.filter(
                entregador=user,
                data=hoje
            )
            
            entregas_hoje = registros_hoje.aggregate(
                total=Sum('quantidade_entregues')
            )['total'] or 0
            
            nao_entregas_hoje = registros_hoje.aggregate(
                total=Sum('quantidade_nao_entregues')
            )['total'] or 0
            
            ganhos_hoje = registros_hoje.aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            despesas_hoje = Despesa.objects.filter(
                entregador=user,
                data=hoje
            ).aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            lucro_hoje = ganhos_hoje - despesas_hoje
            
            dashboard_data = {
                # Resumo diário (hoje)
                'resumo_diario': {
                    'entregas_hoje': entregas_hoje,
                    'nao_entregas_hoje': nao_entregas_hoje,
                    'ganhos_hoje': float(ganhos_hoje),
                    'despesas_hoje': float(despesas_hoje),
                    'lucro_hoje': float(lucro_hoje)
                },
                
                # Indicadores de performance (período selecionado)
                'indicadores_performance': {
                    'dias_trabalhados': dias_trabalhados,
                    'entregas_realizadas': total_entregas_realizadas,
                    'entregas_nao_realizadas': total_entregas_nao_realizadas,
                    'ganho_total': float(total_ganhos),
                    'despesas_total': float(total_despesas),
                    'lucro_liquido': float(lucro_liquido)
                },
                
                'periodo': periodo,
                'data_inicio': data_inicio.strftime('%d/%m/%Y'),
                'data_fim': hoje.strftime('%d/%m/%Y')
            }
            
            return Response({
                'success': True,
                'data': dashboard_data
            })
        except Exception as e:
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False, 
        'error': 'Método não permitido'
    }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

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

@csrf_exempt
def test_dashboard_endpoint(request):
    """View de teste simples para verificar se o endpoint está funcionando"""
    if request.method == 'GET':
        return JsonResponse({
            'success': True,
            'message': 'Endpoint do dashboard está funcionando!',
            'endpoint': 'test-dashboard-endpoint',
            'method': request.method,
            'url': request.path
        })
    
    return JsonResponse({'success': False, 'error': 'Método não permitido'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """View de teste para verificar se a autenticação JWT está funcionando"""
    if request.method == 'GET':
        return Response({
            'success': True,
            'message': 'Autenticação JWT funcionando!',
            'user_id': request.user.id,
            'user_nome': request.user.nome,
            'user_email': request.user.email,
            'endpoint': 'test-auth',
            'method': request.method,
            'url': request.path
        })
    
    return Response({
        'success': False, 
        'error': 'Método não permitido'
    }, status=status.HTTP_405_METHOD_NOT_ALLOWED)


