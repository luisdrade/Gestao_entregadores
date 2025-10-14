# 🚀 Deploy no Render.com (Alternativa Gratuita)

## Por que Render.com?
- ✅ **Gratuito** para sempre
- ✅ **PostgreSQL** gratuito
- ✅ **Deploy automático** do GitHub
- ✅ **Sem limite de tempo**

## Passo a Passo

### 1. Preparar o código
```bash
# Fazer commit das mudanças
git add .
git commit -m "Configurações para deploy"
git push origin main
```

### 2. Configurar Render.com

#### 2.1 Criar conta
- Acesse [render.com](https://render.com)
- Faça login com GitHub

#### 2.2 Criar Web Service
- Clique em "New +"
- Selecione "Web Service"
- Conecte seu repositório GitHub
- Configure:
  - **Name**: gestao-entregadores
  - **Environment**: Python 3
  - **Build Command**: `pip install -r requirements.txt`
  - **Start Command**: `gunicorn sistema.wsgi:application`

#### 2.3 Criar PostgreSQL Database
- Clique em "New +"
- Selecione "PostgreSQL"
- Configure:
  - **Name**: gestao-entregadores-db
  - **Database**: gestao_entregadores
  - **User**: gestao_user

### 3. Configurar variáveis de ambiente

No Render.com, vá em Environment e adicione:

```bash
# Django
DJANGO_SECRET_KEY=sua-chave-secreta-aqui
DEBUG=False
ALLOWED_HOSTS=seu-app.onrender.com

# Database (será fornecido pelo Render)
DATABASE_URL=postgresql://user:password@host:port/database

# Static Files
STATIC_URL=/static/
STATIC_ROOT=/opt/render/project/src/staticfiles

# Media Files
MEDIA_URL=/media/
MEDIA_ROOT=/opt/render/project/src/media
```

### 4. Deploy automático
- O Render fará deploy automaticamente
- Acesse os logs para ver o progresso

### 5. Configurar banco de dados
```bash
# Via Render Shell (disponível no dashboard)
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

## URLs finais
- **App**: `https://seu-app.onrender.com`
- **Admin**: `https://seu-app.onrender.com/admin/`

## Vantagens do Render
- ✅ Gratuito para sempre
- ✅ PostgreSQL incluído
- ✅ Deploy automático
- ✅ SSL automático
- ✅ Domínio personalizado

