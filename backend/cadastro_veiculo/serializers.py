from rest_framework import serializers
from .models import Veiculo

class VeiculoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    
    class Meta:
        model = Veiculo
        fields = [
            'id', 'tipo', 'tipo_display', 'modelo', 'placa', 
            'categoria', 'categoria_display', 'km_por_l', 'data_cadastro'
        ]
        read_only_fields = ['id', 'data_cadastro', 'entregador']
    
    def create(self, validated_data):
        # Associa o veículo ao usuário logado
        validated_data['entregador'] = self.context['request'].user
        return super().create(validated_data)
