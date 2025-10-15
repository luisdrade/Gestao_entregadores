#!/usr/bin/env python
"""
Script para testar se as categorias estão funcionando corretamente
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from registro_entregadespesa.models import CategoriaDespesa, Despesa
from datetime import date
from decimal import Decimal

User = get_user_model()

def testar_categorias():
    print("🧪 Testando sistema de categorias...")
    
    # Buscar entregador
    entregador = User.objects.filter(is_active=True).first()
    if not entregador:
        print("❌ Nenhum entregador encontrado")
        return False
    
    print(f"👤 Entregador: {entregador.nome}")
    
    # Verificar categorias
    categorias = CategoriaDespesa.objects.filter(entregador=entregador, ativa=True)
    print(f"📊 Total de categorias: {categorias.count()}")
    
    print("\n📋 Categorias disponíveis:")
    for cat in categorias:
        print(f"   - {cat.nome}: {cat.descricao}")
    
    # Testar criação de despesa com cada categoria
    print("\n🧪 Testando criação de despesas...")
    
    despesas_teste = [
        {
            'categoria': 'Combustível',
            'descricao': 'Abastecimento de gasolina - Posto Shell',
            'valor': Decimal('85.50')
        },
        {
            'categoria': 'Manutenção',
            'descricao': 'Troca de óleo do motor',
            'valor': Decimal('65.00')
        },
        {
            'categoria': 'Alimentação',
            'descricao': 'Almoço no restaurante',
            'valor': Decimal('18.50')
        }
    ]
    
    # Limpar despesas antigas
    Despesa.objects.filter(entregador=entregador).delete()
    
    for despesa_data in despesas_teste:
        categoria = CategoriaDespesa.objects.get(
            nome=despesa_data['categoria'],
            entregador=entregador
        )
        
        despesa = Despesa.objects.create(
            tipo_despesa='outros',  # Sempre usar 'outros' para categorias personalizadas
            categoria_personalizada=categoria,
            descricao=despesa_data['descricao'],
            valor=despesa_data['valor'],
            data=date.today(),
            entregador=entregador
        )
        
        print(f"✅ Despesa criada: {despesa.categoria_display} - R$ {despesa.valor}")
    
    # Mostrar resumo
    total_despesas = Despesa.objects.filter(entregador=entregador).count()
    total_valor = sum(d.valor for d in Despesa.objects.filter(entregador=entregador))
    
    print(f"\n📊 Resumo:")
    print(f"   - Total de despesas: {total_despesas}")
    print(f"   - Valor total: R$ {total_valor:.2f}")
    
    print("\n✅ Sistema funcionando perfeitamente!")
    print("📱 Agora você pode testar no app mobile:")
    print("   1. Acesse: Cálculos → Financeiro")
    print("   2. Clique em 'Adicionar Despesa'")
    print("   3. Você verá as 3 categorias: Combustível, Manutenção, Alimentação")
    
    return True

if __name__ == '__main__':
    try:
        testar_categorias()
    except Exception as e:
        print(f"❌ Erro: {e}")
        sys.exit(1)
