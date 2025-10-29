from django.apps import AppConfig
import os


class UsuariosConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'usuarios'
    
    def ready(self):
        import usuarios.signals
        
        # Executar criação automática do superusuário apenas em produção
        # ou quando a variável de ambiente AUTO_CREATE_SUPERUSER estiver definida
        if not os.getenv('DEBUG', 'True').lower() in ['1', 'true', 'yes', 'on'] or os.getenv('AUTO_CREATE_SUPERUSER'):
            self.create_superuser_if_needed()
    
    def create_superuser_if_needed(self):
        """Cria um superusuário automaticamente se não existir"""
        try:
            from django.contrib.auth import get_user_model
            from django.core.management import call_command
            from django.db import connection
            
            # Verificar se o banco está pronto
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            
            User = get_user_model()
            
            # Verificar se já existe um superusuário
            if not User.objects.filter(is_superuser=True).exists():
                print("🔧 Criando superusuário automaticamente...")
                call_command('create_admin')
            else:
                print("✅ Superusuário já existe, pulando criação automática")
                
        except Exception as e:
            print(f"⚠️ Erro ao criar superusuário automaticamente: {e}")
            # Não falhar a inicialização do servidor por causa disso