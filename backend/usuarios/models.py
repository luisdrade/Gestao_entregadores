from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
import django.utils.timezone

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O email é obrigatório")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class Entregador(AbstractBaseUser, PermissionsMixin):
    nome = models.CharField(max_length=100)
    cpf = models.CharField(max_length=14, unique=True, null=True, blank=True)
    telefone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    data_nascimento = models.DateField(null=True, blank=True)
    
    endereco = models.CharField(max_length=200, null=True, blank=True)
    cep = models.CharField(max_length=10, null=True, blank=True)
    cidade = models.CharField(max_length=100, null=True, blank=True)
    estado = models.CharField(max_length=2, null=True, blank=True)

    # Campo de foto
    foto = models.ImageField(upload_to='fotos_perfil/', null=True, blank=True)

    # Validação de email (apenas para web)
    email_validado = models.BooleanField(default=False)
    email_codigo_validacao = models.CharField(max_length=6, null=True, blank=True)
    email_codigo_expira_em = models.DateTimeField(null=True, blank=True)

    # Autenticação de 2 fatores via email
    two_factor_enabled = models.BooleanField(default=False)
    two_factor_required = models.BooleanField(default=False)  # Se deve pedir 2FA no próximo login
    last_2fa_check = models.DateTimeField(null=True, blank=True)  # Última verificação 2FA

    # Campos de sistema
    date_joined = models.DateTimeField(default=django.utils.timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nome', 'telefone', 'username']

    def __str__(self):
        return self.email

class TwoFactorVerification(models.Model):
    """
    Modelo para armazenar códigos de verificação temporários do 2FA via email
    """
    user = models.ForeignKey(Entregador, on_delete=models.CASCADE, related_name='two_factor_verifications')
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    purpose = models.CharField(max_length=20, default='login', choices=[
        ('login', 'Login'),
        ('setup', 'Setup'),
        ('disable', 'Disable')
    ])
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"2FA Code for {self.user.email} - {self.code} ({self.purpose})"
    
    def is_expired(self):
        return django.utils.timezone.now() > self.expires_at

class TrustedDevice(models.Model):
    """
    Modelo para dispositivos confiáveis que não precisam de 2FA
    """
    user = models.ForeignKey(Entregador, on_delete=models.CASCADE, related_name='trusted_devices')
    device_id = models.CharField(max_length=255)  # ID único do dispositivo
    device_name = models.CharField(max_length=100)  # Nome do dispositivo
    device_type = models.CharField(max_length=50, choices=[
        ('mobile', 'Mobile'),
        ('web', 'Web'),
        ('tablet', 'Tablet')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user', 'device_id']
        ordering = ['-last_used']
    
    def __str__(self):
        return f"{self.user.email} - {self.device_name} ({self.device_type})"
