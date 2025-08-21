#serializers

from rest_framework import serializers
from .models import Entregador
import uuid

class EntregadorSerializer(serializers.ModelSerializer):
    data_nascimento = serializers.DateField(required=False, allow_null=True, input_formats=['%Y-%m-%d', '%d/%m/%Y'])
    senha = serializers.CharField(write_only=True, source='password')
    
    class Meta:
        model = Entregador
        fields = [
            'id', 'nome', 'cpf', 'telefone', 'email', 'username', 
            'senha', 'data_nascimento', 'endereco', 'cep', 'cidade', 'estado'
        ]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = Entregador.objects.create_user(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        # Atualizar campos
        for attr, value in validated_data.items():
            if hasattr(instance, attr):
                setattr(instance, attr, value)
        
        # Tratar senha se fornecida
        if password is not None:
            instance.set_password(password)
        
        instance.save()
        return instance 