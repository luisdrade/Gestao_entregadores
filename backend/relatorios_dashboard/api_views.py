from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import permissions, status

from django.db import models
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


class EstatisticasUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            from cadastro_veiculo.models import Veiculo
            veiculos_count = Veiculo.objects.filter(entregador=user).count()

            from registro_entregadespesa.models import RegistroTrabalho, Despesa

            total_entregas = (
                RegistroTrabalho.objects.filter(entregador=user)
                .aggregate(total=models.Sum('quantidade_entregues'))['total']
                or 0
            )

            total_ganhos = 0
            registros_trabalho = RegistroTrabalho.objects.filter(entregador=user)
            for registro in registros_trabalho:
                total_ganhos += float(registro.valor)

            registros_despesa = Despesa.objects.filter(entregador=user)
            total_despesas = sum(float(reg.valor) for reg in registros_despesa)

            lucro_total = total_ganhos - total_despesas

            dias_trabalhados = (
                RegistroTrabalho.objects.filter(entregador=user)
                .values('data').distinct().count()
            )

            from datetime import date
            if hasattr(user, 'date_joined') and user.date_joined:
                data_primeiro_acesso = user.date_joined.date()
                dias_conectado = (date.today() - data_primeiro_acesso).days
            else:
                dias_conectado = 0

            return Response({
                'totalEntregas': total_entregas,
                'totalGanhos': round(lucro_total, 2),
                'veiculosCadastrados': veiculos_count,
                'diasTrabalhados': dias_trabalhados,
                'diasConectado': dias_conectado,
                'foto': user.foto.url if getattr(user, 'foto', None) else None
            })

        except Exception as e:
            return Response(
                {'error': f'Erro ao buscar estatísticas: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_trabalho(request):
    if request.method == 'GET':
        try:
            from datetime import timedelta
            from django.utils import timezone
            from django.db.models import Sum
            from registro_entregadespesa.models import RegistroTrabalho

            user = request.user
            periodo = request.GET.get('periodo', 'mes')

            hoje = timezone.now().date()
            if periodo == 'semana':
                data_inicio = hoje - timedelta(days=7)
            elif periodo == 'ano':
                data_inicio = hoje - timedelta(days=365)
            else:
                data_inicio = hoje - timedelta(days=30)

            registros_trabalho = (
                RegistroTrabalho.objects.filter(
                    entregador=user,
                    data__gte=data_inicio,
                    data__lte=hoje
                ).order_by('data')
            )

            total_dias = registros_trabalho.count()
            total_entregas = registros_trabalho.aggregate(total=Sum('quantidade_entregues'))['total'] or 0

            entregas_realizadas = registros_trabalho.aggregate(total=Sum('quantidade_entregues'))['total'] or 0
            entregas_nao_realizadas = registros_trabalho.aggregate(total=Sum('quantidade_nao_entregues'))['total'] or 0
            ganho_total = registros_trabalho.aggregate(total=Sum('valor'))['total'] or 0

            media_entregas_dia = entregas_realizadas / max(total_dias, 1)

            dias_com_entregas = registros_trabalho.filter(quantidade_entregues__gt=0)
            if dias_com_entregas.exists():
                melhor_dia_obj = dias_com_entregas.order_by('-quantidade_entregues').first()
                pior_dia_obj = dias_com_entregas.order_by('quantidade_entregues').first()
                melhor_dia = melhor_dia_obj.data.strftime('%d/%m/%Y') if melhor_dia_obj else 'N/A'
                pior_dia = pior_dia_obj.data.strftime('%d/%m/%Y') if pior_dia_obj else 'N/A'
            else:
                melhor_dia = 'N/A'
                pior_dia = 'N/A'

            dias_trabalhados = []
            for registro in registros_trabalho:
                dias_trabalhados.append({
                    'id': registro.id,
                    'data': registro.data.strftime('%Y-%m-%d'),
                    'entregas': registro.quantidade_entregues,
                    'ganho': float(registro.valor)
                })

            relatorio_data = {
                'total_dias': total_dias,
                'total_entregas': total_entregas,
                'entregas_realizadas': entregas_realizadas,
                'entregas_nao_realizadas': entregas_nao_realizadas,
                'ganho_total': float(ganho_total),
                'media_entregas_dia': float(media_entregas_dia),
                'melhor_dia': melhor_dia,
                'pior_dia': pior_dia,
                'dias_trabalhados': dias_trabalhados
            }

            return Response({'success': True, 'data': relatorio_data})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'success': False, 'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_despesas(request):
    if request.method == 'GET':
        try:
            from datetime import timedelta
            from django.utils import timezone
            from django.db.models import Sum
            from registro_entregadespesa.models import Despesa

            user = request.user
            periodo = request.GET.get('periodo', 'mes')

            hoje = timezone.now().date()
            if periodo == 'semana':
                data_inicio = hoje - timedelta(days=7)
            elif periodo == 'ano':
                data_inicio = hoje - timedelta(days=365)
            else:
                data_inicio = hoje - timedelta(days=30)

            despesas = (
                Despesa.objects.filter(
                    entregador=user,
                    data__gte=data_inicio,
                    data__lte=hoje
                ).order_by('data')
            )

            total_despesas = despesas.aggregate(total=Sum('valor'))['total'] or 0
            dias_periodo = (hoje - data_inicio).days + 1
            media_despesas_dia = total_despesas / max(dias_periodo, 1)

            maior_despesa_obj = despesas.order_by('-valor').first()
            maior_despesa = float(maior_despesa_obj.valor) if maior_despesa_obj else 0

            categoria_mapping = {
                'alimentacao': 'Alimentação',
                'combustivel': 'Combustível',
                'manutencao': 'Manutenção',
                'pedagio': 'Pedágio',
                'estacionamento': 'Estacionamento',
                'seguro': 'Seguro',
                'licenciamento': 'Licenciamento',
                'outros': 'Outros'
            }

            despesas_por_categoria = []
            categorias = despesas.values('tipo_despesa').distinct()
            for categoria in categorias:
                cat_key = categoria['tipo_despesa']
                cat_nome = categoria_mapping.get(cat_key, cat_key)
                total_cat = despesas.filter(tipo_despesa=cat_key).aggregate(total=Sum('valor'))['total'] or 0
                despesas_por_categoria.append({'nome': cat_nome, 'total': float(total_cat)})

            despesas_por_categoria.sort(key=lambda x: x['total'], reverse=True)
            categoria_mais_cara = despesas_por_categoria[0]['nome'] if despesas_por_categoria else 'N/A'

            despesas_por_dia = []
            for despesa in despesas:
                despesas_por_dia.append({
                    'id': despesa.id,
                    'data': despesa.data.strftime('%Y-%m-%d'),
                    'categoria': categoria_mapping.get(despesa.tipo_despesa, despesa.tipo_despesa),
                    'valor': float(despesa.valor),
                    'descricao': despesa.descricao or ''
                })

            relatorio_data = {
                'total_despesas': float(total_despesas),
                'media_despesas_dia': float(media_despesas_dia),
                'maior_despesa': float(maior_despesa),
                'categoria_mais_cara': categoria_mais_cara,
                'despesas_por_categoria': despesas_por_categoria,
                'despesas_por_dia': despesas_por_dia
            }

            return Response({'success': True, 'data': relatorio_data})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'success': False, 'error': 'Método não permitido'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


