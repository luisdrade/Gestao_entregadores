#!/usr/bin/env python
"""
Script para criar as 3 categorias: Combustível, Manutenção e Alimentação
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from registro_entregadespesa.models import CategoriaDespesa

User = get_user_model()

def criar_categorias():
    print("🚀 Criando as 3 categorias de despesas...")
    
    # Buscar o primeiro entregador ativo
    entregador = User.objects.filter(is_active=True).first()
    
    if not entregador:
        print("❌ Nenhum entregador encontrado. Crie usuários primeiro.")
        return False
    
    print(f"👤 Criando categorias para: {entregador.nome}")
    
    # Limpar categorias existentes
    CategoriaDespesa.objects.filter(entregador=entregador).delete()
    print("🧹 Categorias antigas removidas")
    
    # Criar as 3 categorias
    categorias = [
        {
            'nome': 'Combustível',
            'descricao': 'Gastos com combustível (gasolina, etanol, diesel)'
        },
        {
            'nome': 'Manutenção',
            'descricao': 'Manutenção e reparos do veículo'
        },
        {
            'nome': 'Alimentação',
            'descricao': 'Refeições e lanches durante o trabalho'
        }
    ]
    
    for cat_data in categorias:
        categoria = CategoriaDespesa.objects.create(
            nome=cat_data['nome'],
            descricao=cat_data['descricao'],
            entregador=entregador,
            ativa=True
        )
        print(f"✅ Categoria criada: {categoria.nome}")
    
    print(f"\n🎉 Processo concluído!")
    print(f"📊 Total de categorias: {CategoriaDespesa.objects.filter(entregador=entregador).count()}")
    
    # Mostrar todas as categorias
    print(f"\n📋 Categorias disponíveis:")
    for categoria in CategoriaDespesa.objects.filter(entregador=entregador):
        print(f"   - {categoria.nome}: {categoria.descricao}")
    
    return True

if __name__ == '__main__':
    try:
        criar_categorias()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
