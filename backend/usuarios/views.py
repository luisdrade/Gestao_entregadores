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