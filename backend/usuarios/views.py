from django.shortcuts import render, redirect
from .forms import EntregadorForm
from .models import Entregador

from django.http import HttpResponse

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


class EntregadorMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Cria o objeto mas ainda não salva no banco
    user = serializer.save()

    # Criptografa a senha
    user.set_password(serializer.validated_data['password'])

    user.save()

    headers = self.get_success_headers(serializer.data)
    return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


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