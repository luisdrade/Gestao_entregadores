# 🔍 Diagnóstico - Problemas com Envio de Dados para Comunidade

## Problemas Identificados e Soluções

### 1. **Backend Retorna HTML em vez de JSON**
**Problema**: O backend Django está configurado para retornar HTML (template), não JSON.

**Solução**: 
- ✅ **Implementado**: Modificado o serviço para aceitar HTML
- ✅ **Implementado**: Adicionados logs detalhados para debug
- ✅ **Implementado**: Tratamento de erro melhorado

### 2. **Possíveis Problemas de Conexão**

#### **Verificar se o Backend está Rodando:**
```bash
# No terminal do backend
cd backend
python manage.py runserver 0.0.0.0:8000
```

#### **Verificar IP e Porta:**
- **IP Atual**: `192.168.0.115:8000`
- **Verificar se o IP está correto** no arquivo `frontend/src/config/api.js`

#### **Testar Conexão Manual:**
```bash
# Teste simples
curl http://192.168.0.115:8000/comunidade/

# Ou no navegador
http://192.168.0.115:8000/comunidade/
```

### 3. **Problemas de CORS (Cross-Origin Resource Sharing)**

**Sintomas**: Erro de CORS no console do navegador/app

**Solução**: Adicionar CORS no Django
```python
# backend/sistema/settings.py
INSTALLED_APPS = [
    # ... outros apps
    'corsheaders',
]

MIDDLEWARE = [
    # ... outros middlewares
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOW_ALL_ORIGINS = True  # Para desenvolvimento
# ou
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://192.168.0.115:8081",
]
```

### 4. **Logs de Debug Implementados**

Agora o app mostra logs detalhados no console:
- 🚀 Dados sendo enviados
- 🌐 URL da requisição
- 📡 Status da resposta
- ✅ Sucesso ou ❌ Erro

### 5. **Como Testar**

1. **Abrir o app**
2. **Ir para Comunidade**
3. **Tentar criar uma postagem**
4. **Verificar os logs no console** (Metro/Expo)

### 6. **Possíveis Erros e Soluções**

#### **Erro: "Network request failed"**
- Backend não está rodando
- IP incorreto
- Firewall bloqueando

#### **Erro: "CORS policy"**
- Adicionar CORS no Django
- Verificar configuração de CORS

#### **Erro: "404 Not Found"**
- URL incorreta
- Rota não configurada

#### **Erro: "500 Internal Server Error"**
- Erro no backend
- Verificar logs do Django

### 7. **Arquivos Modificados**

- ✅ `frontend/src/services/communityService.js` - Logs e tratamento de erro
- ✅ `frontend/src/app/(home)/comunidade.jsx` - Teste de conexão
- ✅ `frontend/test-community-connection.js` - Script de teste

### 8. **Próximos Passos**

1. **Verificar se o backend está rodando**
2. **Testar a conexão manualmente**
3. **Verificar os logs no console do app**
4. **Configurar CORS se necessário**
5. **Testar novamente o envio de dados**

### 9. **Comandos Úteis**

```bash
# Backend
cd backend
python manage.py runserver 0.0.0.0:8000

# Frontend
cd frontend
npx expo start

# Teste de conexão
node test-community-connection.js
```

### 10. **Status Atual**

- ✅ **Serviço atualizado** com logs detalhados
- ✅ **Tratamento de erro** melhorado
- ✅ **Teste de conexão** implementado
- ⚠️ **Aguardando** verificação do backend
- ⚠️ **Possível** necessidade de configurar CORS
