#serializers

from rest_framework import serializers
from .models import Entregador
import uuid

class EntregadorSerializer(serializers.ModelSerializer):
    data_nascimento = serializers.DateField(required=False, allow_null=True)
    class Meta:
        model = Entregador
        fields = ['id', 'nome', 'cpf', 'telefone', 'email', 'password', 'data_nascimento']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')


        # Geração automática do username se não for enviado
        if 'username' not in validated_data or validated_data.get('username') is None:
            validated_data['username'] = str(uuid.uuid4())[:30]  # max 150, mas limitamos por segurança

        user = Entregador(**validated_data)
        user.set_password(password)
        user.save()
        return user


    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance 