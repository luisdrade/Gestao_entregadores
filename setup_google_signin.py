#!/usr/bin/env python3
"""
Script para configurar o Google Sign-In no projeto
"""

import os
import subprocess
import sys

def print_header():
    print("=" * 60)
    print("🔧 CONFIGURAÇÃO DO GOOGLE SIGN-IN")
    print("=" * 60)
    print()

def check_dependencies():
    print("📦 Verificando dependências...")
    
    # Verificar se o frontend tem as dependências
    frontend_deps = [
        "@react-native-google-signin/google-signin"
    ]
    
    try:
        with open("frontend/package.json", "r") as f:
            content = f.read()
            for dep in frontend_deps:
                if dep in content:
                    print(f"✅ {dep} - OK")
                else:
                    print(f"❌ {dep} - FALTANDO")
                    return False
    except FileNotFoundError:
        print("❌ package.json não encontrado")
        return False
    
    return True

def get_sha1_fingerprint():
    print("\n🔑 Obtendo SHA-1 fingerprint...")
    
    try:
        # Comando para obter SHA-1
        cmd = [
            "keytool", "-list", "-v", 
            "-keystore", os.path.expanduser("~/.android/debug.keystore"),
            "-alias", "androiddebugkey",
            "-storepass", "android",
            "-keypass", "android"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            # Extrair SHA1 da saída
            for line in result.stdout.split('\n'):
                if 'SHA1:' in line:
                    sha1 = line.split('SHA1:')[1].strip()
                    print(f"✅ SHA-1 encontrado: {sha1}")
                    return sha1
        else:
            print("❌ Erro ao obter SHA-1")
            print("Execute manualmente:")
            print("keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android")
            return None
            
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

def create_migration():
    print("\n🗄️ Criando migração para o campo google_id...")
    
    try:
        os.chdir("backend")
        
        # Criar migração
        result = subprocess.run(["python", "manage.py", "makemigrations"], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Migração criada com sucesso")
            
            # Aplicar migração
            result = subprocess.run(["python", "manage.py", "migrate"], 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ Migração aplicada com sucesso")
            else:
                print("❌ Erro ao aplicar migração")
                print(result.stderr)
        else:
            print("❌ Erro ao criar migração")
            print(result.stderr)
            
        os.chdir("..")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        os.chdir("..")

def generate_config_template():
    print("\n📝 Gerando template de configuração...")
    
    template = '''// Configuração do Google Sign-In
// 
// INSTRUÇÕES PARA CONFIGURAR:
// 
// 1. Acesse: https://console.cloud.google.com/
// 2. Crie um novo projeto ou selecione um existente
// 3. Ative a API "Google Sign-In API"
// 4. Vá em "Credenciais" e crie credenciais OAuth 2.0
// 5. Configure as URLs autorizadas:
//    - Para Android: adicione o SHA-1 do seu projeto
//    - Para iOS: adicione o Bundle ID
//    - Para Web: adicione o domínio do seu backend
//
// 6. Substitua os valores abaixo pelos seus IDs reais:

export const GOOGLE_CONFIG = {
  // Web Client ID (obrigatório para Android)
  WEB_CLIENT_ID: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  
  // iOS Client ID (opcional, apenas para iOS)
  IOS_CLIENT_ID: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  
  // Configurações adicionais
  OFFLINE_ACCESS: true,
  FORCE_CODE_FOR_REFRESH_TOKEN: true,
};
'''
    
    try:
        with open("frontend/src/config/googleConfig.js", "w") as f:
            f.write(template)
        print("✅ Template de configuração criado")
    except Exception as e:
        print(f"❌ Erro ao criar template: {e}")

def main():
    print_header()
    
    # Verificar dependências
    if not check_dependencies():
        print("\n❌ Algumas dependências estão faltando.")
        print("Execute: cd frontend && npm install")
        return
    
    # Obter SHA-1
    sha1 = get_sha1_fingerprint()
    
    # Criar migração
    create_migration()
    
    # Gerar template
    generate_config_template()
    
    print("\n" + "=" * 60)
    print("🎉 CONFIGURAÇÃO INICIAL CONCLUÍDA!")
    print("=" * 60)
    print()
    print("📋 PRÓXIMOS PASSOS:")
    print()
    print("1. Acesse: https://console.cloud.google.com/")
    print("2. Crie credenciais OAuth 2.0")
    print("3. Adicione o SHA-1 fingerprint:")
    if sha1:
        print(f"   {sha1}")
    print("4. Edite: frontend/src/config/googleConfig.js")
    print("5. Substitua os IDs pelos seus reais")
    print("6. Teste o login com Google")
    print()
    print("📖 Para mais detalhes, consulte: GOOGLE_SIGNIN_SETUP.md")

if __name__ == "__main__":
    main()


