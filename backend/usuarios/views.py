from django.shortcuts import render, redirect
from .forms import EntregadorForm
from .models import Entregador

from django.http import HttpResponse

from rest_framework import viewsets, permissions, status # viewsets Organiza a lógica da API | permissions Controla o acesso | status Gerencia o status da resposta
from rest_framework.response import Response # Formata as respostas da API
from rest_framework.decorators import action # Adiciona funcionalidades extras
from django.contrib.auth import get_user_model # Acessa o modelo de usuário

from rest_framework.views import APIView
from .serializers import EntregadorSerializer 

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

def create(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    # Cria o objeto mas ainda não salva no banco
    user = serializer.save(commit=False)

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

class EntregadorMeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = EntregadorSerializer(request.user)
        return Response(serializer.data)
    
