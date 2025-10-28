# 🔧 Corrigir Build Command - Render.com

## ⚠️ Problema Atual

Seu Build Command atual:
```
pip install -r requirements.txt && python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput && python manage.py create_admin
```

## ✅ Solução Correta

### Passo 1: Acessar Build Command no Render

1. **Dashboard Render** → Seu Web Service
2. **Settings** (no menu lateral)
3. **Build Command** (role até encontrar)

### Passo 2: Alterar Build Command

**Cole isso:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**NÃO inclua `migrate` no build command!** Isso causa problemas.

### Passo 3: Alterar Start Command

**Role até "Start Command"**

**Cole isso:**
```bash
python manage.py migrate --noinput && gunicorn sistema.wsgi:application
```

### Passo 4: Salvar e Aguardar

1. **Clique**: "Save Changes"
2. **Aguarde**: Deploy (5-10 minutos)
3. **Verifique**: Logs para ver migrações executando

## ✅ Como Deve Ficarmos

### **Build Command** (roda UMA vez)
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

### **Start Command** (roda SEMPRE que o serviço inicia)
```bash
python manage.py migrate --noinput && gunicorn sistema.wsgi:application
```

## 🎯 Por Que Isso Funciona?

- **Build**: Instala dependências e coleta arquivos estáticos
- **Start**: Executa migrações (cria tabelas) e inicia o servidor

---

## 🚨 Se Ainda Der Erro

### Copie o Erro COMPLETO dos Logs

No Render Dashboard → Web Service → Logs, copie TODO o erro que aparecer após iniciar o deploy.

Envie para mim aqui.



