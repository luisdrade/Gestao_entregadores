from pathlib import Path
from datetime import timedelta
import os

from dotenv import load_dotenv

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env in the backend root
load_dotenv(dotenv_path=BASE_DIR / '.env')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-insecure-placeholder')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True').lower() in ['1', 'true', 'yes', 'on']

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '*').split(',')


# Application definition

INSTALLED_APPS = [
    #apps do django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    #apps de terceiros
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'dj_rest_auth',
    
    #apps do projeto
    'corsheaders',
    'usuarios',
    'cadastro_veiculo',
    'comunidade',
    'registro_entregadespesa',
    'relatorios_dashboard',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'usuarios.middleware.middleware.CSRFExemptAPIMiddleware',  # Middleware personalizado para APIs
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'usuarios.middleware.email_validation_middleware.EmailValidationMiddleware',  # Middleware de validação de email
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Configurações de CORS
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOW_CREDENTIALS = True

# Configurações específicas do CORS
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.56.1:3000",
    "http://192.168.56.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://172.18.128.1:3000",
    "http://172.18.128.1:8000",
    "http://172.18.128.1:19006",
    "http://172.18.128.1:19000",
    # Expo/React Native
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://192.168.0.115:8081",
    "http://10.20.13.125:8081",
    # IP atual do servidor
    "http://10.250.108.238:8000",
    "http://10.250.108.238:3000",
    "http://10.250.108.238:8081",
    # Adicionar domínios de produção quando disponíveis
    # "https://seu-frontend.vercel.app",
    # "https://seu-frontend.netlify.app",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://192\.168\.\d+\.\d+:\d+$",
    r"^http://172\.18\.\d+\.\d+:\d+$",
    r"^http://10\.\d+\.\d+\.\d+:\d+$",
    r"^http://localhost:\d+$",
    r"^http://127\.0\.0\.1:\d+$",
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

ROOT_URLCONF = 'sistema.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'sistema.wsgi.application'



# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# Configuração para Render.com + PlanetScale MySQL
if os.getenv('DATABASE_URL'):
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.parse(os.getenv('DATABASE_URL'))
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.mysql'),
            'NAME': os.getenv('DB_NAME', 'gestao_entregadores'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
                'charset': 'utf8mb4',
                'ssl': {'ca': os.getenv('DB_SSL_CA')} if os.getenv('DB_SSL_CA') else {},
            },
        }
    }


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = os.getenv('STATIC_URL', 'static/')
# Tratar valores vazios no .env como ausentes
_env_static_root = os.getenv('STATIC_ROOT')
STATIC_ROOT = Path(_env_static_root) if _env_static_root else (BASE_DIR / 'staticfiles')

# Configurações para produção (Railway)
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# Media files (Uploads)
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
_env_media_root = os.getenv('MEDIA_ROOT')
MEDIA_ROOT = Path(_env_media_root) if _env_media_root else (BASE_DIR / 'media')

# Configurações adicionais para arquivos de mídia
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
FILE_UPLOAD_TEMP_DIR = None
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# Configurações de logging para debug
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / os.getenv('LOG_FILE', 'debug.log'),
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'usuarios.Entregador'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}

SITE_ID = 1

# Configuração de autenticação
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Configuração do JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Configuração do dj-rest-auth
REST_USE_JWT = True
JWT_AUTH_COOKIE = 'jwt-auth'

# Configurações de CSRF para APIs
CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]

# Desabilitar CSRF para APIs REST (usando JWT)
CSRF_COOKIE_SECURE = False  # Para desenvolvimento
CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'

# Configurações de Email
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@gestaoentregadores.com')

# SMTP (usado quando EMAIL_BACKEND = smtp)
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587')) if os.getenv('EMAIL_PORT') else 587
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() in ['1','true','yes','on'] if os.getenv('EMAIL_USE_TLS') else True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')

# Para desenvolvimento - usar console backend por padrão
if DEBUG and not EMAIL_HOST_USER:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    print("📧 Modo de desenvolvimento: emails serão exibidos no console")

# Para produção, use:
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'seu-email@gmail.com'
# EMAIL_HOST_PASSWORD = 'sua-senha'

# Configurações do dj-rest-auth para reset de senha
REST_AUTH = {
    'PASSWORD_RESET_USE_SITES_DOMAIN': True,
    'PASSWORD_RESET_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetSerializer',
    'PASSWORD_RESET_CONFIRM_SERIALIZER': 'dj_rest_auth.serializers.PasswordResetConfirmSerializer',
}