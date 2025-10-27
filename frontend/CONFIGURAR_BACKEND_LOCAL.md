# 🔧 Como Configurar Backend Local para o App Mobile

## ❌ Erro Atual
```
"error": {"message": "Network Error"}
```

Isso acontece porque o app está tentando se conectar com o backend online no Render, mas pode estar dando timeout ou indisponível.

## 🎯 Soluções

### Opção 1: Usar Backend Local (Recomendado para Desenvolvimento)

#### 1️⃣ Inicie o Backend Django Localmente

```bash
# Em um terminal, vá para a pasta do backend
cd backend

# Ative o ambiente virtual (se houver)
# Windows
.\venv\Scripts\activate

# Inicie o servidor
python manage.py runserver
```

O backend deve estar rodando em: `http://localhost:8000` ou `http://127.0.0.1:8000`

#### 2️⃣ Configure a URL no App

**Crie um arquivo `.env` na pasta `frontend/`:**

```env
# Para emulador Android
EXPO_PUBLIC_API_BASE_URL=http://10.0.2.2:8000

# Para simulador iOS ou Expo Go físico
# EXPO_PUBLIC_API_BASE_URL=http://localhost:8000

# Timeout
EXPO_PUBLIC_API_TIMEOUT_MS=30000

# Logs HTTP
EXPO_PUBLIC_ENABLE_HTTP_LOGS=true
```

**⚡ IMPORTANTE:** 
- Use `10.0.2.2` para emulador Android
- Use `localhost` ou `127.0.0.1` para iOS
- Use `http://` (não https) para local

#### 3️⃣ Reinicie o App

Após criar o `.env`, pare o Metro e inicie novamente:

```bash
cd frontend
# Pare o Metro (Ctrl+C)
npm start
# ou
expo start
```

### Opção 2: Verificar Backend Online

Verifique se o backend online está funcionando:

```bash
curl https://gestao-entregadores-backend.onrender.com/api/auth/login/
```

Ou abra no navegador: https://gestao-entregadores-backend.onrender.com/api/auth/login/

Se não responder, o backend online pode estar dormindo (gratuito demora para acordar).

---

## 🧪 Como Testar

### 1. Verifique a URL Configurada

No código, você pode ver qual URL está sendo usada olhando os logs:

```
📤 AuthContext - Endpoint: /api/auth/register/
```

Isso vai aparecer no terminal Metro.

### 2. Teste de Conectividade

No terminal do Metro, você deve ver:

```
📤 AuthContext - Enviando dados de cadastro: {...}
📤 AuthContext - Endpoint: /api/auth/register/
✅ AuthContext - Resposta do backend: {...}  ← Seu sucesso aqui!
```

Se aparecer `Network Error`, significa que não consegue conectar.

### 3. Verificar Backend Local

Certifique-se de que o backend Django está rodando:

```bash
# Em outro terminal
curl http://10.0.2.2:8000/api/auth/register/
# ou
curl http://localhost:8000/api/auth/register/
```

Se retornar erro 405 Method Not Allowed, está funcionando! (405 significa que aceita POST, não GET)

---

## 🐛 Troubleshooting

### Backend não responde

```bash
# Verifique se o backend está rodando
cd backend
python manage.py runserver 0.0.0.0:8000
```

### CORS Error

Se aparecer erro de CORS, o backend já está configurado para aceitar todas as origens em dev.

### Timeout

Aumente o timeout no `.env`:
```env
EXPO_PUBLIC_API_TIMEOUT_MS=60000
```

### Emulador não acessa localhost

- **Android**: Use `10.0.2.2` em vez de `localhost`
- **iOS**: Use `localhost` ou `127.0.0.1`
- **Dispositivo físico**: Use o IP da sua máquina na rede (ex: `http://192.168.1.100:8000`)

---

## 📋 Checklist

- [ ] Backend Django rodando (`python manage.py runserver`)
- [ ] Arquivo `.env` criado na pasta `frontend/`
- [ ] URL correta configurada (10.0.2.2 para Android)
- [ ] Metro reiniciado após criar `.env`
- [ ] Firewall permitindo conexão (desative temporariamente se necessário)

---

## 💡 Dica Rápida

Para alternar entre backend local e online rapidamente, edite `frontend/src/config/api.js`:

```javascript
export const API_CONFIG = {
  // Backend LOCAL
  BASE_URL: 'http://10.0.2.2:8000',
  
  // Backend ONLINE
  // BASE_URL: 'https://gestao-entregadores-backend.onrender.com',
  
  TIMEOUT: 30000,
};
```

**Lembre-se:** Após mudar, precisa rebuild o app se já tiver compilado.

