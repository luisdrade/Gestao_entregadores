from django.db import models
from django.contrib.auth import get_user_model

Entregador = get_user_model()

class Veiculo(models.Model):
    TIPO_CHOICES = [
        ('carro', 'Carro'),
        ('moto', 'Moto'),
    ]
    
    CATEGORIA_CHOICES = [
        ('passeio', 'Passeio'),
        ('utilitario', 'Utilitário'),
    ]
    
    entregador = models.ForeignKey(Entregador, on_delete=models.CASCADE, related_name='veiculos')
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='carro')
    modelo = models.CharField(max_length=100)
    placa = models.CharField(max_length=10, blank=True, null=True)
    categoria = models.CharField(max_length=10, choices=CATEGORIA_CHOICES, default='passeio')
    km_por_l = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    data_cadastro = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.modelo}"
    
    class Meta:
        verbose_name = 'Veículo'
        verbose_name_plural = 'Veículos'
        ordering = ['-data_cadastro']
