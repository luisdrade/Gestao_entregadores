
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
from rest_framework_simplejwt.tokens import RefreshToken  # type: ignore[import]  # pylint: disable=import-error
from .serializers import EntregadorSerializer 

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

    # View de template removida - usando apenas API
    return JsonResponse({'success': False, 'error': 'Use a API para cadastro'})

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

# EntregadorMeView
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
    

# Verificar se o username já existe
@api_view(['GET'])
@permission_classes([AllowAny])
def check_username(request, username):
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


# Alterar senha do usuário via API
@api_view(['PUT'])
@permission_classes([AllowAny])
def change_password(request, pk):

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

# Estatísticas do usuário
class EstatisticasUsuarioView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Compat: delega para a nova view em relatorios_dashboard.api_views
        from relatorios_dashboard.api_views import EstatisticasUsuarioView as NovaView
        # Passa o HttpRequest original para evitar duplo wrap do DRF Request
        return NovaView.as_view()(request._request)

# Upload de foto de perfil
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
            
            try:
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
            
            import uuid
            filename = f"perfil_{user.id}_{uuid.uuid4().hex[:8]}.jpg"
            print(f"📸 UploadFotoPerfilView - Nome do arquivo: {filename}")
            
            # Salvar a imagem
            if user.foto:
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


# Relatório de trabalho
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_trabalho(request):

    from relatorios_dashboard.api_views import relatorio_trabalho as nova_func
    return nova_func(request._request)


# Relatório de despesas
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def relatorio_despesas(request):

    from relatorios_dashboard.api_views import relatorio_despesas as nova_func
    return nova_func(request._request)