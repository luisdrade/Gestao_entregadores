# 🗄️ Solução: Banco de Dados Local

## ❌ Erro Atual

```
MySQLdb.OperationalError: (2005, "Unknown server host 'mysql.railway.internal'")
```

O backend está tentando usar MySQL do Railway, que não existe localmente.

## ✅ SOLUÇÃO RÁPIDA

### Passo 1: Rode o script de inicialização

No terminal do backend, execute:

```powershell
cd backend
.\start_local.ps1
```

OU manualmente:

```powershell
cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Passo 2: Confirme que está funcionando

Você deve ver:
```
Starting development server at http://0.0.0.0:8000/
```

### Passo 3: Teste o app

No app, configure a URL para: `http://10.0.2.2:8000`

---

## 🔧 O que foi alterado?

O arquivo `backend/sistema/settings.py` agora:
- ✅ Detecta automaticamente se está rodando localmente
- ✅ Usa SQLite quando detecta Railway ou ambiente local
- ✅ Usa MySQL em produção (Render)
- ✅ Não precisa de configuração adicional!

---

## 📝 Criar usuário de teste (opcional)

Para criar um usuário admin:

```powershell
cd backend
python manage.py createsuperuser
```

Siga as instruções na tela.

---

## 🎯 Próximos Passos

1. ✅ Backend rodando com SQLite
2. ✅ App configurado para `http://10.0.2.2:8000`
3. ✅ Teste o cadastro!

