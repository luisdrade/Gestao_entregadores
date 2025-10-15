# 📧 Configuração de Email para 2FA Pós-Cadastro

## 🚀 Configuração Rápida

### 1. **Gmail (Recomendado)**

#### Passo 1: Ativar Senha de App no Gmail
1. Acesse sua conta Google: https://myaccount.google.com/
2. Vá em **Segurança** → **Verificação em duas etapas** (ative se não estiver)
3. Vá em **Senhas de app** → **Selecionar app** → **Outro (nome personalizado)**
4. Digite: "Gestão Entregadores"
5. **COPIE A SENHA GERADA** (16 caracteres)

#### Passo 2: Configurar Variáveis de Ambiente
Crie/edite o arquivo `.env` na pasta `backend/`:

```env
# Configuração de Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app-16-caracteres
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

### 2. **Outlook/Hotmail**

```env
# Configuração de Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@outlook.com
EMAIL_HOST_PASSWORD=sua-senha-normal
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

### 3. **Yahoo**

```env
# Configuração de Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@yahoo.com
EMAIL_HOST_PASSWORD=sua-senha-de-app
DEFAULT_FROM_EMAIL=noreply@gestaoentregadores.com
```

## 🧪 Testar Configuração

### Opção 1: Via Interface Web
1. Faça login no sistema
2. Vá em **Perfil** → **Configurações 2FA**
3. Clique em **"Testar Email"**

### Opção 2: Via Terminal
```bash
cd backend
python manage.py shell
```

```python
from usuarios.email_service import TwoFactorEmailService
from usuarios.models import Entregador

# Pegar um usuário existente
user = Entregador.objects.first()

# Testar envio
result = TwoFactorEmailService.send_registration_code(user)
print(f"Sucesso: {result['success']}")
print(f"Mensagem: {result['message']}")
```

### Opção 3: Script de Teste
```bash
cd backend
python email_config.py
```

## 🔧 Solução de Problemas

### ❌ "Authentication failed"
- **Gmail**: Use senha de app, não senha normal
- **Outlook**: Ative "Acesso menos seguro" ou use senha de app
- **Yahoo**: Use senha de app

### ❌ "Connection refused"
- Verifique se `EMAIL_HOST` e `EMAIL_PORT` estão corretos
- Teste com `EMAIL_USE_TLS=True` e `EMAIL_USE_SSL=False`

### ❌ "SMTPAuthenticationError"
- Verifique se `EMAIL_HOST_USER` e `EMAIL_HOST_PASSWORD` estão corretos
- Para Gmail: use senha de app de 16 caracteres

### ❌ "Timeout"
- Verifique sua conexão com internet
- Tente com `EMAIL_PORT=465` e `EMAIL_USE_SSL=True`

## 📱 Para SMS (Opcional)

Se quiser configurar SMS também, adicione no `.env`:

```env
# Configuração SMS (opcional)
SMS_ENABLED=true
TWILIO_ACCOUNT_SID=seu-account-sid
TWILIO_AUTH_TOKEN=seu-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

## 🚀 Deploy em Produção

### Railway/Render
Adicione as variáveis de ambiente no painel:
- `EMAIL_BACKEND`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USE_TLS`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- `DEFAULT_FROM_EMAIL`

### Vercel/Netlify
Configure as mesmas variáveis no painel de variáveis de ambiente.

## ✅ Verificar se Está Funcionando

1. **Cadastre um novo usuário**
2. **Escolha "Email" como método de verificação**
3. **Verifique sua caixa de entrada** (e spam)
4. **Digite o código** na tela de verificação

## 📧 Exemplo de Email

Você receberá um email assim:

```
Assunto: Verificação de Cadastro - Gestão Entregadores

🚚 Gestão Entregadores
Verificação de Cadastro

Olá [Seu Nome], confirme seu cadastro para continuar

Seu código de verificação é:
123456

⏰ Este código expira em 10 minutos

📋 Como usar este código:
1. Abra o aplicativo Gestão Entregadores
2. Na tela de verificação, digite o código acima
3. Clique em "Verificar Código"
4. Após a verificação, você terá acesso completo ao sistema
```

## 🎯 Próximos Passos

1. ✅ Configure as variáveis de ambiente
2. ✅ Teste o envio de email
3. ✅ Cadastre um usuário de teste
4. ✅ Verifique se recebeu o email
5. ✅ Complete a verificação no app

**Pronto! Seu sistema de 2FA pós-cadastro está funcionando! 🎉**