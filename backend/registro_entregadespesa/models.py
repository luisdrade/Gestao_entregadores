from django.db import models

class RegistroEntregaDespesa(models.Model):
    TIPO_RENDIMENTO_CHOICES = [
        ('unitario', 'Valor Unitário por Pacote'),
        ('diaria', 'Valor por Diária'),
    ]

    CATEGORIA_DESPESA_CHOICES = [
        ('nenhuma', 'Nenhuma Despesa'),
        ('alimentacao', 'Alimentação'),
        ('automotivo', 'Gasto Automotivo'),
        ('pedagio', 'Pedágio'),
        ('seguro', 'Seguro Mensal'),
        ('outros', 'Outros'),
    ]

    tipo_rendimento = models.CharField(max_length=10, choices=TIPO_RENDIMENTO_CHOICES)

    valor_unitario = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )

    valor_diaria = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True
    )

    total_pacotes = models.PositiveIntegerField()
    pacotes_entregues = models.PositiveIntegerField()
    pacotes_nao_entregues = models.PositiveIntegerField()

    categoria_despesa = models.CharField(max_length=20, choices=CATEGORIA_DESPESA_CHOICES)
    valor_despesa = models.DecimalField(max_digits=7, decimal_places=2, default=0.0)
    descricao_outros = models.CharField(max_length=100, blank=True, null=True)

    data = models.DateField(auto_now_add=True)

    def calcular_ganho(self):
        if self.tipo_rendimento == 'unitario' and self.valor_unitario:
            return self.pacotes_entregues * self.valor_unitario
        elif self.tipo_rendimento == 'diaria' and self.valor_diaria:
            return self.valor_diaria
        return 0

    def calcular_lucro(self):
        return self.calcular_ganho() - self.valor_despesa

class RegistroTrabalho(models.Model):
    """Modelo para registro de dia de trabalho"""
    TIPO_PAGAMENTO_CHOICES = [
        ('unitario', 'Valor Unitário por Pacote'),
        ('diaria', 'Valor por Diária'),
        ('por_hora', 'Valor por Hora'),
        ('fixo', 'Valor Fixo'),
    ]

    data = models.DateField()
    hora_inicio = models.TimeField()
    hora_fim = models.TimeField()
    quantidade_entregues = models.PositiveIntegerField()
    quantidade_nao_entregues = models.PositiveIntegerField()
    tipo_pagamento = models.CharField(max_length=20, choices=TIPO_PAGAMENTO_CHOICES)
    valor = models.DecimalField(max_digits=8, decimal_places=2)
    entregador = models.ForeignKey('usuarios.Entregador', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data', '-hora_inicio']

    def __str__(self):
        return f"Trabalho {self.data} - {self.entregador.nome}"

    def calcular_horas_trabalhadas(self):
        """Calcula as horas trabalhadas em decimal"""
        from datetime import datetime, timedelta
        
        inicio = datetime.combine(datetime.today(), self.hora_inicio)
        fim = datetime.combine(datetime.today(), self.hora_fim)
        
        if fim < inicio:  # Trabalhou até o dia seguinte
            fim += timedelta(days=1)
        
        diferenca = fim - inicio
        return diferenca.total_seconds() / 3600  # Converte para horas

class CategoriaDespesa(models.Model):
    """Modelo para categorias personalizadas de despesas"""
    nome = models.CharField(max_length=50, unique=True)
    descricao = models.TextField(blank=True, null=True)
    entregador = models.ForeignKey('usuarios.Entregador', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)
    ativa = models.BooleanField(default=True)

    class Meta:
        ordering = ['nome']
        unique_together = ['nome', 'entregador']  # Nome único por entregador

    def __str__(self):
        return f"{self.nome} - {self.entregador.nome}"

class Despesa(models.Model):
    """Modelo para registro de despesas"""
    CATEGORIA_CHOICES = [
        ('alimentacao', 'Alimentação'),
        ('combustivel', 'Combustível'),
        ('manutencao', 'Manutenção do Veículo'),
        ('pedagio', 'Pedágio'),
        ('estacionamento', 'Estacionamento'),
        ('seguro', 'Seguro'),
        ('licenciamento', 'Licenciamento'),
        ('outros', 'Outros'),
    ]

    tipo_despesa = models.CharField(max_length=20, choices=CATEGORIA_CHOICES)
    categoria_personalizada = models.ForeignKey(
        CategoriaDespesa, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        help_text="Categoria personalizada criada pelo usuário"
    )
    descricao = models.TextField()
    valor = models.DecimalField(max_digits=8, decimal_places=2)
    data = models.DateField()
    entregador = models.ForeignKey('usuarios.Entregador', on_delete=models.CASCADE)
    data_criacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-data', '-data_criacao']

    def __str__(self):
        categoria = self.categoria_personalizada.nome if self.categoria_personalizada else self.get_tipo_despesa_display()
        return f"{categoria} - R$ {self.valor} - {self.data}"

    @property
    def categoria_display(self):
        """Retorna o nome da categoria para exibição"""
        if self.categoria_personalizada:
            return self.categoria_personalizada.nome
        return self.get_tipo_despesa_display()
