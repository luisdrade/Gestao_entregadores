# 🚀 Guia Completo de Deploy - Backend + Frontend

## 📋 Resumo do que foi configurado

### Backend (Django + Render.com + PlanetScale)
✅ Configurações de produção no `settings.py`  
✅ Suporte a MySQL (PlanetScale)  
✅ Configurações de CORS  
✅ SSL para PlanetScale  
✅ Guia de deploy `DEPLOY_RENDER_PLANETSCALE.md`  
✅ Script de configuração automática  

### Frontend (React + Vite)
✅ Configurações para Vercel/Netlify/Railway  
✅ Scripts de deploy automatizados  
✅ Guia de deploy `DEPLOY_GUIDE.md`  

---

## 🎯 Passo a Passo para Deploy

### 1. Deploy do Backend no Railway

#### 1.1 Preparar Ambiente Virtual
```bash
cd backend

# Ativar ambiente virtual (se já existir)
# Windows PowerShell:
.\venv\Scripts\Activate.ps1

# Windows CMD:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# Verificar se está ativo
python --version
```

#### 1.2 Instalar Railway CLI
```bash
npm install -g @railway/cli
```

#### 1.3 Login no Railway
```bash
railway login
```

#### 1.4 Deploy Automatizado (Recomendado)
```bash
# Windows PowerShell:
.\deploy_with_venv.ps1

# Linux/Mac:
./deploy_with_venv.sh
```

#### 1.5 Deploy Manual (Alternativa)
```bash
# Configurar o projeto
railway init
```

#### 1.6 Adicionar banco MySQL
```bash
railway add mysql
```

#### 1.7 Configurar variáveis de ambiente
```bash
# Django
railway variables set DJANGO_SECRET_KEY="sua-chave-secreta-aqui"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="seu-app.railway.app"

# Database (será configurado automaticamente)
# DATABASE_URL será criado automaticamente

# Static Files
railway variables set STATIC_URL="/static/"
railway variables set STATIC_ROOT="/app/staticfiles"

# Media Files  
railway variables set MEDIA_URL="/media/"
railway variables set MEDIA_ROOT="/app/media"
```

#### 1.8 Fazer deploy
```bash
railway up
```

#### 1.9 Configurar banco de dados
```bash
# Executar migrações
railway run python manage.py migrate

# Criar superusuário
railway run python manage.py createsuperuser

# Coletar arquivos estáticos
railway run python manage.py collectstatic --noinput
```

#### 1.10 Verificar deploy
```bash
railway open
```

### 2. Deploy do Frontend

#### 2.1 Configurar variáveis de ambiente
```bash
cd frontend-web
cp env.example .env.local
```

Edite o arquivo `.env.local`:
```bash
VITE_API_BASE_URL=https://seu-backend.railway.app
```

#### 2.2 Deploy no Vercel (Recomendado)

**Opção A: Via CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

**Opção B: Via GitHub**
1. Faça push do código para GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte seu repositório
4. Configure a variável `VITE_API_BASE_URL`
5. Deploy automático!

#### 2.3 Deploy no Netlify (Alternativa)

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### 2.4 Deploy no Railway (Alternativa)

```bash
# Instalar Railway CLI (se não instalou)
npm i -g @railway/cli

# Deploy
railway up
```

### 3. Configurar CORS no Backend

Após fazer deploy do frontend, atualize as configurações de CORS:

#### 3.1 Via Railway Dashboard
1. Acesse o dashboard do Railway
2. Vá em Variables
3. Adicione/atualize:
```
CORS_ALLOWED_ORIGINS=https://seu-frontend.vercel.app,https://seu-frontend.netlify.app
```

#### 3.2 Via código
Edite `backend/sistema/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    # ... outros domínios ...
    "https://seu-frontend.vercel.app",
    "https://seu-frontend.netlify.app",
]
```

---

## 🔧 Comandos Úteis

### Backend
```bash
# Ver logs
railway logs

# Conectar ao banco
railway connect mysql

# Executar comando Django
railway run python manage.py shell

# Ver variáveis
railway variables
```

### Frontend
```bash
# Build local
npm run build

# Preview local
npm run preview

# Deploy automatizado (PowerShell)
.\deploy.ps1 vercel

# Deploy automatizado (Bash)
./deploy.sh vercel
```

---

## 🌐 URLs Finais

- **Backend API**: `https://seu-backend.railway.app`
- **Admin Django**: `https://seu-backend.railway.app/admin/`
- **Frontend**: `https://seu-frontend.vercel.app`

---

## 🚨 Troubleshooting

### Problemas comuns:

1. **Erro de CORS**: Verifique se o domínio do frontend está nas configurações de CORS
2. **Erro 404**: Verifique se a URL da API está correta
3. **Erro de banco**: Verifique se o PostgreSQL foi adicionado corretamente
4. **Erro de static files**: Execute `railway run python manage.py collectstatic --noinput`

### Logs importantes:
```bash
# Backend
railway logs --follow

# Frontend (Vercel)
vercel logs

# Frontend (Netlify)
netlify logs
```

---

## 📝 Checklist Final

- [ ] Backend deployado no Railway
- [ ] Banco MySQL configurado
- [ ] Migrações executadas
- [ ] Superusuário criado
- [ ] Frontend deployado
- [ ] CORS configurado
- [ ] URLs testadas
- [ ] Admin acessível
- [ ] API funcionando

---

## 🎉 Próximos Passos

1. **Configurar domínio personalizado** (opcional)
2. **Configurar SSL** (automático no Railway/Vercel)
3. **Configurar monitoramento** (opcional)
4. **Configurar backup do banco** (opcional)
5. **Configurar CI/CD** (opcional)

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs: `railway logs`
2. Verifique as variáveis: `railway variables`
3. Teste localmente primeiro
4. Verifique a documentação da plataforma escolhida
