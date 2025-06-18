from rest_framework import serializers
from .models import Entregador

class EntregadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entregador
        fields = ['id', 'nome', 'cpf', 'telefone', 'email', 'is_active']
        read_only_fields = ['id'] # campos que não podem ser alterados
        extra_kwargs = {
            'password': {'write_only': True} # campo que não pode ser lido
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password) # criptografa a senha
        instance.save()
        return instance

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance 