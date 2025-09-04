# API de Autenticação - Sistema de Gestão de Entregadores

## Visão Geral

Esta API fornece um sistema completo de autenticação para o sistema de gestão de entregadores, permitindo login, registro e gerenciamento de usuários tanto para entregadores quanto para administradores.

## Base URL

```
http://localhost:8000/api/
```

## Endpoints de Autenticação

### 1. Login de Usuário

**POST** `/auth/login/`

Permite que usuários (admin ou entregador) façam login no sistema.

**Dados de entrada:**
```json
{
    "email": "usuario@exemplo.com",
    "password": "senha123"
}
```

**Resposta de sucesso (200):**
```json
{
    "success": true,
    "message": "Login realizado com sucesso",
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "user": {
        "id": 1,
        "nome": "João Silva",
        "email": "joao@exemplo.com",
        "cpf": "123.456.789-00",
        "telefone": "(11) 99999-9999",
        "username": "joao_silva",
        "data_nascimento": "1990-01-01",
        "endereco": "Rua das Flores, 123",
        "cep": "01234-567",
        "cidade": "São Paulo",
        "estado": "SP",
        "foto": "/media/fotos_perfil/perfil_1.jpg",
        "is_staff": false,
        "is_superuser": false,
        "date_joined": "2024-01-01T00:00:00Z",
        "user_type": "entregador"
    }
}
```

**Resposta de erro (401):**
```json
{
    "success": false,
    "error": "Credenciais inválidas"
}
```

### 2. Registro de Novo Usuário

**POST** `/auth/register/`

Permite que novos entregadores se registrem no sistema.

**Dados de entrada:**
```json
{
    "nome": "Maria Santos",
    "email": "maria@exemplo.com",
    "password": "senha123",
    "password_confirm": "senha123",
    "cpf": "987.654.321-00",
    "telefone": "(11) 88888-8888",
    "username": "maria_santos",
    "data_nascimento": "1985-05-15",
    "endereco": "Av. Paulista, 1000",
    "cep": "01310-100",
    "cidade": "São Paulo",
    "estado": "SP"
}
```

**Campos obrigatórios:** `nome`, `email`, `password`, `password_confirm`, `cpf`, `telefone`

**Campos opcionais:** `username`, `data_nascimento`, `endereco`, `cep`, `cidade`, `estado`

**Resposta de sucesso (201):**
```json
{
    "success": true,
    "message": "Usuário criado com sucesso",
    "tokens": {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    },
    "user": {
        "id": 2,
        "nome": "Maria Santos",
        "email": "maria@exemplo.com",
        "cpf": "987.654.321-00",
        "telefone": "(11) 88888-8888",
        "username": "maria_santos",
        "data_nascimento": "1985-05-15",
        "endereco": "Av. Paulista, 1000",
        "cep": "01310-100",
        "cidade": "São Paulo",
        "estado": "SP",
        "foto": null,
        "is_staff": false,
        "is_superuser": false,
        "date_joined": "2024-01-01T00:00:00Z",
        "user_type": "entregador"
    }
}
```

### 3. Logout

**POST** `/auth/logout/`

**Headers necessários:** `Authorization: Bearer <access_token>`

**Resposta de sucesso (200):**
```json
{
    "success": true,
    "message": "Logout realizado com sucesso"
}
```

### 4. Renovação de Token

**POST** `/auth/refresh/`

Permite renovar o token de acesso usando o refresh token.

**Dados de entrada:**
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Resposta de sucesso (200):**
```json
{
    "success": true,
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 5. Perfil do Usuário

#### Obter Perfil

**GET** `/auth/profile/`

**Headers necessários:** `Authorization: Bearer <access_token>`

**Resposta de sucesso (200):**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "nome": "João Silva",
        "email": "joao@exemplo.com",
        "cpf": "123.456.789-00",
        "telefone": "(11) 99999-9999",
        "username": "joao_silva",
        "data_nascimento": "1990-01-01",
        "endereco": "Rua das Flores, 123",
        "cep": "01234-567",
        "cidade": "São Paulo",
        "estado": "SP",
        "foto": "/media/fotos_perfil/perfil_1.jpg",
        "is_staff": false,
        "is_superuser": false,
        "date_joined": "2024-01-01T00:00:00Z",
        "user_type": "entregador"
    }
}
```

#### Atualizar Perfil

**PUT** `/auth/profile/`

**Headers necessários:** `Authorization: Bearer <access_token>`

**Dados de entrada:**
```json
{
    "nome": "João Silva Atualizado",
    "telefone": "(11) 77777-7777",
    "endereco": "Rua Nova, 456"
}
```

**Campos editáveis:** `nome`, `telefone`, `username`, `data_nascimento`, `endereco`, `cep`, `cidade`, `estado`

**Campos não editáveis:** `id`, `email`, `cpf`, `is_staff`, `is_superuser`, `date_joined`

### 6. Alteração de Senha

**POST** `/auth/change-password/`

**Headers necessários:** `Authorization: Bearer <access_token>`

**Dados de entrada:**
```json
{
    "current_password": "senha123",
    "new_password": "novaSenha456",
    "new_password_confirm": "novaSenha456"
}
```

**Resposta de sucesso (200):**
```json
{
    "success": true,
    "message": "Senha alterada com sucesso"
}
```

## Endpoints de Administração

### 1. Gerenciamento de Usuários (Apenas Admin)

#### Listar Usuários

**GET** `/admin/users/`

**Headers necessários:** `Authorization: Bearer <access_token>` (usuário deve ser admin)

**Resposta de sucesso (200):**
```json
{
    "success": true,
    "users": [
        {
            "id": 1,
            "nome": "João Silva",
            "email": "joao@exemplo.com",
            "cpf": "123.456.789-00",
            "telefone": "(11) 99999-9999",
            "username": "joao_silva",
            "is_active": true,
            "is_staff": false,
            "is_superuser": false,
            "date_joined": "2024-01-01T00:00:00Z",
            "user_type": "entregador"
        }
    ],
    "total": 1
}
```

#### Criar Usuário (Admin)

**POST** `/admin/users/`

**Headers necessários:** `Authorization: Bearer <access_token>` (usuário deve ser admin)

**Dados de entrada:**
```json
{
    "nome": "Admin Silva",
    "email": "admin@exemplo.com",
    "password": "admin123",
    "password_confirm": "admin123",
    "cpf": "111.222.333-44",
    "telefone": "(11) 66666-6666",
    "username": "admin_silva",
    "is_staff": true,
    "is_superuser": false
}
```

**Resposta de sucesso (201):**
```json
{
    "success": true,
    "message": "Usuário criado com sucesso",
    "user_id": 3
}
```

## Tipos de Usuário

### Entregador Normal
- `is_staff: false`
- `is_superuser: false`
- Acesso limitado às funcionalidades básicas
- Pode gerenciar próprio perfil e dados

### Administrador
- `is_staff: true`
- `is_superuser: false` (ou true para super admin)
- Acesso completo ao sistema
- Pode gerenciar todos os usuários
- Pode criar novos usuários

## Autenticação

A API usa **JWT (JSON Web Tokens)** para autenticação:

1. **Access Token**: Usado para autenticar requisições (válido por 1 dia)
2. **Refresh Token**: Usado para renovar o access token (válido por 7 dias)

### Headers de Autenticação

```
Authorization: Bearer <access_token>
```

## Tratamento de Erros

### Códigos de Status HTTP

- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Dados inválidos
- **401**: Não autorizado
- **403**: Acesso negado
- **404**: Não encontrado
- **500**: Erro interno do servidor

### Formato de Erro

```json
{
    "success": false,
    "error": "Descrição do erro",
    "details": {
        "campo": ["Mensagem de erro específica"]
    }
}
```

## Exemplos de Uso

### 1. Login e Acesso ao Sistema

```javascript
// 1. Fazer login
const loginResponse = await fetch('/api/auth/login/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'usuario@exemplo.com',
        password: 'senha123'
    })
});

const loginData = await loginResponse.json();

if (loginData.success) {
    // Salvar tokens
    localStorage.setItem('access_token', loginData.tokens.access);
    localStorage.setItem('refresh_token', loginData.tokens.refresh);
    
    // Verificar tipo de usuário
    if (loginData.user.user_type === 'admin') {
        // Redirecionar para painel admin
        window.location.href = '/admin-dashboard';
    } else {
        // Redirecionar para painel entregador
        window.location.href = '/entregador-dashboard';
    }
}
```

### 2. Requisição Autenticada

```javascript
const accessToken = localStorage.getItem('access_token');

const response = await fetch('/api/auth/profile/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
});

const data = await response.json();
```

### 3. Renovação de Token

```javascript
const refreshToken = localStorage.getItem('refresh_token');

const response = await fetch('/api/auth/refresh/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        refresh: refreshToken
    })
});

const data = await response.json();

if (data.success) {
    localStorage.setItem('access_token', data.access);
}
```

## Segurança

- Senhas são criptografadas usando hash bcrypt
- Tokens JWT têm tempo de expiração
- Validação de dados em todos os endpoints
- Controle de acesso baseado em permissões
- Logs de auditoria para ações importantes

## Notas Importantes

1. **CPF único**: Cada usuário deve ter um CPF único no sistema
2. **Email único**: Cada usuário deve ter um email único no sistema
3. **Username opcional**: Pode ser fornecido ou gerado automaticamente
4. **Foto de perfil**: Campo opcional para foto do usuário
5. **Endereço**: Campos de endereço são opcionais
6. **Validação de senha**: A senha deve seguir as regras de validação do Django
7. **Permissões**: Apenas administradores podem gerenciar outros usuários
