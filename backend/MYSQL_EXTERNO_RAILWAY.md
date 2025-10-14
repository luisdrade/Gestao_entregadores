# 🗄️ MySQL Externo + Railway Gratuito

## Por que MySQL externo?
- ✅ **Railway gratuito** para o backend
- ✅ **MySQL gratuito** externo
- ✅ **Melhor dos dois mundos**
- ✅ **Sem limitações de tempo**

## 🎯 Opções de MySQL Gratuito

### 1. **PlanetScale (Recomendado)**
- ✅ **MySQL gratuito** para sempre
- ✅ **5GB** de armazenamento
- ✅ **1 bilhão** de queries/mês
- ✅ **Sem limite de tempo**
- ✅ **Fácil integração**

### 2. **Aiven**
- ✅ **MySQL gratuito** por 1 mês
- ✅ **512MB** de armazenamento
- ✅ **Depois pago** (mas barato)

### 3. **Clever Cloud**
- ✅ **MySQL gratuito** limitado
- ✅ **1GB** de armazenamento
- ✅ **Sem limite de tempo**

## 🚀 Configuração com PlanetScale

### Passo 1: Criar conta no PlanetScale
1. Acesse [planetscale.com](https://planetscale.com)
2. Faça login com GitHub
3. Crie um novo banco de dados
4. Anote as credenciais de conexão

### Passo 2: Configurar Railway
```bash
# Voltar para MySQL no settings.py
# Configurar variáveis de ambiente
railway variables set DB_ENGINE="django.db.backends.mysql"
railway variables set DB_NAME="seu-banco-planetscale"
railway variables set DB_USER="seu-usuario-planetscale"
railway variables set DB_PASSWORD="sua-senha-planetscale"
railway variables set DB_HOST="seu-host-planetscale.mysql.planetscale.com"
railway variables set DB_PORT="3306"
```

### Passo 3: Deploy
```bash
railway up
```

## 🔧 Configuração Django

### settings.py para MySQL externo:
```python
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
        },
    }
}
```

## 📋 Passo a Passo Completo

### 1. **Criar MySQL no PlanetScale**
- Acesse [planetscale.com](https://planetscale.com)
- Crie conta gratuita
- Crie novo banco: `gestao-entregadores`
- Anote as credenciais

### 2. **Configurar Railway**
```bash
# Conectar ao projeto
railway link

# Configurar variáveis
railway variables set DJANGO_SECRET_KEY="sua-chave"
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS="seu-app.railway.app"

# Configurar MySQL externo
railway variables set DB_ENGINE="django.db.backends.mysql"
railway variables set DB_NAME="gestao-entregadores"
railway variables set DB_USER="seu-usuario"
railway variables set DB_PASSWORD="sua-senha"
railway variables set DB_HOST="seu-host.mysql.planetscale.com"
railway variables set DB_PORT="3306"
```

### 3. **Deploy**
```bash
railway up
```

### 4. **Configurar banco**
```bash
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic --noinput
```

## ✅ Vantagens desta abordagem

1. **Railway gratuito** para sempre
2. **MySQL gratuito** para sempre
3. **Sem limitações** de tempo
4. **Performance** excelente
5. **Escalabilidade** fácil

## 🔗 URLs finais
- **Backend**: `https://seu-app.railway.app`
- **Admin**: `https://seu-app.railway.app/admin/`
- **API**: `https://seu-app.railway.app/api/`

## 🆚 Comparação: MySQL Externo vs PostgreSQL

| Aspecto | MySQL Externo | PostgreSQL (Render) |
|---------|---------------|-------------------|
| **Custo** | Gratuito | Gratuito |
| **Banco** | MySQL | PostgreSQL |
| **Plataforma** | Railway + PlanetScale | Render.com |
| **Complexidade** | Média | Baixa |
| **Performance** | Excelente | Excelente |
| **Escalabilidade** | Alta | Alta |

## 🎯 Recomendação

**MySQL Externo + Railway** é uma excelente opção se:
- Você quer manter MySQL
- Quer usar Railway
- Não se importa com configuração extra

**PostgreSQL + Render** é melhor se:
- Você quer simplicidade
- Não se importa com mudança de banco
- Quer tudo em uma plataforma

