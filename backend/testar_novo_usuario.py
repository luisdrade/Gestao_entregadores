#!/usr/bin/env python
"""
Script para testar se as categorias são criadas automaticamente para novos usuários
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

def testar_novo_usuario():
    print("🧪 Testando criação automática de categorias para novo usuário...")
    
    # Verificar quantas categorias existem antes
    categorias_antes = CategoriaDespesa.objects.count()
    print(f"📊 Categorias existentes antes: {categorias_antes}")
    
    # Criar um usuário de teste
    print("\n👤 Criando usuário de teste...")
    try:
        novo_usuario = User.objects.create_user(
            email='teste_categorias@exemplo.com',
            nome='Usuário Teste Categorias',
            telefone='11999999999',
            password='123456'
        )
        print(f"✅ Usuário criado: {novo_usuario.nome}")
        
        # Verificar se as categorias foram criadas automaticamente
        categorias_depois = CategoriaDespesa.objects.count()
        print(f"📊 Categorias existentes depois: {categorias_depois}")
        
        # Verificar categorias do novo usuário
        categorias_usuario = CategoriaDespesa.objects.filter(entregador=novo_usuario)
        print(f"📂 Categorias do novo usuário: {categorias_usuario.count()}")
        
        print("\n📋 Categorias criadas automaticamente:")
        for cat in categorias_usuario:
            print(f"   - {cat.nome}: {cat.descricao}")
        
        # Limpar usuário de teste
        print(f"\n🧹 Removendo usuário de teste...")
        novo_usuario.delete()
        print("✅ Usuário de teste removido")
        
        if categorias_usuario.count() == 4:
            print("\n🎉 SUCESSO! As 4 categorias foram criadas automaticamente!")
            print("✅ Novos usuários terão as categorias automaticamente")
        else:
            print(f"\n❌ ERRO! Esperado 4 categorias, mas foram criadas {categorias_usuario.count()}")
            
    except Exception as e:
        print(f"❌ Erro ao criar usuário de teste: {e}")
        return False
    
    return True

if __name__ == '__main__':
    try:
        testar_novo_usuario()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
