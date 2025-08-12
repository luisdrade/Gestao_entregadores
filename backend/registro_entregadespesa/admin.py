from django.contrib import admin
from .models import RegistroEntregaDespesa, RegistroTrabalho, Despesa

@admin.register(RegistroEntregaDespesa)
class RegistroEntregaDespesaAdmin(admin.ModelAdmin):
    list_display = ['data', 'tipo_rendimento', 'pacotes_entregues', 'pacotes_nao_entregues', 'valor_despesa']
    list_filter = ['data', 'tipo_rendimento', 'categoria_despesa']
    search_fields = ['data']
    date_hierarchy = 'data'

@admin.register(RegistroTrabalho)
class RegistroTrabalhoAdmin(admin.ModelAdmin):
    list_display = ['data', 'entregador', 'hora_inicio', 'hora_fim', 'quantidade_entregues', 'valor']
    list_filter = ['data', 'tipo_pagamento', 'entregador']
    search_fields = ['entregador__nome', 'data']
    date_hierarchy = 'data'
    readonly_fields = ['data_criacao']

@admin.register(Despesa)
class DespesaAdmin(admin.ModelAdmin):
    list_display = ['tipo_despesa', 'descricao', 'valor', 'data', 'entregador']
    list_filter = ['tipo_despesa', 'data', 'entregador']
    search_fields = ['descricao', 'entregador__nome']
    date_hierarchy = 'data'
    readonly_fields = ['data_criacao']
