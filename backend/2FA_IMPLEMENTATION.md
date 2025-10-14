# Implementação de Autenticação de 2 Fatores (2FA)

## Visão Geral

Este documento descreve a implementação completa do sistema de autenticação de 2 fatores (2FA) no backend do sistema de gestão de entregadores.

## Funcionalidades Implementadas

### 1. Modelos de Dados

**Campos adicionados ao modelo `Entregador`:**
- `two_factor_enabled`: Boolean indicando se 2FA está ativado
- `two_factor_secret`: String com a chave secreta para geração de códigos TOTP
- `two_factor_backup_codes`: Lista de códigos de backup (JSON)

**Novo modelo `TwoFactorVerification`:**
- Armazena códigos de verificação temporários
- Controle de expiração e uso único

### 2. Endpoints da API

#### Autenticação com 2FA
- `POST /api/auth/login/` - Login normal (retorna `requires_2fa: true` se ativado)
- `POST /api/auth/login/2fa/` - Verificação do código 2FA

#### Configuração do 2FA
- `GET /api/auth/2fa/setup/` - Gerar QR code e códigos de backup
- `POST /api/auth/2fa/verify/` - Ativar 2FA após verificação
- `POST /api/auth/2fa/disable/` - Desabilitar 2FA
- `GET /api/auth/2fa/status/` - Verificar status do 2FA

### 3. Fluxo de Autenticação

#### Login sem 2FA
1. Usuário faz login com email/senha
2. Sistema retorna tokens JWT diretamente

#### Login com 2FA
1. Usuário faz login com email/senha
2. Sistema retorna `requires_2fa: true`
3. Usuário envia código 2FA para `/api/auth/login/2fa/`
4. Sistema valida código e retorna tokens JWT

### 4. Configuração do 2FA

#### Setup Inicial
1. Usuário autenticado acessa `/api/auth/2fa/setup/`
2. Sistema gera:
   - Chave secreta (secret)
   - QR code em base64
   - 10 códigos de backup
3. Usuário escaneia QR code com app autenticador
4. Usuário envia código de verificação para `/api/auth/2fa/verify/`
5. 2FA é ativado

#### Desabilitar 2FA
1. Usuário envia senha + código 2FA para `/api/auth/2fa/disable/`
2. Sistema valida e remove configuração 2FA

## Dependências Adicionadas

```txt
pyotp==2.9.0          # Geração e verificação de códigos TOTP
qrcode[pil]==7.4.2    # Geração de QR codes
```

## Segurança

### Códigos TOTP
- Códigos válidos por 30 segundos
- Janela de tolerância de 1 período (30s)
- Chave secreta armazenada no banco de dados

### Códigos de Backup
- 10 códigos únicos gerados no setup
- Códigos são removidos após uso
- Podem ser usados para login ou desabilitar 2FA

### Validações
- Verificação de senha para desabilitar 2FA
- Códigos numéricos de 6 dígitos
- Controle de expiração de códigos temporários

## Exemplos de Uso

### 1. Setup do 2FA

```bash
# 1. Obter QR code e códigos de backup
GET /api/auth/2fa/setup/
Authorization: Bearer <token>

# Resposta:
{
  "success": true,
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "backup_codes": ["A1B2C3D4", "E5F6G7H8", ...],
  "manual_entry_key": "JBSWY3DPEHPK3PXP"
}

# 2. Verificar código do app autenticador
POST /api/auth/2fa/verify/
Authorization: Bearer <token>
{
  "code": "123456"
}
```

### 2. Login com 2FA

```bash
# 1. Login inicial
POST /api/auth/login/
{
  "email": "user@example.com",
  "password": "senha123"
}

# Resposta (se 2FA ativado):
{
  "success": true,
  "message": "2FA ativado. Código de verificação necessário.",
  "requires_2fa": true,
  "user_email": "user@example.com"
}

# 2. Verificar código 2FA
POST /api/auth/login/2fa/
{
  "email": "user@example.com",
  "code": "123456"
}

# Resposta:
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

### 3. Desabilitar 2FA

```bash
POST /api/auth/2fa/disable/
Authorization: Bearer <token>
{
  "password": "senha123",
  "code": "123456"  # ou código de backup
}
```

## Apps Autenticadores Recomendados

- **Google Authenticator** (iOS/Android)
- **Microsoft Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **1Password** (iOS/Android/Desktop)

## Notas Importantes

1. **Migração de Banco**: Execute `python manage.py makemigrations usuarios` e `python manage.py migrate` para aplicar as mudanças no banco de dados.

2. **Instalação de Dependências**: Execute `pip install pyotp qrcode[pil]` para instalar as bibliotecas necessárias.

3. **Backup dos Códigos**: Os códigos de backup devem ser salvos em local seguro, pois são a única forma de recuperar acesso se o dispositivo for perdido.

4. **Compatibilidade**: O sistema é compatível com todos os apps autenticadores que suportam TOTP (RFC 6238).

## Troubleshooting

### Erro "Código inválido"
- Verificar se o relógio do dispositivo está sincronizado
- Tentar código de backup se disponível
- Verificar se o app autenticador está configurado corretamente

### Erro "2FA não foi configurado"
- Executar setup do 2FA primeiro
- Verificar se o usuário está autenticado

### QR Code não aparece
- Verificar se a biblioteca `qrcode[pil]` está instalada
- Verificar logs do servidor para erros de geração

