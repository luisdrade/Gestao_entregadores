from django.contrib import admin
from .models import Veiculo

@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    list_display = ['modelo', 'tipo', 'categoria', 'entregador', 'km_por_l', 'data_cadastro']
    list_filter = ['tipo', 'categoria', 'data_cadastro']
    search_fields = ['modelo', 'placa', 'entregador__nome', 'entregador__email']
    readonly_fields = ['data_cadastro']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('entregador', 'tipo', 'modelo', 'placa')
        }),
        ('Especificações', {
            'fields': ('categoria', 'km_por_l')
        }),
        ('Sistema', {
            'fields': ('data_cadastro',),
            'classes': ('collapse',)
        }),
    )
