#!/usr/bin/env python
"""
Script para criar 4 categorias fixas para todos os usuários
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

def criar_categorias_fixas():
    print("🚀 Criando 4 categorias fixas para todos os usuários...")
    
    # Limpar todas as categorias existentes
    print("🧹 Limpando todas as categorias existentes...")
    CategoriaDespesa.objects.all().delete()
    
    # Buscar todos os usuários ativos
    usuarios = User.objects.filter(is_active=True)
    print(f"👥 Usuários encontrados: {usuarios.count()}")
    
    # 4 categorias fixas
    categorias_fixas = [
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
        },
        {
            'nome': 'Outros',
            'descricao': 'Outras despesas não categorizadas'
        }
    ]
    
    total_criadas = 0
    
    # Criar as 4 categorias para cada usuário
    for user in usuarios:
        print(f"👤 Processando usuário: {user.nome}")
        
        for cat_data in categorias_fixas:
            try:
                categoria = CategoriaDespesa.objects.create(
                    nome=cat_data['nome'],
                    descricao=cat_data['descricao'],
                    entregador=user,
                    ativa=True
                )
                total_criadas += 1
                print(f"   ✅ {categoria.nome}")
            except Exception as e:
                print(f"   ❌ Erro ao criar {cat_data['nome']}: {e}")
    
    print(f"\n🎉 Processo concluído!")
    print(f"📊 Total de categorias criadas: {total_criadas}")
    
    # Verificar resultado
    print(f"\n📋 Verificação final:")
    for user in usuarios[:3]:  # Mostrar apenas os primeiros 3
        categorias_user = CategoriaDespesa.objects.filter(entregador=user, ativa=True)
        print(f"   👤 {user.nome}: {categorias_user.count()} categorias")
        for cat in categorias_user:
            print(f"      - {cat.nome}")
    
    print(f"\n✅ Sistema simplificado criado!")
    print(f"📱 Agora todos os usuários terão as 4 categorias fixas:")
    print(f"   1. Combustível")
    print(f"   2. Manutenção") 
    print(f"   3. Alimentação")
    print(f"   4. Outros")
    
    return True

if __name__ == '__main__':
    try:
        criar_categorias_fixas()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
