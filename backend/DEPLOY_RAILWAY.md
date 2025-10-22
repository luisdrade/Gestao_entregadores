# 🚂 Deploy no Railway + PlanetScale

## 📋 Pré-requisitos
- [ ] Conta no GitHub
- [ ] Conta no Railway.app
- [ ] Conta no PlanetScale.com

## 🔧 Passo a Passo

### 1. Configurar PlanetScale (Banco MySQL)
1. Acesse: https://planetscale.com
2. Crie conta gratuita
3. Crie novo banco:
   - **Name**: `gestao-entregadores`
   - **Region**: `us-east-1` (mais próximo)
4. Anote as credenciais:
   - Host
   - Username
   - Password
   - Database name

### 2. Deploy no Railway
1. Acesse: https://railway.app
2. Conecte com GitHub
3. Selecione seu repositório
4. Railway detectará automaticamente o Django

### 3. Configurar Variáveis de Ambiente
No Railway, vá em "Variables" e adicione:

```env
DJANGO_SECRET_KEY=seu-secret-key-aqui
DEBUG=False
ALLOWED_HOSTS=gestao-entregadores-production.railway.app,localhost,127.0.0.1
DB_ENGINE=django.db.backends.mysql
DB_NAME=gestao_entregadores
DB_USER=seu-usuario-planetscale
DB_PASSWORD=sua-senha-planetscale
DB_HOST=seu-host.mysql.planetscale.com
DB_PORT=3306
DB_SSL_CA=-----BEGIN CERTIFICATE-----\nMIIEQTCCAqmgAwIBAgIUTtG6l4n1u1Y4rBmhJg==\n-----END CERTIFICATE-----
STATIC_URL=/static/
STATIC_ROOT=/app/staticfiles
MEDIA_URL=/media/
MEDIA_ROOT=/app/media
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

### 4. Executar Migrações
No Railway, vá em "Deployments" > "View Logs" e execute:
```bash
python manage.py migrate
python manage.py collectstatic --noinput
```

## 🔗 URLs Finais
- **Backend**: `https://gestao-entregadores-production.railway.app`
- **Admin**: `https://gestao-entregadores-production.railway.app/admin/`

## ⚠️ Limitações
- **Railway**: 500 horas/mês (plano gratuito)
- **PlanetScale**: 5GB de armazenamento
- **Sleep**: Serviço "dorme" após inatividade

## 🔄 Vantagens
- ✅ Deploy automático
- ✅ SSL automático
- ✅ Logs em tempo real
- ✅ Banco MySQL robusto
