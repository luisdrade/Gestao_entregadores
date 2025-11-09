from pathlib import Path
from datetime import timedelta
import os
import logging

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / '.env')

logger = logging.getLogger(__name__)

# ============================================================================
# SEGURANÇA E CONFIGURAÇÕES BÁSICAS
# ============================================================================

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'dev-insecure-placeholder')
DEBUG = os.getenv('DEBUG', 'True').lower() in ['1', 'true', 'yes', 'on']
ALLOWED_HOSTS = ['*']

# ============================================================================
# APLICAÇÕES E MIDDLEWARE
# ============================================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'dj_rest_auth',
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
    'usuarios.middleware.middleware.CSRFExemptAPIMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'usuarios.middleware.email_validation_middleware.EmailValidationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ============================================================================
# CORS - Cross-Origin Resource Sharing
# ============================================================================

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "https://entregasplus.onrender.com",
]

CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^http://192\.168\.\d+\.\d+:\d+$",
    r"^http://172\.18\.\d+\.\d+:\d+$",
    r"^http://10\.\d+\.\d+\.\d+:\d+$",
    r"^http://localhost:\d+$",
    r"^http://127\.0\.0\.1:\d+$",
]

CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']

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
    'x-app-source',
]

# ============================================================================
# CONFIGURAÇÕES DO DJANGO
# ============================================================================

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

# ============================================================================
# BANCO DE DADOS
# ============================================================================

if os.getenv('USE_LOCAL_DB', '').lower() == 'true':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
elif os.getenv('DATABASE_URL'):
    import dj_database_url
    DATABASES = {'default': dj_database_url.parse(os.getenv('DATABASE_URL'))}
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

# ============================================================================
# AUTENTICAÇÃO E SENHAS
# ============================================================================

AUTH_USER_MODEL = 'usuarios.Entregador'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# ============================================================================
# INTERNACIONALIZAÇÃO
# ============================================================================

LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ============================================================================
# ARQUIVOS ESTÁTICOS E MÍDIA
# ============================================================================

STATIC_URL = os.getenv('STATIC_URL', 'static/')
STATIC_ROOT = Path(os.getenv('STATIC_ROOT')) if os.getenv('STATIC_ROOT') else (BASE_DIR / 'staticfiles')

MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
MEDIA_ROOT = Path(os.getenv('MEDIA_ROOT')) if os.getenv('MEDIA_ROOT') else (BASE_DIR / 'media')

FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# Configuração do WhiteNoise para arquivos estáticos em produção
if not DEBUG:
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

# ============================================================================
# DJANGO REST FRAMEWORK
# ============================================================================

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

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

REST_USE_JWT = True
JWT_AUTH_COOKIE = 'jwt-auth'

# ============================================================================
# EMAIL
# ============================================================================

EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "sendgrid_backend.SendgridBackend")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
SENDGRID_SANDBOX_MODE_IN_DEBUG = os.getenv("SENDGRID_SANDBOX_MODE_IN_DEBUG", "False").lower() in ['1', 'true', 'yes', 'on']
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@entregasplus.com")

if DEBUG and not SENDGRID_API_KEY:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    logger.info("Modo desenvolvimento: e-mails aparecem no console.")
else:
    logger.info("SendGrid configurado corretamente.")

# ============================================================================
# SEGURANÇA E CSRF
# ============================================================================

CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "https://entregasplus.onrender.com",
]

if not DEBUG:
    CSRF_COOKIE_SECURE = True
    CSRF_COOKIE_HTTPONLY = True
    CSRF_COOKIE_SAMESITE = 'Strict'
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_SSL_REDIRECT = False  # Render já tem SSL
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Strict'
else:
    CSRF_COOKIE_SECURE = False
    CSRF_COOKIE_HTTPONLY = False
    CSRF_COOKIE_SAMESITE = 'Lax'

# ============================================================================
# LOGGING
# ============================================================================

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
        'handlers': ['console', 'file'] if DEBUG else ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'] if DEBUG else ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ============================================================================
# OUTRAS CONFIGURAÇÕES
# ============================================================================

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
SITE_ID = 1
