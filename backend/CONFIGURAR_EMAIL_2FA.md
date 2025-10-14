# 📧 Configuração de Email para 2FA

## Visão Geral

Este guia explica como configurar o envio de emails para o sistema de autenticação de 2 fatores (2FA).

## 🚀 Configuração Rápida

### 1. Modo Desenvolvimento (Console)
Por padrão, o sistema está configurado para exibir emails no console durante desenvolvimento:

```bash
# Os emails aparecerão no terminal quando você executar:
python manage.py runserver
```

### 2. Configuração com Gmail

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Vá para: https://myaccount.google.com/security
   - Clique em "Senhas de app"
   - Gere uma senha para "Mail"
3. **Configure as variáveis de ambiente**:

```bash
# No arquivo .env ou variáveis de ambiente
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua-senha-de-app
DEFAULT_FROM_EMAIL=seu-email@gmail.com
```

### 3. Configuração com Outros Provedores

#### Outlook/Hotmail
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@outlook.com
EMAIL_HOST_PASSWORD=sua-senha
```

#### Yahoo
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@yahoo.com
EMAIL_HOST_PASSWORD=sua-senha
```

## 🧪 Testando a Configuração

### 1. Teste Rápido
```bash
cd backend
python test_2fa.py
```

### 2. Teste Manual
```python
# No shell do Django
python manage.py shell

# Execute:
from django.core.mail import send_mail
send_mail(
    'Teste 2FA',
    'Este é um teste de email.',
    'noreply@gestaoentregadores.com',
    ['seu-email@exemplo.com'],
    fail_silently=False,
)
```

## 📱 Como Funciona o 2FA

### 1. **Setup do 2FA**
- Usuário acessa `/api/auth/2fa/setup/`
- Sistema envia código por email
- Usuário digita código para ativar

### 2. **Login com 2FA**
- Usuário faz login normal
- Se 2FA ativado, sistema pede código
- Usuário digita código do email
- Login é completado

### 3. **Dispositivos Confiáveis**
- Dispositivos conhecidos não precisam de 2FA
- Sistema lembra dispositivos por device_id
- Usuário pode forçar 2FA em todos os dispositivos

## 🎨 Templates de Email

Os emails são enviados com templates HTML bonitos e responsivos:

- **2FA Setup**: Email roxo com gradiente
- **2FA Login**: Email azul com gradiente  
- **2FA Disable**: Email vermelho com gradiente

Todos os templates são:
- ✅ Responsivos (mobile-friendly)
- ✅ Com gradientes modernos
- ✅ Com ícones e emojis
- ✅ Com informações de segurança

## 🔧 Solução de Problemas

### Email não chega
1. Verifique a pasta de spam
2. Confirme as credenciais SMTP
3. Teste com console backend primeiro

### Erro de autenticação SMTP
1. Use senha de app (não senha normal)
2. Verifique se 2FA está ativado no Gmail
3. Confirme host e porta corretos

### Template não renderiza
1. Verifique se `TEMPLATES` está configurado
2. Confirme se templates estão em `backend/templates/`
3. Teste com `python test_2fa.py`

## 📊 Monitoramento

### Logs de Email
```bash
# Ver logs de email no console
tail -f debug.log | grep "2FA"
```

### Estatísticas
- Códigos enviados por dia
- Taxa de sucesso de envio
- Dispositivos confiáveis por usuário

## 🚀 Deploy em Produção

### 1. Configure SMTP de produção
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=seu-servidor-smtp.com
EMAIL_HOST_USER=no-reply@seudominio.com
EMAIL_HOST_PASSWORD=senha-segura
```

### 2. Configure domínio
```bash
DEFAULT_FROM_EMAIL=no-reply@seudominio.com
ALLOWED_HOSTS=seudominio.com,www.seudominio.com
```

### 3. Teste em produção
```bash
# Teste o envio de email
curl -X POST https://seudominio.com/api/auth/2fa/setup/ \
  -H "Authorization: Bearer SEU_TOKEN"
```

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs em `debug.log`
2. Teste com `python test_2fa.py`
3. Confirme configurações SMTP
4. Verifique se templates existem

---

**🎉 Pronto! Seu sistema 2FA está configurado e funcionando!**

