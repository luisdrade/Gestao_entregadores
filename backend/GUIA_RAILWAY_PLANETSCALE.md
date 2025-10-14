# 🚀 Railway Gratuito + PlanetScale MySQL

## 📋 Passo a Passo Completo

### 1. **Ativar Plano Gratuito no Railway**
1. Acesse [railway.app](https://railway.app)
2. Vá em **Settings** > **Billing**
3. Selecione **Hobby Plan** (gratuito)
4. Confirme a seleção

### 2. **Criar MySQL no PlanetScale**
1. Acesse [planetscale.com](https://planetscale.com)
2. Faça login com GitHub
3. Clique em **"Create database"**
4. Configure:
   - **Name**: `gestao-entregadores`
   - **Region**: Escolha a mais próxima (ex: São Paulo)
   - **Plan**: Free
5. Clique em **"Create database"**

### 3. **Obter Credenciais do PlanetScale**
1. No banco criado, vá em **"Connect"**
2. Clique em **"Connect with"** > **"General"**
3. Anote as credenciais:
   - **Host**: `xxx.mysql.planetscale.com`
   - **Username**: `xxx`
   - **Password**: `xxx`
   - **Database**: `gestao_entregadores`

### 4. **Configurar Railway com PlanetScale**

#### 4.1 Fazer deploy
```bash
railway up
```

#### 4.2 Configurar variáveis de ambiente
```bash
# Django básico
railway variables set DJANGO_SECRET_KEY="sua-chave-secreta-aqui"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="seu-app.railway.app"

# MySQL PlanetScale
railway variables set DB_ENGINE="django.db.backends.mysql"
railway variables set DB_NAME="gestao_entregadores"
railway variables set DB_USER="seu-usuario-planetscale"
railway variables set DB_PASSWORD="sua-senha-planetscale"
railway variables set DB_HOST="seu-host.mysql.planetscale.com"
railway variables set DB_PORT="3306"

# Static Files
railway variables set STATIC_URL="/static/"
railway variables set STATIC_ROOT="/app/staticfiles"

# Media Files
railway variables set MEDIA_URL="/media/"
railway variables set MEDIA_ROOT="/app/media"
```

### 5. **Configurar Banco de Dados**
```bash
# Executar migrações
railway run python manage.py migrate

# Criar superusuário
railway run python manage.py createsuperuser

# Coletar arquivos estáticos
railway run python manage.py collectstatic --noinput
```

### 6. **Verificar Deploy**
```bash
# Abrir aplicação
railway open

# Ver logs
railway logs
```

## 🔧 **Configurações Importantes**

### **PlanetScale SSL**
O PlanetScale requer SSL. Adicione esta variável:
```bash
railway variables set DB_OPTIONS='{"ssl": {"ca": "-----BEGIN CERTIFICATE-----\nMIIEQTCCAqmgAwIBAgIUTtG6l4n1u1Y4rBmhJg==\n-----END CERTIFICATE-----"}}'
```

### **CORS para Frontend**
```bash
railway variables set CORS_ALLOWED_ORIGINS="https://seu-frontend.vercel.app,https://seu-frontend.netlify.app"
```

## ✅ **Vantagens desta Configuração**

1. **Railway Hobby**: Gratuito para sempre
2. **PlanetScale Free**: 5GB MySQL gratuito
3. **Performance**: Excelente
4. **Escalabilidade**: Fácil upgrade
5. **SSL**: Automático em ambos

## 🔗 **URLs Finais**

- **Backend**: `https://seu-app.railway.app`
- **Admin**: `https://seu-app.railway.app/admin/`
- **API**: `https://seu-app.railway.app/api/`

## 🚨 **Troubleshooting**

### **Erro de SSL no PlanetScale**
```bash
# Adicionar certificado SSL
railway variables set DB_OPTIONS='{"ssl": {"ca": "-----BEGIN CERTIFICATE-----\nMIIEQTCCAqmgAwIBAgIUTtG6l4n1u1Y4rBmhJg==\n-----END CERTIFICATE-----"}}'
```

### **Erro de conexão**
- Verifique as credenciais do PlanetScale
- Verifique se o banco está ativo
- Verifique as variáveis de ambiente

### **Erro de migração**
```bash
# Executar migrações novamente
railway run python manage.py migrate --run-syncdb
```

## 📞 **Suporte**

- **Railway**: [docs.railway.app](https://docs.railway.app)
- **PlanetScale**: [planetscale.com/docs](https://planetscale.com/docs)
- **Django**: [docs.djangoproject.com](https://docs.djangoproject.com)

