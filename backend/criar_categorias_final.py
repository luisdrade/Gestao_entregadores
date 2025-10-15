#!/usr/bin/env python
"""
Script para criar as 3 categorias finais, ignorando constraints
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from registro_entregadespesa.models import CategoriaDespesa
from django.db import connection

User = get_user_model()

def criar_categorias_final():
    print("🚀 Criando as 3 categorias finais...")
    
    # Limpar todas as categorias existentes
    print("🧹 Limpando todas as categorias existentes...")
    CategoriaDespesa.objects.all().delete()
    
    # Buscar o primeiro usuário ativo
    user = User.objects.filter(is_active=True).first()
    if not user:
        print("❌ Nenhum usuário encontrado")
        return False
    
    print(f"👤 Criando categorias para: {user.nome}")
    
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
        try:
            categoria = CategoriaDespesa.objects.create(
                nome=cat_data['nome'],
                descricao=cat_data['descricao'],
                entregador=user,
                ativa=True
            )
            print(f"✅ Categoria criada: {categoria.nome}")
        except Exception as e:
            print(f"❌ Erro ao criar {cat_data['nome']}: {e}")
    
    # Verificar resultado
    categorias_criadas = CategoriaDespesa.objects.filter(entregador=user)
    print(f"\n📊 Total de categorias criadas: {categorias_criadas.count()}")
    
    print("\n📋 Categorias disponíveis:")
    for cat in categorias_criadas:
        print(f"   - {cat.nome}: {cat.descricao}")
    
    print("\n✅ Processo concluído!")
    print("📱 Agora teste no app mobile:")
    print("   1. Acesse: Cálculos → Financeiro")
    print("   2. Clique em 'Adicionar Despesa'")
    print("   3. Você deve ver as 3 categorias: Combustível, Manutenção, Alimentação")
    
    return True

if __name__ == '__main__':
    try:
        criar_categorias_final()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
