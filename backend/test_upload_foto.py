#!/usr/bin/env python
"""
Script de teste para verificar o upload de fotos
"""
import os
import sys
import django
import base64
import requests
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sistema.settings')
django.setup()

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from usuarios.models import Entregador

def test_upload_foto():
    """Testa o upload de uma foto de exemplo"""
    try:
        # Criar uma imagem base64 de teste (1x1 pixel transparente)
        base64_image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        # Encontrar um usuário para teste
        user = Entregador.objects.first()
        if not user:
            print("❌ Nenhum usuário encontrado para teste")
            return
        
        print(f"📸 Testando upload para usuário: {user.email}")
        
        # Decodificar base64
        foto_bytes = base64.b64decode(base64_image)
        print(f"📸 Bytes decodificados: {len(foto_bytes)} bytes")
        
        # Gerar nome do arquivo
        import uuid
        filename = f"teste_perfil_{user.id}_{uuid.uuid4().hex[:8]}.png"
        print(f"📸 Nome do arquivo: {filename}")
        
        # Salvar arquivo
        if user.foto:
            # Remover foto antiga
            try:
                if default_storage.exists(user.foto.name):
                    default_storage.delete(user.foto.name)
                    print(f"📸 Foto antiga removida: {user.foto.name}")
            except Exception as e:
                print(f"⚠️ Erro ao remover foto antiga: {str(e)}")
        
        # Salvar nova foto
        user.foto.save(filename, ContentFile(foto_bytes), save=True)
        print(f"📸 Nova foto salva: {user.foto.name}")
        print(f"📸 URL da foto: {user.foto.url}")
        
        # Verificar se o arquivo existe
        if default_storage.exists(user.foto.name):
            print("✅ Arquivo salvo com sucesso!")
            print(f"📁 Caminho completo: {user.foto.path}")
            print(f"🌐 URL acessível: {user.foto.url}")
        else:
            print("❌ Arquivo não encontrado no storage")
            
    except Exception as e:
        print(f"❌ Erro no teste: {str(e)}")

def test_media_directory():
    """Testa se o diretório de mídia está configurado corretamente"""
    try:
        from django.conf import settings
        
        print(f"📁 MEDIA_ROOT: {settings.MEDIA_ROOT}")
        print(f"🌐 MEDIA_URL: {settings.MEDIA_URL}")
        
        # Verificar se o diretório existe
        if settings.MEDIA_ROOT.exists():
            print("✅ Diretório MEDIA_ROOT existe")
            
            # Listar arquivos no diretório
            files = list(settings.MEDIA_ROOT.rglob('*'))
            print(f"📄 Arquivos encontrados: {len(files)}")
            
            for file in files[:5]:  # Mostrar apenas os primeiros 5
                if file.is_file():
                    print(f"  📄 {file.relative_to(settings.MEDIA_ROOT)}")
        else:
            print("❌ Diretório MEDIA_ROOT não existe")
            # Criar diretório
            settings.MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
            print("✅ Diretório MEDIA_ROOT criado")
            
    except Exception as e:
        print(f"❌ Erro ao verificar diretório de mídia: {str(e)}")

if __name__ == "__main__":
    print("🧪 Iniciando testes de upload de foto...")
    print("=" * 50)
    
    test_media_directory()
    print("-" * 30)
    test_upload_foto()
    
    print("=" * 50)
    print("✅ Testes concluídos!")
