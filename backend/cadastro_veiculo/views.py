from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import render
from .models import Veiculo
from .serializers import VeiculoSerializer
from .forms import VeiculoForm

class VeiculoViewSet(viewsets.ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Retorna apenas os veículos do usuário logado"""
        return Veiculo.objects.filter(entregador=self.request.user)

    def create(self, request, *args, **kwargs):
        """Cria um novo veículo"""
        try:
            serializer = self.get_serializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            
            return Response({
                'success': True,
                'message': 'Veículo cadastrado com sucesso',
                'veiculo': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erro ao cadastrar veículo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, *args, **kwargs):
        """Atualiza um veículo"""
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True, context={'request': request})
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            return Response({
                'success': True,
                'message': 'Veículo atualizado com sucesso',
                'veiculo': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erro ao atualizar veículo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, *args, **kwargs):
        """Remove um veículo"""
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            
            return Response({
                'success': True,
                'message': 'Veículo removido com sucesso'
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erro ao remover veículo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def meus_veiculos(self, request):
        """Retorna os veículos do usuário logado"""
        try:
            veiculos = self.get_queryset()
            serializer = self.get_serializer(veiculos, many=True)
            
            return Response({
                'success': True,
                'veiculos': serializer.data
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Erro ao buscar veículos: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View para o template HTML (mantida para compatibilidade)
def cadastro_veiculo_view(request):
    if request.method == 'POST':
        form = VeiculoForm(request.POST)
        if form.is_valid():
            veiculo = form.save(commit=False)
            veiculo.entregador = request.user
            veiculo.save()
            return render(request, 'cadastro_veiculo/sucesso.html')
    else:
        form = VeiculoForm()
    
    return render(request, 'cadastro_veiculo/index.html', {'form': form})
