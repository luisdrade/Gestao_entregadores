#!/usr/bin/env python
"""
Script para verificar TODAS as categorias no sistema
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

def verificar_todas_categorias():
    print("🔍 Verificando TODAS as categorias no sistema...")
    
    # Buscar todas as categorias de todos os usuários
    categorias = CategoriaDespesa.objects.all()
    print(f"📊 Total de categorias no sistema: {categorias.count()}")
    
    print("\n📋 Todas as categorias:")
    for cat in categorias:
        print(f"   - ID: {cat.id} | Nome: '{cat.nome}' | Usuário: {cat.entregador.nome} | Ativa: {cat.ativa}")
    
    # Verificar se há categorias com nomes estranhos
    print("\n🔍 Procurando categorias com nomes estranhos...")
    for cat in categorias:
        if 'amarula' in cat.nome.lower() or 'combustive' in cat.nome.lower():
            print(f"⚠️  Categoria estranha: '{cat.nome}' - Usuário: {cat.entregador.nome}")
    
    # Limpar categorias estranhas
    print("\n🧹 Limpando categorias estranhas...")
    categorias_estranhas = CategoriaDespesa.objects.filter(
        nome__icontains='amarula'
    )
    if categorias_estranhas.exists():
        print(f"❌ Removendo {categorias_estranhas.count()} categorias estranhas...")
        categorias_estranhas.delete()
        print("✅ Categorias estranhas removidas!")
    else:
        print("✅ Nenhuma categoria estranha encontrada")
    
    return True

if __name__ == '__main__':
    try:
        verificar_todas_categorias()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
