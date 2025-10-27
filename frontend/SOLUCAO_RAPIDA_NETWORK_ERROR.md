# ⚡ SOLUÇÃO RÁPIDA: Network Error

## 🎯 O Problema

O backend no Render **está dormindo** (planos gratuitos adormecem após inatividade).

## ✅ SOLUÇÃO (Escolha a mais rápida)

### 🚀 OPÇÃO 1: Backend Local (MAIS RÁPIDO)

**1. Abra um NOVO terminal:**

```bash
cd C:\Faculdade\TCC\Gestao_entregadores\backend
python manage.py runserver
```

**2. Mude o arquivo `frontend/src/config/api.js`:**

**Linha 13 - DESCOMENTE:**
```javascript
const BASE_URL = 'http://10.0.2.2:8000';  // Para backend local
```

**Linha 13 - COMENTE:**
```javascript
// const BASE_URL = 'https://entregasplus.onrender.com';
```

**3. Reinicie o Metro:**
- Pare o Metro (Ctrl+C no terminal do Metro)
- Inicie novamente: `npm start`

**4. Teste o cadastro!**

---

### 🌐 OPÇÃO 2: Acordar Backend Online

**1. Aguarde 30-60 segundos**
- Render free demora até 1 minuto para "acordar"

**2. No navegador, abra:**
```
https://entregasplus.onrender.com/api/auth/login/
```

**3. Aguarde aparecer (mesmo que seja erro):**
- Deve mostrar `{"detail": "Method not allowed"}` (isso é BOM!)

**4. Tente o cadastro no app imediatamente**

---

## 🧪 Como saber se funcionou?

### ✅ SUCESSO (Você verá):
```
🌐 API_CONFIG: { BASE_URL: '...', TIMEOUT: 60000 }
📤 AuthContext - Base URL: ...
⏰ Tentando acordar o backend...
✅ Backend respondeu!
📤 AuthContext - Enviando dados de cadastro: {...}
✅ AuthContext - Resposta do backend: {...}
```

### ❌ AINDA COM ERRO:
```
❌ AuthContext - Erro no cadastro:
   Mensagem: Network Error
```

---

## 💡 Recomendação

**Use a OPÇÃO 1 (Backend Local)** - É mais rápido e confiável para desenvolvimento!

Seu backend Django já está configurado e pronto para rodar localmente.

---

## 📋 Checklist Rápido

- [ ] Backend local rodando? (`python manage.py runserver`)
- [ ] URL alterada para `http://10.0.2.2:8000`?
- [ ] Metro reiniciado?
- [ ] Tente o cadastro!

**Qualquer problema, me avise! 🚀**

