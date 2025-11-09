"""
Views para registro de entregas, trabalho e despesas
"""
import json
import logging

from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken

from .models import RegistroEntregaDespesa, RegistroTrabalho, Despesa, CategoriaDespesa
from usuarios.models import Entregador

logger = logging.getLogger(__name__)
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def registro_trabalho_detail(request, registro_id):
    try:
        registro = RegistroTrabalho.objects.get(id=registro_id, entregador=request.user)
    except RegistroTrabalho.DoesNotExist:
        return Response({'success': False, 'error': 'Registro não encontrado'}, status=status.HTTP_404_NOT_FOUND)

    if request.method in ['PUT', 'PATCH']:
        data = request.data
        # Atualizar campos permitidos
        for field_map in [
            ('data', 'data'),
            ('hora_inicio', 'hora_inicio'),
            ('hora_fim', 'hora_fim'),
            ('quantidade_entregues', 'quantidade_entregues'),
            ('quantidade_nao_entregues', 'quantidade_nao_entregues'),
            ('tipo_pagamento', 'tipo_pagamento'),
            ('valor', 'valor'),
        ]:
            payload_key, model_field = field_map
            if payload_key in data and data[payload_key] is not None:
                setattr(registro, model_field, data[payload_key])
        registro.save()
        return Response({'success': True, 'message': 'Registro atualizado com sucesso'})

    if request.method == 'DELETE':
        registro.delete()
        return Response({'success': True, 'message': 'Registro excluído com sucesso'})

    # GET detail básico
    return Response({
        'success': True,
        'data': {
            'id': registro.id,
            'data': registro.data.strftime('%Y-%m-%d'),
            'hora_inicio': registro.hora_inicio.strftime('%H:%M') if registro.hora_inicio else None,
            'hora_fim': registro.hora_fim.strftime('%H:%M') if registro.hora_fim else None,
            'quantidade_entregues': registro.quantidade_entregues,
            'quantidade_nao_entregues': registro.quantidade_nao_entregues,
            'tipo_pagamento': registro.tipo_pagamento,
            'valor': float(registro.valor),
        }
    })


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def registro_despesa_detail(request, despesa_id):
    try:
        despesa = Despesa.objects.get(id=despesa_id, entregador=request.user)
    except Despesa.DoesNotExist:
        return Response({'success': False, 'error': 'Despesa não encontrada'}, status=status.HTTP_404_NOT_FOUND)

    if request.method in ['PUT', 'PATCH']:
        data = request.data
        for field_map in [
            ('tipo_despesa', 'tipo_despesa'),
            ('descricao', 'descricao'),
            ('valor', 'valor'),
            ('data', 'data'),
        ]:
            payload_key, model_field = field_map
            if payload_key in data and data[payload_key] is not None:
                setattr(despesa, model_field, data[payload_key])
        despesa.save()
        return Response({'success': True, 'message': 'Despesa atualizada com sucesso'})

    if request.method == 'DELETE':
        despesa.delete()
        return Response({'success': True, 'message': 'Despesa excluída com sucesso'})

    return Response({
        'success': True,
        'data': {
            'id': despesa.id,
            'tipo_despesa': despesa.tipo_despesa,
            'descricao': despesa.descricao,
            'valor': float(despesa.valor),
            'data': despesa.data.strftime('%Y-%m-%d'),
        }
    })

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
    logger.info(f"Registro trabalho chamado - Método: {request.method}, URL: {request.path}")
    
    if request.method == 'POST':
        try:
            data = request.data
            logger.debug(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            campos_obrigatorios = ['data', 'hora_inicio', 'hora_fim', 'quantidade_entregues', 
                                  'tipo_pagamento', 'valor']
            
            # Validar campos obrigatórios (exceto quantidade_nao_entregues que pode ser 0)
            for campo in campos_obrigatorios:
                if campo not in data or (data[campo] is None and campo != 'quantidade_nao_entregues'):
                    logger.warning(f"Campo obrigatório faltando: {campo}")
                    return Response({
                        'success': False, 
                        'error': f'Campo obrigatorio nao informado: {campo}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar quantidade_nao_entregues separadamente (pode ser 0)
            if 'quantidade_nao_entregues' not in data:
                logger.warning("Campo obrigatório faltando: quantidade_nao_entregues")
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
            logger.debug(f"Entregador autenticado: {user.nome}")
            
            # Validar formato da data
            try:
                from datetime import datetime
                
                # Tentar formato brasileiro primeiro (DD/MM/YYYY)
                try:
                    data_obj = datetime.strptime(data['data'], '%d/%m/%Y').date()
                except ValueError:
                    # Tentar formato internacional (YYYY-MM-DD)
                    try:
                        data_obj = datetime.strptime(data['data'], '%Y-%m-%d').date()
                    except ValueError:
                        # Tentar outros formatos comuns
                        try:
                            data_obj = datetime.strptime(data['data'], '%d-%m-%Y').date()
                        except ValueError:
                            raise ValueError(f"Formato de data inválido: {data['data']}. Use DD/MM/YYYY ou YYYY-MM-DD")
                
            except ValueError as e:
                logger.warning(f"Erro na data: {data['data']}")
                return Response({
                    'success': False, 
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar formato das horas
            try:
                hora_inicio = datetime.strptime(data['hora_inicio'], '%H:%M').time()
                hora_fim = datetime.strptime(data['hora_fim'], '%H:%M').time()
            except ValueError:
                logger.warning(f"Erro nas horas: {data['hora_inicio']} - {data['hora_fim']}")
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
            
            logger.info(f"Registro criado com sucesso! ID: {registro.id}")
            
            return Response({
                'success': True, 
                'message': 'Dia de trabalho registrado com sucesso',
                'id': registro.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Erro na criação: {str(e)}", exc_info=True)
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'GET':
        # Listar registros do usuário
        try:
            registros = RegistroTrabalho.objects.filter(entregador=request.user).order_by('-data', '-hora_inicio')
            
            registros_data = []
            for registro in registros:
                registros_data.append({
                    'id': registro.id,
                    'data': registro.data.strftime('%d/%m/%Y'),
                    'hora_inicio': str(registro.hora_inicio),
                    'hora_fim': str(registro.hora_fim),
                    'quantidade_entregues': registro.quantidade_entregues,
                    'quantidade_nao_entregues': registro.quantidade_nao_entregues,
                    'tipo_pagamento': registro.tipo_pagamento,
                    'valor': float(registro.valor),
                    'total_pacotes': registro.quantidade_entregues + registro.quantidade_nao_entregues,
                    'pacotes_entregues': registro.quantidade_entregues,
                    'pacotes_nao_entregues': registro.quantidade_nao_entregues,
                    'ganho': float(registro.valor),
                    'lucro': float(registro.valor)  # Para compatibilidade com o frontend
                })
            
            return Response({
                'success': True,
                'results': registros_data,
                'count': len(registros_data)
            })
        except Exception as e:
            logger.error(f"Erro ao listar registros: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    else:
        logger.warning(f"Método {request.method} não permitido")
        return Response({
            'success': False, 
            'error': f'Método {request.method} não permitido'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def registro_despesa(request):
    logger.info(f"Registro despesa chamado - Método: {request.method}, URL: {request.path}")
    
    if request.method == 'POST':
        try:
            data = request.data
            logger.debug(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            campos_obrigatorios = ['tipo_despesa', 'descricao', 'valor', 'data']
            
            for campo in campos_obrigatorios:
                if campo not in data or not data[campo]:
                    logger.warning(f"Campo obrigatório faltando: {campo}")
                    return Response({
                        'success': False, 
                        'error': f'Campo obrigatorio nao informado: {campo}'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Usar o usuário autenticado
            user = request.user
            logger.debug(f"Entregador autenticado: {user.nome}")
            
            # Validar formato da data
            try:
                from datetime import datetime
                
                # Tentar formato brasileiro primeiro (DD/MM/YYYY)
                try:
                    data_obj = datetime.strptime(data['data'], '%d/%m/%Y').date()
                except ValueError:
                    # Tentar formato internacional (YYYY-MM-DD)
                    try:
                        data_obj = datetime.strptime(data['data'], '%Y-%m-%d').date()
                    except ValueError:
                        # Tentar outros formatos comuns
                        try:
                            data_obj = datetime.strptime(data['data'], '%d-%m-%Y').date()
                        except ValueError:
                            raise ValueError(f"Formato de data inválido: {data['data']}. Use DD/MM/YYYY ou YYYY-MM-DD")
                
            except ValueError as e:
                logger.warning(f"Erro na data: {data['data']}")
                return Response({
                    'success': False, 
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Validar valor
            try:
                valor = float(data['valor'])
                if valor <= 0:
                    logger.warning(f"Valor inválido: {valor}")
                    return Response({
                        'success': False, 
                        'error': 'Valor deve ser maior que zero'
                    }, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                logger.warning(f"Erro no valor: {data['valor']}")
                return Response({
                    'success': False, 
                    'error': 'Valor invalido'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Verificar se é categoria personalizada
            categoria_personalizada = None
            if 'categoria_personalizada' in data and data['categoria_personalizada']:
                try:
                    categoria_personalizada = CategoriaDespesa.objects.get(
                        nome=data['categoria_personalizada'],
                        entregador=user,
                        ativa=True
                    )
                except CategoriaDespesa.DoesNotExist:
                    logger.warning(f"Categoria personalizada não encontrada: {data['categoria_personalizada']}")
            
            # Criar registro de despesa
            despesa = Despesa.objects.create(
                tipo_despesa=data['tipo_despesa'],
                categoria_personalizada=categoria_personalizada,
                descricao=data['descricao'],
                valor=valor,
                data=data_obj,
                entregador=user
            )
            
            logger.info(f"Despesa criada com sucesso! ID: {despesa.id}")
            
            return Response({
                'success': True, 
                'message': 'Despesa registrada com sucesso',
                'id': despesa.id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Erro na criação: {str(e)}", exc_info=True)
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'GET':
        # Listar despesas do usuário
        try:
            despesas = Despesa.objects.filter(entregador=request.user).order_by('-data')
            
            despesas_data = []
            for despesa in despesas:
                categoria_display = despesa.categoria_display
                despesas_data.append({
                    'id': despesa.id,
                    'tipo_despesa': despesa.tipo_despesa,
                    'categoria_display': categoria_display,
                    'descricao': despesa.descricao,
                    'valor': float(despesa.valor),
                    'data': despesa.data.strftime('%d/%m/%Y'),
                    'categoria_despesa': categoria_display,  # Para compatibilidade com frontend
                    'valor_despesa': float(despesa.valor),  # Para compatibilidade com frontend
                    'descricao_outros': despesa.descricao if despesa.tipo_despesa == 'outros' else None
                })
            
            return Response({
                'success': True,
                'results': despesas_data,
                'count': len(despesas_data)
            })
        except Exception as e:
            logger.error(f"Erro ao listar despesas: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    else:
        logger.warning(f"Método {request.method} não permitido")
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
            logger.debug(f"Usuário autenticado: {request.user.email}")
            
            # Buscar o entregador autenticado através do token JWT
            user = request.user
            if not hasattr(user, 'id'):
                logger.warning("Usuário não tem ID")
                return Response({
                    'success': False, 
                    'error': 'Usuário não autenticado'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            logger.debug(f"Usuário validado: {user.nome}")
            
            # Parâmetros de período e filtros de data
            periodo = request.GET.get('periodo', 'mes')
            data_inicio_param = request.GET.get('data_inicio')
            data_fim_param = request.GET.get('data_fim')
            
            # Calcular datas base
            hoje = timezone.now().date()
            
            if data_inicio_param and data_fim_param:
                # Filtro personalizado por data
                from datetime import date
                data_inicio = date.fromisoformat(data_inicio_param)
                data_fim = date.fromisoformat(data_fim_param)
                logger.debug(f"Filtro personalizado: {data_inicio} até {data_fim}")
            else:
                # Período automático
                if periodo == 'semana':
                    data_inicio = hoje - timedelta(days=7)
                else:  # mês
                    data_inicio = hoje - timedelta(days=30)
                data_fim = hoje
                logger.debug(f"Período automático: {data_inicio} até {data_fim}")
            
            # Filtrar registros por período e pelo entregador autenticado
            registros_trabalho = RegistroTrabalho.objects.filter(
                entregador=user,
                data__gte=data_inicio,
                data__lte=data_fim
            )
            
            despesas = Despesa.objects.filter(
                entregador=user,
                data__gte=data_inicio,
                data__lte=data_fim
            )
            
            logger.debug(f"Registros encontrados: {registros_trabalho.count()}, Despesas: {despesas.count()}")
            
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
            
            # Dados do período filtrado (se for um dia específico, será "hoje")
            registros_hoje = RegistroTrabalho.objects.filter(
                entregador=user,
                data=data_fim
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
                data=data_fim
            ).aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            lucro_hoje = ganhos_hoje - despesas_hoje
            
            # Dados para gráficos - Entregas por dia da semana
            from django.db.models import Sum
            from datetime import datetime, timedelta
            
            # Calcular entregas por dia da semana (últimos 7 dias)
            entregas_por_dia = []
            dias_semana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
            
            for i in range(7):
                data_dia = hoje - timedelta(days=6-i)
                registros_dia = registros_trabalho.filter(data=data_dia)
                total_entregas_dia = registros_dia.aggregate(total=Sum('quantidade_entregues'))['total'] or 0
                total_ganho_dia = registros_dia.aggregate(total=Sum('valor'))['total'] or 0
                
                entregas_por_dia.append({
                    'dia': dias_semana[data_dia.weekday()],
                    'entregas': total_entregas_dia,
                    'ganho': float(total_ganho_dia)
                })
            
            # Dados para gráfico de ganhos por semana (últimas 4 semanas)
            ganhos_por_semana = []
            for i in range(4):
                semana_inicio = hoje - timedelta(days=(i+1)*7)
                semana_fim = hoje - timedelta(days=i*7)
                
                registros_semana = registros_trabalho.filter(
                    data__gte=semana_inicio,
                    data__lt=semana_fim
                )
                despesas_semana = despesas.filter(
                    data__gte=semana_inicio,
                    data__lt=semana_fim
                )
                
                ganho_semana = registros_semana.aggregate(total=Sum('valor'))['total'] or 0
                despesa_semana = despesas_semana.aggregate(total=Sum('valor'))['total'] or 0
                
                ganhos_por_semana.append({
                    'semana': f'Sem {4-i}',
                    'ganho': float(ganho_semana),
                    'despesa': float(despesa_semana)
                })
            
            # Dados para performance mensal (últimos 6 meses)
            performance_mensal = []
            meses_nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            
            for i in range(6):
                # Calcular início e fim do mês
                if hoje.month - i <= 0:
                    mes = 12 + (hoje.month - i)
                    ano = hoje.year - 1
                else:
                    mes = hoje.month - i
                    ano = hoje.year
                
                # Primeiro dia do mês
                mes_inicio = datetime(ano, mes, 1).date()
                # Último dia do mês
                if mes == 12:
                    mes_fim = datetime(ano + 1, 1, 1).date() - timedelta(days=1)
                else:
                    mes_fim = datetime(ano, mes + 1, 1).date() - timedelta(days=1)
                
                registros_mes = registros_trabalho.filter(
                    data__gte=mes_inicio,
                    data__lte=mes_fim
                )
                
                entregas_mes = registros_mes.aggregate(total=Sum('quantidade_entregues'))['total'] or 0
                ganho_mes = registros_mes.aggregate(total=Sum('valor'))['total'] or 0
                
                performance_mensal.append({
                    'mes': meses_nomes[mes-1],
                    'entregas': entregas_mes,
                    'ganho': float(ganho_mes)
                })
            
            # Distribuição de veículos
            try:
                from cadastro_veiculo.models import Veiculo
                
                veiculos = Veiculo.objects.filter(entregador=user)
                total_veiculos = veiculos.count()
                logger.debug(f"Total de veículos: {total_veiculos}")
                
                distribuicao_veiculos = []
                tipos_veiculos = {}
                
                for veiculo in veiculos:
                    tipo = veiculo.tipo  # Campo correto do modelo
                    if tipo in tipos_veiculos:
                        tipos_veiculos[tipo] += 1
                    else:
                        tipos_veiculos[tipo] = 1
                
                
                cores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']
                for i, (tipo, quantidade) in enumerate(tipos_veiculos.items()):
                    # Usar o display name do modelo
                    nome_tipo = dict(Veiculo.TIPO_CHOICES).get(tipo, tipo.title())
                    distribuicao_veiculos.append({
                        'name': nome_tipo,
                        'value': quantidade,
                        'color': cores[i % len(cores)]
                    })
                
            except ImportError as e:
                logger.error(f"Erro ao importar modelo Veiculo: {e}", exc_info=True)
                total_veiculos = 0
                distribuicao_veiculos = []
            except Exception as e:
                logger.error(f"Erro ao buscar veículos: {e}", exc_info=True)
                total_veiculos = 0
                distribuicao_veiculos = []
            
            # Últimos registros para a tabela
            ultimos_registros = []
            for registro in registros_trabalho.order_by('-data', '-hora_inicio')[:5]:
                # Buscar despesas do mesmo dia
                despesas_dia = despesas.filter(data=registro.data).aggregate(total=Sum('valor'))['total'] or 0
                lucro_dia = float(registro.valor) - float(despesas_dia)
                
                ultimos_registros.append({
                    'data': registro.data.strftime('%d/%m/%Y'),
                    'tipo_rendimento': 'unitario' if registro.tipo_pagamento == 'por_entrega' else 'diaria',
                    'ganho': float(registro.valor),
                    'despesa': float(despesas_dia),
                    'lucro': lucro_dia
                })
            
            # Calcular métricas adicionais
            taxa_sucesso = 0
            if total_entregas_realizadas + total_entregas_nao_realizadas > 0:
                taxa_sucesso = (total_entregas_realizadas / (total_entregas_realizadas + total_entregas_nao_realizadas)) * 100
            
            ganho_medio_dia = 0
            if dias_trabalhados > 0:
                ganho_medio_dia = total_ganhos / dias_trabalhados

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
                    'lucro_liquido': float(lucro_liquido),
                    'taxa_sucesso': round(taxa_sucesso, 1),
                    'ganho_medio_dia': round(ganho_medio_dia, 2),
                    'veiculos_cadastrados': total_veiculos
                },
                
                # Dados para gráficos
                'entregas_por_dia': entregas_por_dia,
                'ganhos_por_semana': ganhos_por_semana,
                'performance_mensal': performance_mensal,
                'distribuicao_veiculos': distribuicao_veiculos,
                'ultimos_registros': ultimos_registros,
                
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

# ===== APIs PARA CATEGORIAS DE DESPESAS =====

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def categorias_despesas(request):
    """API para listar e criar categorias de despesas"""
    logger.info(f"Categorias despesas chamado - Método: {request.method}, URL: {request.path}")
    
    if request.method == 'GET':
        # Listar categorias do usuário
        try:
            categorias = CategoriaDespesa.objects.filter(
                entregador=request.user, 
                ativa=True
            ).order_by('nome')
            
            categorias_data = []
            for categoria in categorias:
                categorias_data.append({
                    'id': categoria.id,
                    'nome': categoria.nome,
                    'descricao': categoria.descricao,
                    'data_criacao': categoria.data_criacao.strftime('%d/%m/%Y')
                })
            
            return Response({
                'success': True,
                'results': categorias_data,
                'count': len(categorias_data)
            })
        except Exception as e:
            logger.error(f"Erro ao listar categorias: {str(e)}", exc_info=True)
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'POST':
        # Criar nova categoria
        try:
            data = request.data
            logger.debug(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            if 'nome' not in data or not data['nome'].strip():
                return Response({
                    'success': False, 
                    'error': 'Nome da categoria é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            nome = data['nome'].strip()
            descricao = data.get('descricao', '').strip()
            
            # Verificar se já existe categoria com esse nome para o usuário
            if CategoriaDespesa.objects.filter(
                nome__iexact=nome, 
                entregador=request.user
            ).exists():
                return Response({
                    'success': False, 
                    'error': 'Já existe uma categoria com esse nome'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Criar categoria
            categoria = CategoriaDespesa.objects.create(
                nome=nome,
                descricao=descricao,
                entregador=request.user
            )
            
            logger.info(f"Categoria criada com sucesso! ID: {categoria.id}")
            
            return Response({
                'success': True, 
                'message': 'Categoria criada com sucesso',
                'data': {
                    'id': categoria.id,
                    'nome': categoria.nome,
                    'descricao': categoria.descricao
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Erro na criação da categoria: {str(e)}", exc_info=True)
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    else:
        return Response({
            'success': False, 
            'error': f'Método {request.method} não permitido'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def categoria_despesa_detail(request, categoria_id):
    """API para atualizar e deletar categoria específica"""
    logger.info(f"Categoria despesa detail chamado - Método: {request.method}, ID: {categoria_id}")
    
    try:
        categoria = CategoriaDespesa.objects.get(
            id=categoria_id, 
            entregador=request.user
        )
    except CategoriaDespesa.DoesNotExist:
        return Response({
            'success': False, 
            'error': 'Categoria não encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PUT':
        # Atualizar categoria
        try:
            data = request.data
            logger.debug(f"Dados recebidos: {data}")
            
            # Validar dados obrigatórios
            if 'nome' not in data or not data['nome'].strip():
                return Response({
                    'success': False, 
                    'error': 'Nome da categoria é obrigatório'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            nome = data['nome'].strip()
            descricao = data.get('descricao', '').strip()
            
            # Verificar se já existe outra categoria com esse nome para o usuário
            if CategoriaDespesa.objects.filter(
                nome__iexact=nome, 
                entregador=request.user
            ).exclude(id=categoria_id).exists():
                return Response({
                    'success': False, 
                    'error': 'Já existe uma categoria com esse nome'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Atualizar categoria
            categoria.nome = nome
            categoria.descricao = descricao
            categoria.save()
            
            logger.info(f"Categoria atualizada com sucesso! ID: {categoria.id}")
            
            return Response({
                'success': True, 
                'message': 'Categoria atualizada com sucesso',
                'data': {
                    'id': categoria.id,
                    'nome': categoria.nome,
                    'descricao': categoria.descricao
                }
            })
            
        except Exception as e:
            logger.error(f"Erro na atualização da categoria: {str(e)}", exc_info=True)
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif request.method == 'DELETE':
        # Deletar categoria (soft delete - marcar como inativa)
        try:
            # Verificar se há despesas usando esta categoria
            despesas_count = Despesa.objects.filter(
                categoria_personalizada=categoria
            ).count()
            
            if despesas_count > 0:
                # Se há despesas, apenas marcar como inativa
                categoria.ativa = False
                categoria.save()
                message = f'Categoria desativada (há {despesas_count} despesa(s) vinculada(s))'
            else:
                # Se não há despesas, deletar completamente
                categoria.delete()
                message = 'Categoria excluída com sucesso'
            
            logger.debug(f"Categoria processada: {message}")
            
            return Response({
                'success': True, 
                'message': message
            })
            
        except Exception as e:
            logger.error(f"Erro ao processar categoria: {str(e)}", exc_info=True)
            return Response({
                'success': False, 
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    else:
        return Response({
            'success': False, 
            'error': f'Método {request.method} não permitido'
        }, status=status.HTTP_405_METHOD_NOT_ALLOWED)


