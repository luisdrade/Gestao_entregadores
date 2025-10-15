#!/usr/bin/env python
"""
Script para criar as 3 categorias para o usuário que está logado no app
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

def criar_categorias_usuario_atual():
    print("🚀 Criando as 3 categorias para o usuário atual...")
    
    # Listar todos os usuários
    usuarios = User.objects.filter(is_active=True)
    print(f"👥 Usuários ativos encontrados: {usuarios.count()}")
    
    for i, user in enumerate(usuarios):
        print(f"   {i+1}. {user.nome} (ID: {user.id})")
    
    # Criar categorias para TODOS os usuários ativos
    categorias_para_criar = [
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
    
    total_criadas = 0
    
    for user in usuarios:
        print(f"\n👤 Processando usuário: {user.nome}")
        
        # Limpar categorias antigas do usuário
        CategoriaDespesa.objects.filter(entregador=user).delete()
        print(f"   🧹 Categorias antigas removidas")
        
        # Criar as 3 categorias para o usuário
        for cat_data in categorias_para_criar:
            categoria = CategoriaDespesa.objects.create(
                nome=cat_data['nome'],
                descricao=cat_data['descricao'],
                entregador=user,
                ativa=True
            )
            total_criadas += 1
            print(f"   ✅ Categoria criada: {categoria.nome}")
    
    print(f"\n🎉 Processo concluído!")
    print(f"📊 Total de categorias criadas: {total_criadas}")
    
    # Verificar resultado final
    print(f"\n📋 Verificação final:")
    for user in usuarios:
        categorias_user = CategoriaDespesa.objects.filter(entregador=user, ativa=True)
        print(f"   👤 {user.nome}: {categorias_user.count()} categorias")
        for cat in categorias_user:
            print(f"      - {cat.nome}")
    
    return True

if __name__ == '__main__':
    try:
        criar_categorias_usuario_atual()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
