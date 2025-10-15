#!/usr/bin/env python
"""
Script de teste para verificar o sistema de despesas
Execute: python test_despesas.py
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.contrib.auth import get_user_model
from registro_entregadespesa.models import Despesa, CategoriaDespesa
from decimal import Decimal

User = get_user_model()

def test_despesas():
    print("🧪 Testando sistema de despesas...")
    
    # Verificar se existem entregadores
    entregadores = User.objects.filter(is_active=True)
    print(f"📊 Entregadores encontrados: {entregadores.count()}")
    
    if not entregadores.exists():
        print("❌ Nenhum entregador encontrado. Crie usuários primeiro.")
        return False
    
    # Verificar despesas
    total_despesas = Despesa.objects.count()
    print(f"💰 Total de despesas: {total_despesas}")
    
    # Verificar categorias personalizadas
    total_categorias = CategoriaDespesa.objects.count()
    print(f"📂 Total de categorias personalizadas: {total_categorias}")
    
    # Verificar despesas por entregador
    for entregador in entregadores[:3]:  # Mostrar apenas os primeiros 3
        despesas_entregador = Despesa.objects.filter(entregador=entregador).count()
        categorias_entregador = CategoriaDespesa.objects.filter(entregador=entregador).count()
        print(f"   👤 {entregador.nome}: {despesas_entregador} despesas, {categorias_entregador} categorias")
    
    # Verificar categorias padrão
    categorias_padrao = [choice[0] for choice in Despesa.CATEGORIA_CHOICES]
    print(f"📋 Categorias padrão disponíveis: {len(categorias_padrao)}")
    for cat in categorias_padrao:
        print(f"   - {cat}")
    
    # Verificar algumas despesas específicas
    print("\n🔍 Exemplos de despesas:")
    for despesa in Despesa.objects.all()[:5]:
        categoria = despesa.categoria_personalizada.nome if despesa.categoria_personalizada else despesa.get_tipo_despesa_display()
        print(f"   - {categoria}: {despesa.descricao} - R$ {despesa.valor} ({despesa.data})")
    
    # Calcular totais
    total_valor = sum(despesa.valor for despesa in Despesa.objects.all())
    print(f"\n💵 Valor total das despesas: R$ {total_valor:.2f}")
    
    # Verificar distribuição por categoria
    print("\n📊 Distribuição por categoria:")
    for choice in Despesa.CATEGORIA_CHOICES:
        count = Despesa.objects.filter(tipo_despesa=choice[0]).count()
        if count > 0:
            print(f"   - {choice[1]}: {count} despesas")
    
    print("\n✅ Teste concluído com sucesso!")
    return True

if __name__ == '__main__':
    try:
        test_despesas()
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        sys.exit(1)
