# 2FA Inteligente para Mobile - Sistema Completo

## 🎯 **Problema Resolvido**

**ANTES:** 2FA toda vez = usuários não querem usar o app
**AGORA:** 2FA inteligente = só quando necessário + dispositivos confiáveis

## 🧠 **Como Funciona o Sistema Inteligente**

### **1. Primeira Vez (Dispositivo Novo)**
```
Usuário faz login → Sistema detecta dispositivo novo → Pede 2FA → Adiciona como confiável
```

### **2. Próximas Vezes (Dispositivo Conhecido)**
```
Usuário faz login → Sistema reconhece dispositivo → Login direto (sem 2FA)
```

### **3. Situações que Pedem 2FA**
- ✅ **Dispositivo novo** (nunca usado antes)
- ✅ **Usuário forçou logout** (botão "Sair de todos os dispositivos")
- ✅ **Erro na identificação** do dispositivo
- ✅ **2FA ativado pela primeira vez**

## 📱 **Fluxo no App Mobile**

### **Login Inteligente**
```javascript
// 1. Login com identificação do dispositivo
const loginResponse = await fetch('/api/auth/login/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@exemplo.com',
    password: 'senha123',
    device_id: 'unique-device-id-123',  // ← IMPORTANTE!
    device_name: 'iPhone 15 Pro',
    device_type: 'mobile'
  })
});

const loginData = await loginResponse.json();

if (loginData.requires_2fa) {
  // 2. Mostrar tela de código 2FA
  show2FAScreen(loginData.user_email, loginData.reason);
} else {
  // 3. Login direto - dispositivo confiável
  saveTokens(loginData.tokens);
  navigateToHome();
}
```

### **Tela de 2FA (Só quando necessário)**
```javascript
// Usuário vê: "Código enviado para joao@exemplo.com"
// Usuário digita código do email
const verifyResponse = await fetch('/api/auth/login/2fa/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'joao@exemplo.com',
    code: '123456',
    device_id: 'unique-device-id-123',  // ← Mesmo ID
    device_name: 'iPhone 15 Pro',
    device_type: 'mobile'
  })
});

// Após sucesso, dispositivo fica confiável automaticamente
```

## 🔧 **Endpoints da API**

### **1. Login Inteligente**
```http
POST /api/auth/login/
{
  "email": "joao@exemplo.com",
  "password": "senha123",
  "device_id": "unique-device-id-123",
  "device_name": "iPhone 15 Pro",
  "device_type": "mobile"
}
```

**Resposta (Dispositivo Conhecido):**
```json
{
  "success": true,
  "requires_2fa": false,
  "tokens": { "access": "...", "refresh": "..." },
  "user": { ... }
}
```

**Resposta (Dispositivo Novo):**
```json
{
  "success": true,
  "requires_2fa": true,
  "message": "Código de verificação enviado para seu email",
  "user_email": "joao@exemplo.com",
  "reason": "Untrusted device",
  "expires_at": "2025-01-09T18:00:00Z"
}
```

### **2. Verificar Código 2FA**
```http
POST /api/auth/login/2fa/
{
  "email": "joao@exemplo.com",
  "code": "123456",
  "device_id": "unique-device-id-123",
  "device_name": "iPhone 15 Pro",
  "device_type": "mobile"
}
```

### **3. Gerenciar Dispositivos Confiáveis**
```http
GET /api/auth/devices/
Authorization: Bearer <token>

# Resposta:
{
  "success": true,
  "devices": [
    {
      "id": 1,
      "device_name": "iPhone 15 Pro",
      "device_type": "mobile",
      "last_used": "2025-01-09T17:30:00Z",
      "created_at": "2025-01-09T10:00:00Z"
    }
  ]
}
```

### **4. Remover Dispositivo**
```http
DELETE /api/auth/devices/
Authorization: Bearer <token>
{
  "device_id": "unique-device-id-123"
}
```

### **5. Logout de Todos os Dispositivos**
```http
POST /api/auth/force-2fa/
Authorization: Bearer <token>

# Resposta:
{
  "success": true,
  "message": "2FA será solicitado no próximo login de todos os dispositivos"
}
```

### **6. Testar Email**
```http
POST /api/auth/test-email/
Authorization: Bearer <token>

# Resposta:
{
  "success": true,
  "message": "Email de teste enviado com sucesso!",
  "email_config": { ... },
  "test_email_sent": true
}
```

## 📧 **Configuração de Email**

### **Para Desenvolvimento (Console)**
```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```
→ Emails aparecem no terminal do servidor

### **Para Produção (Gmail)**
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

**⚠️ Importante:** Use **senha de app** do Gmail, não a senha normal!

## 🎨 **Interface do App**

### **Tela de Login**
```
┌─────────────────────────┐
│     Gestão Entregadores │
├─────────────────────────┤
│ Email: joao@exemplo.com │
│ Senha: •••••••••••••••• │
│                         │
│    [ENTRAR]             │
└─────────────────────────┘
```

### **Tela de 2FA (Só quando necessário)**
```
┌─────────────────────────┐
│   🔐 Verificação 2FA    │
├─────────────────────────┤
│ Código enviado para:    │
│ joao@exemplo.com        │
│                         │
│ Código: [1][2][3][4][5][6] │
│                         │
│    [VERIFICAR]          │
│    [REENVIAR CÓDIGO]    │
└─────────────────────────┘
```

### **Tela de Configurações**
```
┌─────────────────────────┐
│     Configurações       │
├─────────────────────────┤
│ 🔒 Autenticação 2FA     │
│ Status: ATIVADO ✅      │
│                         │
│ 📱 Dispositivos Confiáveis │
│ • iPhone 15 Pro         │
│ • iPad Air              │
│                         │
│    [SAIR DE TODOS]      │
└─────────────────────────┘
```

## 🔐 **Segurança**

### **Dispositivo ID Único**
- Use `UUID` ou `Device ID` do sistema
- Nunca mude o ID do mesmo dispositivo
- Exemplo: `"iPhone-15-Pro-ABC123"`

### **Regras de 2FA**
- ✅ **Dispositivo novo** → Sempre pede 2FA
- ✅ **Dispositivo confiável** → Login direto
- ✅ **Logout forçado** → Próximo login pede 2FA
- ✅ **Erro de identificação** → Pede 2FA por segurança

### **Limpeza Automática**
- Códigos expiram em 10 minutos
- Dispositivos inativos são removidos após 90 dias
- Logs de segurança detalhados

## 🚀 **Vantagens**

### **Para Usuários**
- ✅ **Conveniente**: Só pede 2FA quando necessário
- ✅ **Seguro**: Protege contra acessos suspeitos
- ✅ **Rápido**: Login direto em dispositivos conhecidos
- ✅ **Controle**: Pode gerenciar dispositivos confiáveis

### **Para Desenvolvedores**
- ✅ **Simples**: API fácil de integrar
- ✅ **Flexível**: Configurável por dispositivo
- ✅ **Testável**: Endpoint de teste de email
- ✅ **Escalável**: Suporta múltiplos dispositivos

## 📋 **Próximos Passos**

1. **Executar migrações:**
   ```bash
   python manage.py makemigrations usuarios
   python manage.py migrate
   ```

2. **Configurar email:**
   - Editar `.env` com suas credenciais
   - Testar com `/api/auth/test-email/`

3. **Implementar no app:**
   - Gerar `device_id` único
   - Enviar nos requests de login
   - Implementar tela de 2FA

4. **Testar fluxo completo:**
   - Login com dispositivo novo
   - Login com dispositivo conhecido
   - Gerenciar dispositivos confiáveis

## 🎯 **Resultado Final**

**Usuários vão adorar usar o app porque:**
- Só pede 2FA quando realmente necessário
- Dispositivos conhecidos fazem login direto
- Sistema é seguro e confiável
- Interface simples e intuitiva

**Desenvolvedores vão adorar porque:**
- API bem documentada e fácil
- Sistema inteligente e automático
- Fácil de testar e debugar
- Escalável para muitos usuários

