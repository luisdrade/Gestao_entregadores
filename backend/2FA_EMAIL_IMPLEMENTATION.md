# Implementação de 2FA por Email - Mobile App

## Visão Geral

Sistema de autenticação de 2 fatores (2FA) via email, otimizado para aplicativos mobile. Os usuários recebem códigos de 6 dígitos por email para verificação.

## Funcionalidades

### 🔐 **Autenticação Segura**
- Códigos de 6 dígitos enviados por email
- Expiração em 10 minutos
- Códigos de uso único
- Limpeza automática de códigos expirados

### 📱 **Otimizado para Mobile**
- Sem necessidade de apps externos
- Interface simples com código numérico
- Reenvio de códigos
- Verificação rápida

## Endpoints da API

### 1. **Setup do 2FA**
```http
GET /api/auth/2fa/setup/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "message": "Código de verificação enviado para seu email",
  "email": "user@example.com",
  "expires_at": "2025-01-09T17:45:00Z"
}
```

### 2. **Ativar 2FA**
```http
POST /api/auth/2fa/verify/
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "123456"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "2FA ativado com sucesso"
}
```

### 3. **Login com 2FA**

**Passo 1 - Login inicial:**
```http
POST /api/auth/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Resposta (se 2FA ativado):**
```json
{
  "success": true,
  "message": "2FA ativado. Código de verificação necessário.",
  "requires_2fa": true,
  "user_email": "user@example.com"
}
```

**Passo 2 - Verificar código:**
```http
POST /api/auth/login/2fa/
Content-Type: application/json

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "user": { ... }
}
```

### 4. **Reenviar Código**
```http
POST /api/auth/2fa/resend/
Content-Type: application/json

{
  "email": "user@example.com",
  "purpose": "login"  // ou "setup", "disable"
}
```

### 5. **Desabilitar 2FA**
```http
POST /api/auth/2fa/disable/
Authorization: Bearer <token>
Content-Type: application/json

{
  "password": "senha123",
  "code": "123456"
}
```

### 6. **Status do 2FA**
```http
GET /api/auth/2fa/status/
Authorization: Bearer <token>
```

**Resposta:**
```json
{
  "success": true,
  "two_factor_enabled": true,
  "email": "user@example.com"
}
```

## Fluxo de Uso no Mobile App

### 1. **Ativar 2FA**
```javascript
// 1. Solicitar setup
const setupResponse = await fetch('/api/auth/2fa/setup/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// 2. Usuário verifica email e digita código
const verifyResponse = await fetch('/api/auth/2fa/verify/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    code: '123456'
  })
});
```

### 2. **Login com 2FA**
```javascript
// 1. Login inicial
const loginResponse = await fetch('/api/auth/login/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'senha123'
  })
});

const loginData = await loginResponse.json();

if (loginData.requires_2fa) {
  // 2. Mostrar tela de código 2FA
  const code = await promptForCode(); // Sua função para capturar código
  
  // 3. Verificar código
  const verifyResponse = await fetch('/api/auth/login/2fa/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: loginData.user_email,
      code: code
    })
  });
}
```

### 3. **Reenviar Código**
```javascript
const resendResponse = await fetch('/api/auth/2fa/resend/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    purpose: 'login'
  })
});
```

## Configuração de Email

### Variáveis de Ambiente (.env)
```env
# Email Backend
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com

# SMTP Settings
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-app
```

### Para Desenvolvimento (Console)
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

## Segurança

### ✅ **Recursos de Segurança**
- Códigos válidos por apenas 10 minutos
- Códigos de uso único (removidos após uso)
- Limpeza automática de códigos expirados
- Validação de senha para desabilitar 2FA
- Logs detalhados de todas as operações

### 🔒 **Boas Práticas**
- Use HTTPS em produção
- Configure SPF/DKIM para emails
- Monitore tentativas de login suspeitas
- Implemente rate limiting se necessário

## Templates de Email

Os emails são enviados com templates HTML responsivos:
- **2FA Login**: Código para login
- **2FA Setup**: Código para ativar 2FA
- **2FA Disable**: Código para desabilitar 2FA

## Limpeza Automática

Execute periodicamente para limpar códigos expirados:
```python
from usuarios.email_service import TwoFactorEmailService
TwoFactorEmailService.cleanup_expired_codes()
```

## Troubleshooting

### Email não chega
1. Verificar configurações SMTP
2. Verificar spam/lixo eletrônico
3. Verificar logs do servidor
4. Testar com console backend

### Código inválido
1. Verificar se não expirou (10 min)
2. Verificar se não foi usado
3. Solicitar novo código

### Erro de configuração
1. Verificar variáveis de ambiente
2. Verificar permissões de email
3. Verificar logs de erro

## Vantagens para Mobile

✅ **Simplicidade**: Apenas digitar código de 6 dígitos
✅ **Acessibilidade**: Funciona em qualquer dispositivo
✅ **Confiabilidade**: Email é universal
✅ **Segurança**: Códigos temporários e únicos
✅ **UX**: Fluxo intuitivo para usuários

## Próximos Passos

1. **Instalar dependências**: Não precisa de bibliotecas extras
2. **Configurar email**: Definir SMTP no .env
3. **Executar migrações**: `python manage.py migrate`
4. **Testar**: Usar console backend para desenvolvimento
5. **Implementar no app**: Seguir exemplos de código acima

