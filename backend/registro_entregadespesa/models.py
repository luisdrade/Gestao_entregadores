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
