# 🚀 Como Rodar Backend Localmente

## ✅ Configuração Atualizada

- ✅ **Produção**: PostgreSQL do Render
- ✅ **Local**: SQLite (automático)
- ✅ **Script**: `start_local.ps1`

## 🎯 Passo a Passo

### 1. Rode o Script

```powershell
cd C:\Faculdade\TCC\Gestao_entregadores\backend
.\start_local.ps1
```

**OU manualmente:**

```powershell
# Definir variável de ambiente
$env:USE_LOCAL_DB = "true"

# Rodar migrações
python manage.py migrate

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

### 2. O que vai acontecer?

1. ✅ Cria banco SQLite (`db.sqlite3`)
2. ✅ Roda as migrações
3. ✅ Inicia servidor em `http://0.0.0.0:8000`

### 3. Verifique

Você deve ver:
```
Starting development server at http://0.0.0.0:8000/
```

### 4. Configure o App

No arquivo `frontend/src/config/api.js`, use:
```javascript
const BASE_URL = 'http://10.0.2.2:8000';
```

### 5. Teste!

Tente fazer o cadastro no app! 🎉

---

## 📝 Notas

- **SQLite é criado automaticamente** na pasta `backend/`
- **Não precisa configurar nada** - o script faz tudo!
- **Produção no Render** continua usando PostgreSQL normalmente
- **Local usa SQLite** para facilitar desenvolvimento

---

## 🔧 Se der erro

```powershell
# Limpar banco e começar de novo
Remove-Item db.sqlite3 -ErrorAction SilentlyContinue
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

---

## ✅ Pronto!

Agora você tem:
- ✅ Backend local funcionando
- ✅ Banco SQLite
- ✅ API em `http://10.0.2.2:8000`
- ✅ App configurado

**Teste o cadastro!** 🚀

