from django.shortcuts import render, redirect
from .forms import EntregadorForm
from .models import Entregador

from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
import json

from rest_framework import viewsets, permissions, status # viewsets Organiza a lógica da API | permissions Controla o acesso | status Gerencia o status da resposta
from rest_framework.response import Response # Formata as respostas da API
from rest_framework.decorators import action # Adiciona funcionalidades extras
from django.contrib.auth import get_user_model # Acessa o modelo de usuário

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import EntregadorSerializer 

import requests
from allauth.socialaccount.models import SocialAccount
from django.db import models # Adicionado para usar models.Sum
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import base64

# Views de autenticação customizadas
class TestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({'message': 'Backend funcionando!'})

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = Entregador.objects.get(email=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'token': str(refresh.access_token),
                    'user': {
                        'id': user.id,
                        'nome': user.nome,
                        'email': user.email,
                        'cpf': user.cpf,
                        'telefone': user.telefone,
                    }
                })
            else:
                return Response({'error': 'Senha incorreta'}, status=status.HTTP_400_BAD_REQUEST)
        except Entregador.DoesNotExist:
            return Response({'error': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = EntregadorSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Usuário criado com sucesso',
                'token': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'nome': user.nome,
                    'email': user.email,
                    'cpf': user.cpf,
                    'telefone': user.telefone,
                }
            }, status=status.HTTP_201_CREATED)
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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

class EntregadorViewSet(viewsets.ModelViewSet):
    queryset = Entregador.objects.all()
    serializer_class = EntregadorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()] # pode criar uma conta sem estar autenticado
        return super().get_permissions()

    @action(detail=False, methods=['get']) # cria endpoint para ver o usuário logado
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """Atualiza os dados de um entregador"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response({
                'success': True,
                'message': 'Perfil atualizado com sucesso',
                'user': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erro ao atualizar perfil: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EntregadorMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = EntregadorSerializer(request.user)
        return Response(serializer.data)
    
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Apaga o token do usuário logado
        request.user.auth_token.delete()
        return Response({"detail": "Logout realizado com sucesso"})
    
class GoogleLogin(APIView):
    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'Token não fornecido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verifica o token com o Google
        google_response = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            params={'access_token': access_token}
        )
        
        if google_response.status_code != 200:
            return Response({'error': 'Token inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_data = google_response.json()
        email = user_data.get('email')
        
        if not email:
            return Response({'error': 'Email não encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Busca ou cria o usuário
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                email=email,
                username=email.split('@')[0],
                password=None  # Senha não é necessária para login social
            )
        
        # Cria/atualiza a conta social
        SocialAccount.objects.update_or_create(
            provider='google',
            uid=user_data['sub'],
            defaults={'user': user, 'extra_data': user_data}
        )
        
        # Gera token JWT (ou o método de autenticação que você usa)
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def check_username(request, username):
    """
    Verifica se um username está disponível
    """
    try:
        # Verificar se o username já existe
        exists = Entregador.objects.filter(username=username).exists()
        
        return Response({
            'available': not exists,
            'username': username
        })
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([AllowAny])
def change_password(request, pk):
    """
    Altera a senha de um entregador
    """
    try:
        # Buscar o entregador
        entregador = Entregador.objects.get(pk=pk)
        
        # Dados recebidos
        data = request.data
        current_password = data.get('senhaAtual')
        new_password = data.get('novaSenha')
        
        # Validar dados
        if not current_password or not new_password:
            return Response({
                'success': False,
                'message': 'Senha atual e nova senha são obrigatórias'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a senha atual está correta
        if not entregador.check_password(current_password):
            return Response({
                'success': False,
                'message': 'Senha atual incorreta'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar se a nova senha é diferente da atual
        if entregador.check_password(new_password):
            return Response({
                'success': False,
                'message': 'A nova senha deve ser diferente da atual'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Alterar a senha
        entregador.set_password(new_password)
        entregador.save()
        
        return Response({
            'success': True,
            'message': 'Senha alterada com sucesso'
        })
        
    except Entregador.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Entregador não encontrado'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Erro ao alterar senha: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EstatisticasUsuarioView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            user = request.user
            
            # Contar veículos cadastrados
            from cadastro_veiculo.models import Veiculo
            veiculos_count = Veiculo.objects.filter(entregador=user).count()
            
            # Calcular total de entregas e ganhos
            from registro_entregadespesa.models import RegistroTrabalho, Despesa
            
            # Total de pacotes entregues
            total_entregas = RegistroTrabalho.objects.filter(
                entregador=user
            ).aggregate(
                total=models.Sum('quantidade_entregues')
            )['total'] or 0
            
            # Total de ganhos (lucro)
            total_ganhos = 0
            registros_trabalho = RegistroTrabalho.objects.filter(entregador=user)
            for registro in registros_trabalho:
                total_ganhos += float(registro.valor)
            
            # Subtrair despesas
            registros_despesa = Despesa.objects.filter(
                entregador=user
            )
            total_despesas = sum(float(reg.valor) for reg in registros_despesa)
            
            lucro_total = total_ganhos - total_despesas
            
            # Contar dias únicos trabalhados
            dias_trabalhados = RegistroTrabalho.objects.filter(
                entregador=user
            ).values('data').distinct().count()
            
            # Data de primeiro acesso (data de criação da conta)
            # Usar data atual se não tiver date_joined
            from datetime import date
            if hasattr(user, 'date_joined') and user.date_joined:
                data_primeiro_acesso = user.date_joined.date()
                dias_conectado = (date.today() - data_primeiro_acesso).days
            else:
                # Fallback: usar data atual
                dias_conectado = 0
            
            return Response({
                'totalEntregas': total_entregas,
                'totalGanhos': round(lucro_total, 2),
                'veiculosCadastrados': veiculos_count,
                'diasTrabalhados': dias_trabalhados,
                'diasConectado': dias_conectado,
                'foto': user.foto.url if user.foto else None
            })
            
        except Exception as e:
            print(f"Erro na view de estatísticas: {str(e)}")
            return Response(
                {'error': f'Erro ao buscar estatísticas: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UploadFotoPerfilView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            foto_data = request.data.get('foto')
            
            print(f"📸 UploadFotoPerfilView - Usuário: {user.email}")
            print(f"📸 UploadFotoPerfilView - Dados recebidos: {len(str(foto_data))} caracteres")
            
            if not foto_data:
                print("❌ UploadFotoPerfilView - Nenhuma foto fornecida")
                return Response(
                    {'error': 'Nenhuma foto fornecida'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Decodificar a imagem base64
            try:
                # Remover o prefixo data:image/...;base64, se existir
                if ';base64,' in foto_data:
                    foto_data = foto_data.split(';base64,')[1]
                
                print(f"📸 UploadFotoPerfilView - Base64 limpo: {len(foto_data)} caracteres")
                foto_bytes = base64.b64decode(foto_data)
                print(f"📸 UploadFotoPerfilView - Bytes decodificados: {len(foto_bytes)} bytes")
                
            except Exception as e:
                print(f"❌ UploadFotoPerfilView - Erro ao decodificar base64: {str(e)}")
                return Response(
                    {'error': 'Formato de imagem inválido'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Gerar nome único para o arquivo
            import uuid
            filename = f"perfil_{user.id}_{uuid.uuid4().hex[:8]}.jpg"
            print(f"📸 UploadFotoPerfilView - Nome do arquivo: {filename}")
            
            # Salvar a imagem
            if user.foto:
                # Remover foto antiga se existir
                try:
                    if default_storage.exists(user.foto.name):
                        default_storage.delete(user.foto.name)
                        print(f"📸 UploadFotoPerfilView - Foto antiga removida: {user.foto.name}")
                except Exception as e:
                    print(f"⚠️ UploadFotoPerfilView - Erro ao remover foto antiga: {str(e)}")
            
            # Salvar nova foto
            try:
                user.foto.save(filename, ContentFile(foto_bytes), save=True)
                print(f"📸 UploadFotoPerfilView - Nova foto salva: {user.foto.name}")
                print(f"📸 UploadFotoPerfilView - URL da foto: {user.foto.url}")
                
                return Response({
                    'success': True,
                    'message': 'Foto atualizada com sucesso',
                    'foto_url': user.foto.url if user.foto else None
                })
                
            except Exception as e:
                print(f"❌ UploadFotoPerfilView - Erro ao salvar foto: {str(e)}")
                return Response(
                    {'error': f'Erro ao salvar foto: {str(e)}'}, 
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        except Exception as e:
            print(f"❌ UploadFotoPerfilView - Erro geral: {str(e)}")
            return Response(
                {'error': f'Erro ao fazer upload da foto: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_trabalho(request):
    """Endpoint para relatório de trabalho"""
    if request.method == 'GET':
        try:
            from datetime import datetime, timedelta
            from django.utils import timezone
            from django.db.models import Sum, Count, Q, Avg
            from registro_entregadespesa.models import RegistroTrabalho
            
            user = request.user
            periodo = request.GET.get('periodo', 'mes')  # 'semana', 'mes', 'ano'
            
            # Calcular datas base
            hoje = timezone.now().date()
            if periodo == 'semana':
                data_inicio = hoje - timedelta(days=7)
            elif periodo == 'ano':
                data_inicio = hoje - timedelta(days=365)
            else:  # mês
                data_inicio = hoje - timedelta(days=30)
            
            # Filtrar registros por período e pelo entregador autenticado
            registros_trabalho = RegistroTrabalho.objects.filter(
                entregador=user,
                data__gte=data_inicio,
                data__lte=hoje
            ).order_by('data')
            
            # Calcular estatísticas
            total_dias = registros_trabalho.count()
            total_entregas = registros_trabalho.aggregate(
                total=Sum('quantidade_entregues')
            )['total'] or 0
            
            entregas_realizadas = registros_trabalho.aggregate(
                total=Sum('quantidade_entregues')
            )['total'] or 0
            
            entregas_nao_realizadas = registros_trabalho.aggregate(
                total=Sum('quantidade_nao_entregues')
            )['total'] or 0
            
            ganho_total = registros_trabalho.aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            media_entregas_dia = entregas_realizadas / max(total_dias, 1)
            
            # Encontrar melhor e pior dia
            dias_com_entregas = registros_trabalho.filter(quantidade_entregues__gt=0)
            if dias_com_entregas.exists():
                melhor_dia_obj = dias_com_entregas.order_by('-quantidade_entregues').first()
                pior_dia_obj = dias_com_entregas.order_by('quantidade_entregues').first()
                melhor_dia = melhor_dia_obj.data.strftime('%d/%m/%Y') if melhor_dia_obj else 'N/A'
                pior_dia = pior_dia_obj.data.strftime('%d/%m/%Y') if pior_dia_obj else 'N/A'
            else:
                melhor_dia = 'N/A'
                pior_dia = 'N/A'
            
            # Lista de dias trabalhados (com ID para edição/exclusão)
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
            
            return Response({
                'success': True,
                'data': relatorio_data
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_despesas(request):
    """Endpoint para relatório de despesas"""
    if request.method == 'GET':
        try:
            from datetime import datetime, timedelta
            from django.utils import timezone
            from django.db.models import Sum, Count, Q
            from registro_entregadespesa.models import Despesa
            
            user = request.user
            periodo = request.GET.get('periodo', 'mes')  # 'semana', 'mes', 'ano'
            
            print(f"🔍 Relatório Despesas - Usuário: {user.nome}, Período: {periodo}")
            
            # Calcular datas base
            hoje = timezone.now().date()
            if periodo == 'semana':
                data_inicio = hoje - timedelta(days=7)
            elif periodo == 'ano':
                data_inicio = hoje - timedelta(days=365)
            else:  # mês
                data_inicio = hoje - timedelta(days=30)
            
            # Filtrar despesas por período e pelo entregador autenticado
            despesas = Despesa.objects.filter(
                entregador=user,
                data__gte=data_inicio,
                data__lte=hoje
            ).order_by('data')
            
            print(f"🔍 Relatório Despesas - Período: {data_inicio} até {hoje}")
            print(f"🔍 Relatório Despesas - Despesas encontradas: {despesas.count()}")
            
            # Calcular estatísticas gerais
            total_despesas = despesas.aggregate(
                total=Sum('valor')
            )['total'] or 0
            
            # Calcular média de despesas por dia (considerando todos os dias do período)
            dias_periodo = (hoje - data_inicio).days + 1
            media_despesas_dia = total_despesas / max(dias_periodo, 1)
            
            # Maior despesa
            maior_despesa_obj = despesas.order_by('-valor').first()
            maior_despesa = float(maior_despesa_obj.valor) if maior_despesa_obj else 0
            
            # Mapeamento de categorias para português
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
            
            # Despesas por categoria
            despesas_por_categoria = []
            categorias = despesas.values('tipo_despesa').distinct()
            
            for categoria in categorias:
                cat_key = categoria['tipo_despesa']
                cat_nome = categoria_mapping.get(cat_key, cat_key)
                total_cat = despesas.filter(tipo_despesa=cat_key).aggregate(
                    total=Sum('valor')
                )['total'] or 0
                
                despesas_por_categoria.append({
                    'nome': cat_nome,
                    'total': float(total_cat)
                })
            
            # Ordenar por total (maior para menor)
            despesas_por_categoria.sort(key=lambda x: x['total'], reverse=True)
            
            # Categoria mais cara
            categoria_mais_cara = despesas_por_categoria[0]['nome'] if despesas_por_categoria else 'N/A'
            
            # Despesas por dia (com ID para edição/exclusão)
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
            
            print(f"✅ Relatório Despesas - Dados enviados: {relatorio_data}")
            
            return Response({
                'success': True,
                'data': relatorio_data
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