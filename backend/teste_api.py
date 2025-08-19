#!/usr/bin/env python
"""
Script para testar a API diretamente
"""
import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_api():
    """Testa a API diretamente"""
    try:
        print("=== Teste da API ===\n")
        
        # Dados de teste
        dados_trabalho = {
            "data": "2025-08-19",
            "hora_inicio": "08:00",
            "hora_fim": "17:00",
            "quantidade_entregues": 10,
            "quantidade_nao_entregues": 0,
            "tipo_pagamento": "diaria",
            "valor": "100.00"
        }
        
        dados_despesa = {
            "tipo_despesa": "combustivel",
            "descricao": "Abastecimento do veículo",
            "valor": "50.00",
            "data": "2025-08-19"
        }
        
        base_url = "http://192.168.56.1:8000"
        
        # Teste 1: GET para ver informações
        print("1. Testando GET /registro/api/registro-trabalho/")
        try:
            response = requests.get(f"{base_url}/registro/api/registro-trabalho/")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Resposta: {data.get('message', 'N/A')}")
        except Exception as e:
            print(f"   Erro: {e}")
        
        # Teste 2: POST para registrar trabalho
        print("\n2. Testando POST /registro/api/registro-trabalho/")
        try:
            response = requests.post(
                f"{base_url}/registro/api/registro-trabalho/",
                json=dados_trabalho,
                headers={'Content-Type': 'application/json'}
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Sucesso: {data.get('message', 'N/A')}")
                if 'id' in data:
                    print(f"   ID criado: {data['id']}")
            else:
                print(f"   Erro: {response.text}")
        except Exception as e:
            print(f"   Erro: {e}")
        
        # Teste 3: POST para registrar despesa
        print("\n3. Testando POST /registro/api/registro-despesa/")
        try:
            response = requests.post(
                f"{base_url}/registro/api/registro-despesa/",
                json=dados_despesa,
                headers={'Content-Type': 'application/json'}
            )
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Sucesso: {data.get('message', 'N/A')}")
                if 'id' in data:
                    print(f"   ID criado: {data['id']}")
            else:
                print(f"   Erro: {response.text}")
        except Exception as e:
            print(f"   Erro: {e}")
        
        print("\n=== Fim dos testes ===")
        
    except Exception as e:
        print(f"✗ Erro geral: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_api()
