from rest_framework import serializers
from .models import Postagem, AnuncioVeiculo

class PostagemSerializer(serializers.ModelSerializer):
    """
    Serializer para postagens da comunidade
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    moderado_por_nome = serializers.CharField(source='moderado_por.nome', read_only=True)
    
    class Meta:
        model = Postagem
        fields = [
            'id', 'autor', 'titulo', 'conteudo', 'data_criacao',
            'status', 'status_display', 'moderado_por', 'moderado_por_nome',
            'data_moderacao', 'motivo_moderacao', 'is_visivel'
        ]
        read_only_fields = ['id', 'data_criacao', 'moderado_por', 'data_moderacao']

class AnuncioVeiculoSerializer(serializers.ModelSerializer):
    """
    Serializer para anúncios de veículos
    """
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    moderado_por_nome = serializers.CharField(source='moderado_por.nome', read_only=True)
    preco = serializers.DecimalField(max_digits=10, decimal_places=2, coerce_to_string=False)
    
    class Meta:
        model = AnuncioVeiculo
        fields = [
            'id', 'modelo', 'ano', 'quilometragem', 'preco', 'localizacao',
            'link_externo', 'foto', 'data_publicacao', 'status', 'status_display',
            'moderado_por', 'moderado_por_nome', 'data_moderacao', 'motivo_moderacao', 'is_visivel'
        ]
        read_only_fields = ['id', 'data_publicacao', 'moderado_por', 'data_moderacao']

class ModerarConteudoSerializer(serializers.Serializer):
    """
    Serializer para ações de moderação
    """
    status = serializers.ChoiceField(choices=['aprovado', 'pendente', 'rejeitado', 'removido'])
    motivo = serializers.CharField(required=False, allow_blank=True, max_length=500)

