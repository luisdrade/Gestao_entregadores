from django.contrib import admin
from .models import Postagem, AnuncioVeiculo

@admin.register(Postagem)
class PostagemAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'autor', 'status', 'is_visivel', 'data_criacao', 'moderado_por']
    list_filter = ['status', 'is_visivel', 'data_criacao', 'moderado_por']
    search_fields = ['titulo', 'autor', 'conteudo']
    readonly_fields = ['data_criacao', 'data_moderacao']
    date_hierarchy = 'data_criacao'
    
    fieldsets = (
        ('Conteúdo', {
            'fields': ('autor', 'titulo', 'conteudo')
        }),
        ('Moderação', {
            'fields': ('status', 'is_visivel', 'moderado_por', 'data_moderacao', 'motivo_moderacao')
        }),
        ('Sistema', {
            'fields': ('data_criacao',),
            'classes': ('collapse',)
        }),
    )

@admin.register(AnuncioVeiculo)
class AnuncioVeiculoAdmin(admin.ModelAdmin):
    list_display = ['modelo', 'ano', 'preco', 'status', 'is_visivel', 'data_publicacao', 'moderado_por']
    list_filter = ['status', 'is_visivel', 'ano', 'data_publicacao', 'moderado_por']
    search_fields = ['modelo', 'localizacao']
    readonly_fields = ['data_publicacao', 'data_moderacao']
    date_hierarchy = 'data_publicacao'
    
    fieldsets = (
        ('Informações do Veículo', {
            'fields': ('modelo', 'ano', 'quilometragem', 'preco', 'localizacao', 'link_externo', 'foto')
        }),
        ('Moderação', {
            'fields': ('status', 'is_visivel', 'moderado_por', 'data_moderacao', 'motivo_moderacao')
        }),
        ('Sistema', {
            'fields': ('data_publicacao',),
            'classes': ('collapse',)
        }),
    )
