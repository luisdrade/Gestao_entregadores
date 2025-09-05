#!/usr/bin/env python
"""
Teste específico para verificar se a API mobile está funcionando
"""
import os
import sys
import django
from django.test import Client
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

def test_mobile_api():
    """Testa se a API mobile está funcionando corretamente"""
    client = Client()
    
    print("🔍 Testando API mobile da comunidade...")
    
    # Teste 1: GET com headers de app mobile
    print("\n📱 Teste 1: GET com headers de app mobile")
    try:
        response = client.get('/comunidade/', HTTP_ACCEPT='application/json')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = json.loads(response.content)
                print("✅ Resposta JSON válida!")
                print(f"Postagens: {len(data.get('postagens', []))}")
                print(f"Anúncios: {len(data.get('anuncios', []))}")
            except json.JSONDecodeError:
                print("❌ Resposta não é JSON válido")
                print("Conteúdo:", response.content[:200])
        else:
            print(f"❌ Erro: Status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
    
    # Teste 2: POST com headers de app mobile
    print("\n📱 Teste 2: POST com headers de app mobile")
    try:
        post_data = {
            'autor': 'Teste Mobile API',
            'titulo': 'Teste de API Mobile',
            'conteudo': 'Esta é uma postagem de teste via API mobile.',
            'submit_postagem': 'true'
        }
        
        response = client.post('/comunidade/', post_data, HTTP_ACCEPT='application/json')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = json.loads(response.content)
                print("✅ Resposta JSON válida!")
                print(f"Success: {data.get('success')}")
                print(f"Message: {data.get('message')}")
                print(f"Postagem ID: {data.get('postagem_id')}")
            except json.JSONDecodeError:
                print("❌ Resposta não é JSON válido")
                print("Conteúdo:", response.content[:200])
        else:
            print(f"❌ Erro: Status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro: {e}")
    
    # Teste 3: POST com User-Agent de Expo
    print("\n📱 Teste 3: POST com User-Agent de Expo")
    try:
        post_data = {
            'autor': 'Teste Expo',
            'titulo': 'Teste com Expo User-Agent',
            'conteudo': 'Esta é uma postagem de teste com User-Agent do Expo.',
            'submit_postagem': 'true'
        }
        
        response = client.post('/comunidade/', post_data, 
                             HTTP_ACCEPT='application/json',
                             HTTP_USER_AGENT='Expo/1.0.0')
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = json.loads(response.content)
                print("✅ Resposta JSON válida!")
                print(f"Success: {data.get('success')}")
                print(f"Message: {data.get('message')}")
            except json.JSONDecodeError:
                print("❌ Resposta não é JSON válido")
                print("Conteúdo:", response.content[:200])
        else:
            print(f"❌ Erro: Status {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == '__main__':
    print("🚀 Iniciando testes da API mobile...")
    test_mobile_api()
    print("\n🎯 Testes concluídos!")
