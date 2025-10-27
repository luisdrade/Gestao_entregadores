# 🚨 Solução: Network Error no Cadastro

## 📊 Diagnóstico

O erro `"Network Error"` significa que o app **não consegue se conectar ao backend**.

O app está configurado para usar:
```
https://gestao-entregadores-backend.onrender.com
```

## ✅ Soluções (Escolha uma)

### 🟢 OPÇÃO 1: Usar Backend Local (RECOMENDADO)

#### Passo 1: Inicie o Backend Local

Abra um **novo terminal** e execute:

```bash
cd C:\Faculdade\TCC\Gestao_entregadores\backend
python manage.py runserver
```

Você deve ver algo como:
```
Starting development server at http://127.0.0.1:8000/
```

#### Passo 2: Modifique a URL no Código

Abra o arquivo: `frontend/src/config/api.js`

**MUDE a linha 12:**

```javascript
// ❌ ANTES (comentado):
const BASE_URL = 'https://gestao-entregadores-backend.onrender.com';

// ✅ DEPOIS (descomentado):
const BASE_URL = 'http://10.0.2.2:8000';  // Para Android Emulator
```

**OU se estiver usando iOS:**

```javascript
const BASE_URL = 'http://localhost:8000';
```

#### Passo 3: Reinicie o Metro

No terminal do Metro, aperte `Ctrl+C` e depois:

```bash
cd frontend
npm start
```

#### Passo 4: Teste o Cadastro

Agora tente fazer o cadastro novamente!

---

### 🔵 OPÇÃO 2: Testar Backend Online

O backend online pode estar dormindo (demora até 30 segundos para acordar).

#### Teste no Navegador

Abra este link no Chrome/Firefox:
```
https://gestao-entregadores-backend.onrender.com/api/auth/login/
```

Se mostrar um erro `{"detail": "Method not allowed"}` → ✅ Backend está **FUNCIONANDO**!

Se mostrar timeout ou erro de conexão → ❌ Backend está **DORMINDO**.

#### Se Backend Estiver Dormindo

1. Faça uma requisição no navegador
2. Aguarde 30-60 segundos
3. Tente novamente no app

---

### 🟡 OPÇÃO 3: Verificar Conectividade

#### No Terminal do Metro, adicione este log:

No arquivo `frontend/src/config/api.js`, adicione logo após a linha 15:

```javascript
console.log('🌐 API Config:', {
  BASE_URL: API_CONFIG.BASE_URL,
  TIMEOUT: API_CONFIG.TIMEOUT
});
```

Depois reinicie o Metro e olhe os logs para ver qual URL está sendo usada.

---

## 🔍 Como Saber Qual Opção Funcionou

### ✅ Sucesso (Opção 1 ou 2 funcionou):

Você verá nos logs:
```
📤 AuthContext - Enviando dados de cadastro: {...}
📤 AuthContext - Endpoint: /api/auth/register/
✅ AuthContext - Resposta do backend: {...}  ← SUCESSO!
```

### ❌ Ainda com Erro:

```
❌ AuthContext - Erro no cadastro:
   Mensagem: Network Error
   Dados: undefined
```

---

## 💡 Dica Final

Se nada funcionar, tente **desabilitar firewall temporariamente**:

1. Windows: Search "Firewall" → Temporarily turn off
2. Tente o cadastro novamente
3. Reative o firewall

---

## 📞 Próximos Passos

1. Escolha a **Opção 1** (Backend Local) - Mais confiável
2. Siga os passos acima
3. Me avise o resultado nos logs!

Se precisar de mais ajuda, envie os logs completos do Metro após tentar o cadastro.

