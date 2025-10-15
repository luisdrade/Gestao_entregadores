#!/usr/bin/env python
"""
Script para verificar as categorias no banco
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

def verificar_categorias():
    print("🔍 Verificando categorias no banco...")
    
    # Buscar entregador
    entregador = User.objects.filter(is_active=True).first()
    print(f"👤 Entregador: {entregador.nome}")
    
    # Listar todas as categorias
    categorias = CategoriaDespesa.objects.filter(entregador=entregador)
    print(f"📊 Total de categorias: {categorias.count()}")
    
    print("\n📋 Categorias no banco:")
    for cat in categorias:
        print(f"   - ID: {cat.id} | Nome: '{cat.nome}' | Ativa: {cat.ativa}")
    
    # Verificar se há categorias duplicadas ou com nomes estranhos
    print("\n🔍 Verificando problemas...")
    for cat in categorias:
        if 'amarula' in cat.nome.lower():
            print(f"⚠️  Categoria estranha encontrada: '{cat.nome}' - ID: {cat.id}")
    
    # Verificar se as 3 categorias corretas existem
    nomes_corretos = ['Combustível', 'Manutenção', 'Alimentação']
    print(f"\n✅ Verificando se as 3 categorias corretas existem:")
    for nome in nomes_corretos:
        existe = CategoriaDespesa.objects.filter(entregador=entregador, nome=nome).exists()
        print(f"   - {nome}: {'✅ Existe' if existe else '❌ Não existe'}")
    
    return True

if __name__ == '__main__':
    try:
        verificar_categorias()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
