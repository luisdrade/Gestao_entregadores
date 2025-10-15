from rest_framework import serializers
from ..models import Entregador
from django.contrib.auth.password_validation import validate_password

class LoginSerializer(serializers.Serializer):
    """
    Serializer para login
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de usuários
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Entregador
        fields = [
            'nome', 'email', 'password', 'password_confirm', 'cpf', 'telefone',
            'username', 'data_nascimento', 'endereco', 'cep', 'cidade', 'estado'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
            'username': {'required': True},
            'cpf': {'required': False},
            'data_nascimento': {'required': False},
            'endereco': {'required': False},
            'cep': {'required': False},
            'cidade': {'required': False},
            'estado': {'required': False}
        }
    
    def validate(self, attrs):
        # Verificar se as senhas coincidem
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem")
        
        # Verificar se email já existe
        if Entregador.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Este email já está cadastrado")
        
        # Verificar se username já existe
        if Entregador.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Este username já está em uso")
        
        # Verificar se CPF já existe (apenas se fornecido)
        if attrs.get('cpf') and Entregador.objects.filter(cpf=attrs['cpf']).exists():
            raise serializers.ValidationError("Este CPF já está cadastrado")
        
        return attrs
    
    def create(self, validated_data):
        # Remover password_confirm dos dados
        validated_data.pop('password_confirm')
        
        # Criar usuário com senha criptografada
        user = Entregador.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nome=validated_data['nome'],
            cpf=validated_data.get('cpf'),
            telefone=validated_data['telefone'],
            username=validated_data['username'],
            data_nascimento=validated_data.get('data_nascimento'),
            endereco=validated_data.get('endereco'),
            cep=validated_data.get('cep'),
            cidade=validated_data.get('cidade'),
            estado=validated_data.get('estado'),
            is_staff=False,  # Sempre cria como entregador normal
            is_superuser=False
        )
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para perfil do usuário
    """
    user_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Entregador
        fields = [
            'id', 'nome', 'email', 'cpf', 'telefone', 'username',
            'data_nascimento', 'endereco', 'cep', 'cidade', 'estado',
            'foto', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'user_type',
            'email_validado', 'two_factor_enabled'
        ]
        read_only_fields = ['id', 'email', 'cpf', 'is_staff', 'is_superuser', 'date_joined', 'email_validado']
    
    def get_user_type(self, obj):
        return 'admin' if obj.is_staff else 'entregador'

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer para alteração de senha
    """
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        # Verificar se as novas senhas coincidem
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("As novas senhas não coincidem")
        
        return attrs

class AdminCreateUserSerializer(serializers.ModelSerializer):
    """
    Serializer para administradores criarem usuários
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = Entregador
        fields = [
            'nome', 'email', 'password', 'password_confirm', 'cpf', 'telefone',
            'username', 'data_nascimento', 'endereco', 'cep', 'cidade', 'estado',
            'is_staff', 'is_superuser'
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'password_confirm': {'write_only': True},
            'username': {'required': True},
            'cpf': {'required': False},
            'data_nascimento': {'required': False},
            'endereco': {'required': False},
            'cep': {'required': False},
            'cidade': {'required': False},
            'estado': {'required': False},
            'is_staff': {'required': False},
            'is_superuser': {'required': False}
        }
    
    def validate(self, attrs):
        # Verificar se as senhas coincidem
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("As senhas não coincidem")
        
        # Verificar se email já existe
        if Entregador.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError("Este email já está cadastrado")
        
        # Verificar se username já existe
        if Entregador.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError("Este username já está em uso")
        
        # Verificar se CPF já existe (apenas se fornecido)
        if attrs.get('cpf') and Entregador.objects.filter(cpf=attrs['cpf']).exists():
            raise serializers.ValidationError("Este CPF já está cadastrado")
        
        return attrs
    
    def create(self, validated_data):
        # Remover password_confirm dos dados
        validated_data.pop('password_confirm')
        
        # Definir valores padrão para campos de permissão
        validated_data.setdefault('is_staff', False)
        validated_data.setdefault('is_superuser', False)
        
        # Criar usuário com senha criptografada
        user = Entregador.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nome=validated_data['nome'],
            cpf=validated_data.get('cpf'),
            telefone=validated_data['telefone'],
            username=validated_data['username'],
            data_nascimento=validated_data.get('data_nascimento'),
            endereco=validated_data.get('endereco'),
            cep=validated_data.get('cep'),
            cidade=validated_data.get('cidade'),
            estado=validated_data.get('estado'),
            is_staff=validated_data['is_staff'],
            is_superuser=validated_data['is_superuser']
        )
        
        return user

class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer para listagem de usuários (admin)
    """
    user_type = serializers.SerializerMethodField()
    
    class Meta:
        model = Entregador
        fields = [
            'id', 'nome', 'email', 'cpf', 'telefone', 'username',
            'is_active', 'is_staff', 'is_superuser', 'date_joined', 'last_login', 'user_type'
        ]
    
    def get_user_type(self, obj):
        return 'admin' if obj.is_staff else 'entregador'

class TwoFactorSetupSerializer(serializers.Serializer):
    """
    Serializer para configuração inicial do 2FA via email
    """
    pass

class TwoFactorVerifySerializer(serializers.Serializer):
    """
    Serializer para verificação do código 2FA
    """
    code = serializers.CharField(max_length=6, min_length=6)
    
    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("O código deve conter apenas números")
        return value

class TwoFactorDisableSerializer(serializers.Serializer):
    """
    Serializer para desabilitar 2FA
    """
    password = serializers.CharField(write_only=True)
    code = serializers.CharField(max_length=6, min_length=6)
    
    def validate_code(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("O código deve conter apenas números")
        return value
