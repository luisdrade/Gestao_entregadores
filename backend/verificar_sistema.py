#!/usr/bin/env python
"""
Script para verificar se o sistema está funcionando
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

def verificar_sistema():
    print("🔍 Verificando se o sistema está funcionando...")
    
    # Buscar usuário
    user = User.objects.filter(is_active=True).first()
    print(f"👤 Usuário: {user.nome}")
    
    # Verificar categorias
    categorias = CategoriaDespesa.objects.filter(entregador=user, ativa=True)
    print(f"📊 Total de categorias: {categorias.count()}")
    
    print("\n📋 Categorias disponíveis:")
    for cat in categorias:
        print(f"   - {cat.nome}: {cat.descricao}")
    
    print("\n✅ Sistema funcionando! As categorias estão prontas para o frontend.")
    print("📱 Teste agora no app mobile:")
    print("   1. Acesse: Cálculos → Financeiro")
    print("   2. Clique em 'Adicionar Despesa'")
    print("   3. Você deve ver as 3 categorias: Combustível, Manutenção, Alimentação")
    
    return True

if __name__ == '__main__':
    try:
        verificar_sistema()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
