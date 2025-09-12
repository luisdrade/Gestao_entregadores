from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Postagem(models.Model):
    STATUS_CHOICES = [
        ('aprovado', 'Aprovado'),
        ('pendente', 'Pendente'),
        ('rejeitado', 'Rejeitado'),
        ('removido', 'Removido'),
    ]
    
    autor = models.CharField(max_length=100)
    titulo = models.CharField(max_length=200)
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)
    
    # Campos de moderação
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aprovado')
    moderado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='postagens_moderadas')
    data_moderacao = models.DateTimeField(null=True, blank=True)
    motivo_moderacao = models.TextField(blank=True, null=True)
    is_visivel = models.BooleanField(default=True)

    class Meta:
        ordering = ['-data_criacao']

    def __str__(self):
        return f"{self.titulo} - {self.get_status_display()}"


class AnuncioVeiculo(models.Model):
    STATUS_CHOICES = [
        ('aprovado', 'Aprovado'),
        ('pendente', 'Pendente'),
        ('rejeitado', 'Rejeitado'),
        ('removido', 'Removido'),
    ]
    
    modelo = models.CharField(max_length=100)
    ano = models.PositiveIntegerField()
    quilometragem = models.PositiveIntegerField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    localizacao = models.CharField(max_length=100)
    link_externo = models.URLField()
    foto = models.ImageField(upload_to='anuncios_fotos/', null=True, blank=True)
    data_publicacao = models.DateTimeField(auto_now_add=True)
    
    # Campos de moderação
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='aprovado')
    moderado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='anuncios_moderados')
    data_moderacao = models.DateTimeField(null=True, blank=True)
    motivo_moderacao = models.TextField(blank=True, null=True)
    is_visivel = models.BooleanField(default=True)

    class Meta:
        ordering = ['-data_publicacao']

    def __str__(self):
        return f"{self.modelo} - {self.ano} - {self.get_status_display()}"
