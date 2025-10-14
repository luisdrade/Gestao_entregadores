# 🚀 Deploy Render.com + PlanetScale MySQL (100% Gratuito)

## 🎯 Por que esta combinação?
- ✅ **Render.com**: Gratuito para sempre
- ✅ **PlanetScale**: MySQL gratuito (5GB)
- ✅ **Performance**: Excelente
- ✅ **Escalabilidade**: Fácil upgrade
- ✅ **SSL**: Automático

## 📋 Passo a Passo Completo

### 1. **Preparar o Código**

#### 1.1 Fazer commit das mudanças
```bash
git add .
git commit -m "Configurações para Render.com + PlanetScale"
git push origin main
```

#### 1.2 Verificar estrutura
```
backend/
├── manage.py
├── requirements.txt
├── Procfile
├── sistema/
│   └── settings.py
└── ...
```

### 2. **Criar MySQL no PlanetScale**

#### 2.1 Acessar PlanetScale
1. Vá para [planetscale.com](https://planetscale.com)
2. Faça login com GitHub
3. Clique em **"Create database"**

#### 2.2 Configurar banco
- **Name**: `gestao-entregadores`
- **Region**: Escolha a mais próxima (ex: São Paulo)
- **Plan**: Free
- Clique em **"Create database"**

#### 2.3 Obter credenciais
1. No banco criado, vá em **"Connect"**
2. Clique em **"Connect with"** > **"General"**
3. Anote as credenciais:
   - **Host**: `xxx.mysql.planetscale.com`
   - **Username**: `xxx`
   - **Password**: `xxx`
   - **Database**: `gestao_entregadores`

### 3. **Deploy no Render.com**

#### 3.1 Criar conta
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub
3. Conecte seu repositório

#### 3.2 Criar Web Service
1. Clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `gestao-entregadores`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn sistema.wsgi:application`

#### 3.3 Configurar variáveis de ambiente
No Render.com, vá em **Environment** e adicione:

```bash
# Django
DJANGO_SECRET_KEY=sua-chave-secreta-aqui
DEBUG=False
ALLOWED_HOSTS=seu-app.onrender.com

# PlanetScale MySQL
DB_ENGINE=django.db.backends.mysql
DB_NAME=gestao_entregadores
DB_USER=seu-usuario-planetscale
DB_PASSWORD=sua-senha-planetscale
DB_HOST=seu-host.mysql.planetscale.com
DB_PORT=3306
DB_SSL_CA=-----BEGIN CERTIFICATE-----\nMIIEQTCCAqmgAwIBAgIUTtG6l4n1u1Y4rBmhJg==\n-----END CERTIFICATE-----

# Static Files
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media

# CORS (para frontend)
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.netlify.app
```

### 4. **Deploy Automático**
- O Render fará deploy automaticamente
- Acesse os logs para ver o progresso
- Aguarde alguns minutos para o build

### 5. **Configurar Banco de Dados**

#### 5.1 Via Render Shell
1. No dashboard do Render, vá em **Shell**
2. Execute os comandos:

```bash
# Executar migrações
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Coletar arquivos estáticos
python manage.py collectstatic --noinput
```

### 6. **Verificar Deploy**
- **App**: `https://seu-app.onrender.com`
- **Admin**: `https://seu-app.onrender.com/admin/`
- **API**: `https://seu-app.onrender.com/api/`

## 🔧 **Configurações Importantes**

### **PlanetScale SSL**
O PlanetScale requer SSL. O certificado já está configurado no código.

### **Static Files**
O Render serve arquivos estáticos automaticamente.

### **CORS**
Configure os domínios do frontend nas variáveis de ambiente.

## ✅ **Vantagens desta Configuração**

1. **100% Gratuito** para sempre
2. **MySQL** (que você já usa)
3. **Deploy automático** do GitHub
4. **SSL automático**
5. **Escalabilidade** fácil
6. **Performance** excelente

## 🚨 **Troubleshooting**

### **Erro de SSL no PlanetScale**
- Verifique se a variável `DB_SSL_CA` está configurada
- O certificado já está no código

### **Erro de conexão**
- Verifique as credenciais do PlanetScale
- Verifique se o banco está ativo
- Verifique as variáveis de ambiente

### **Erro de migração**
```bash
# Via Render Shell
python manage.py migrate --run-syncdb
```

### **Erro de static files**
```bash
# Via Render Shell
python manage.py collectstatic --noinput
```

## 📊 **Limites Gratuitos**

### **Render.com**
- **750 horas/mês** de execução
- **512MB** de RAM
- **Sleep** após 15 min de inatividade

### **PlanetScale**
- **5GB** de armazenamento
- **1 bilhão** de queries/mês
- **1 branch** de produção

## 🔗 **URLs Finais**

- **Backend**: `https://seu-app.onrender.com`
- **Admin**: `https://seu-app.onrender.com/admin/`
- **API**: `https://seu-app.onrender.com/api/`

## 📞 **Suporte**

- **Render**: [render.com/docs](https://render.com/docs)
- **PlanetScale**: [planetscale.com/docs](https://planetscale.com/docs)
- **Django**: [docs.djangoproject.com](https://docs.djangoproject.com)

