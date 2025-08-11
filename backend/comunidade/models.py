from django.db import models

class Postagem(models.Model):
    autor = models.CharField(max_length=100)
    titulo = models.CharField(max_length=200)
    conteudo = models.TextField()
    data_criacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo


class AnuncioVeiculo(models.Model):
    modelo = models.CharField(max_length=100)
    ano = models.PositiveIntegerField()
    quilometragem = models.PositiveIntegerField()
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    localizacao = models.CharField(max_length=100)
    link_externo = models.URLField()
    foto = models.ImageField(upload_to='anuncios_fotos/', null=True, blank=True)
    data_publicacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.modelo} - {self.ano}"
