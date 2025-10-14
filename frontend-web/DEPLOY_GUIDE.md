# Deploy do Frontend - Guia Completo

## Opção 1: Deploy no Vercel (Recomendado)

### 1. Preparação
```bash
cd frontend-web
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env.local`:
```bash
# URL da API (substitua pela URL do seu backend no Railway)
VITE_API_BASE_URL=https://seu-backend.railway.app
```

### 3. Deploy no Vercel

#### Método 1: Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy de produção
vercel --prod
```

#### Método 2: Via GitHub
1. Faça push do código para GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Conecte seu repositório GitHub
4. Configure as variáveis de ambiente:
   - `VITE_API_BASE_URL`: URL do seu backend no Railway
5. Deploy automático!

### 4. Configurar domínio personalizado (opcional)
- Acesse o dashboard do Vercel
- Vá em Settings > Domains
- Adicione seu domínio personalizado

## Opção 2: Deploy no Netlify

### 1. Preparação
```bash
cd frontend-web
npm run build
```

### 2. Deploy via CLI
```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy de produção
netlify deploy --prod
```

### 3. Deploy via GitHub
1. Faça push do código para GitHub
2. Acesse [netlify.com](https://netlify.com)
3. Conecte seu repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables:
     - `VITE_API_BASE_URL`: URL do seu backend no Railway

## Opção 3: Deploy no Railway (Frontend)

### 1. Configurar Railway
```bash
cd frontend-web
railway init
```

### 2. Configurar build
Crie um arquivo `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "healthcheckPath": "/"
  }
}
```

### 3. Deploy
```bash
railway up
```

## Configuração de CORS no Backend

Após fazer deploy do frontend, você precisará atualizar as configurações de CORS no backend:

1. Acesse o dashboard do Railway
2. Vá em Variables
3. Adicione/atualize a variável `CORS_ALLOWED_ORIGINS`:
```
https://seu-frontend.vercel.app,https://seu-frontend.netlify.app
```

Ou edite o arquivo `settings.py` diretamente:
```python
CORS_ALLOWED_ORIGINS = [
    # ... outros domínios ...
    "https://seu-frontend.vercel.app",
    "https://seu-frontend.netlify.app",
]
```

## URLs Importantes

- **Frontend**: `https://seu-frontend.vercel.app`
- **Backend API**: `https://seu-backend.railway.app`
- **Admin Django**: `https://seu-backend.railway.app/admin/`

## Troubleshooting

### Problemas comuns:

1. **Erro de CORS**: Verifique se o domínio do frontend está nas configurações de CORS do backend
2. **Erro 404**: Verifique se a URL da API está correta
3. **Erro de build**: Verifique se todas as dependências estão instaladas
4. **Erro de variáveis**: Verifique se as variáveis de ambiente estão configuradas

### Comandos úteis:
```bash
# Verificar build local
npm run build
npm run preview

# Verificar variáveis de ambiente
echo $VITE_API_BASE_URL

# Limpar cache
npm run build -- --force
```

