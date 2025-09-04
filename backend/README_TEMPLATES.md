# Templates HTML - Sistema de Gestão de Entregadores

## 🎨 Visão Geral dos Templates

Este diretório contém todos os templates HTML do sistema de autenticação e dashboards, criados com design moderno e responsivo usando Bootstrap 5 e Font Awesome.

## 📁 Estrutura dos Templates

```
templates/
├── auth/
│   ├── login.html          # Página de login
│   └── register.html       # Página de registro
├── admin/
│   └── dashboard.html      # Dashboard administrativo
└── entregador/
    └── dashboard.html      # Dashboard do entregador
```

## 🚀 Como Usar

### 1. Acessar as Páginas

- **Login**: `http://localhost:8000/auth/login/`
- **Registro**: `http://localhost:8000/auth/register/`
- **Dashboard Admin**: `http://localhost:8000/auth/admin/dashboard/`
- **Dashboard Entregador**: `http://localhost:8000/auth/entregador/dashboard/`

### 2. Fluxo de Autenticação

1. **Usuário acessa** `/auth/login/` ou `/auth/register/`
2. **Faz login/registro** via API
3. **É redirecionado** automaticamente para o dashboard correto:
   - Admin → `/auth/admin/dashboard/`
   - Entregador → `/auth/entregador/dashboard/`

## 🎯 Funcionalidades dos Templates

### Login (`auth/login.html`)
- ✅ Formulário de login responsivo
- ✅ Validação em tempo real
- ✅ Redirecionamento automático por tipo de usuário
- ✅ Verificação de autenticação existente
- ✅ Design moderno com gradientes e animações

### Registro (`auth/register.html`)
- ✅ Formulário completo de registro
- ✅ Máscaras para CPF, telefone e CEP
- ✅ Validação de força de senha
- ✅ Validação de confirmação de senha
- ✅ Campos opcionais e obrigatórios
- ✅ Design responsivo e moderno

### Dashboard Admin (`admin/dashboard.html`)
- ✅ Sidebar com navegação
- ✅ Cards de estatísticas
- ✅ Tabela de usuários
- ✅ Modal para criar usuários
- ✅ Controle de acesso (apenas admin)
- ✅ Design profissional e organizado

### Dashboard Entregador (`entregador/dashboard.html`)
- ✅ Sidebar com funcionalidades do entregador
- ✅ Cards de estatísticas pessoais
- ✅ Seção de perfil editável
- ✅ Atividades recentes
- ✅ Design focado na usabilidade

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com variáveis CSS
- **Bootstrap 5** - Framework CSS responsivo
- **Font Awesome 6** - Ícones vetoriais
- **JavaScript ES6+** - Funcionalidades interativas
- **Fetch API** - Comunicação com backend

## 🎨 Características de Design

### Paleta de Cores
```css
:root {
    --primary-color: #667eea;      /* Azul principal */
    --secondary-color: #764ba2;    /* Roxo secundário */
    --success-color: #28a745;      /* Verde sucesso */
    --warning-color: #ffc107;      /* Amarelo aviso */
    --danger-color: #dc3545;       /* Vermelho erro */
    --info-color: #17a2b8;         /* Azul info */
}
```

### Estilos Principais
- **Gradientes** - Fundos com gradientes modernos
- **Sombras** - Box-shadows sutis para profundidade
- **Bordas arredondadas** - Border-radius para suavidade
- **Animações** - Transições e hover effects
- **Responsividade** - Mobile-first design

## 📱 Responsividade

Todos os templates são **100% responsivos** e funcionam perfeitamente em:

- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1200px+)

## 🔐 Segurança

### Validações Implementadas
- ✅ Verificação de autenticação
- ✅ Controle de acesso por tipo de usuário
- ✅ Validação de formulários
- ✅ Sanitização de dados
- ✅ Tokens JWT seguros

### Controle de Acesso
- **Admin**: Acesso total ao sistema
- **Entregador**: Acesso limitado às próprias funcionalidades
- **Visitante**: Apenas login e registro

## 🚀 Funcionalidades JavaScript

### Autenticação
- Login automático
- Redirecionamento inteligente
- Gerenciamento de tokens
- Logout seguro

### Formulários
- Validação em tempo real
- Máscaras de entrada
- Verificação de força de senha
- Submissão assíncrona

### Dashboard
- Navegação entre seções
- Carregamento dinâmico de dados
- Atualização em tempo real
- Modais interativos

## 📊 Integração com API

### Endpoints Utilizados
- `POST /api/auth/login/` - Login
- `POST /api/auth/register/` - Registro
- `GET /api/auth/profile/` - Perfil do usuário
- `PUT /api/auth/profile/` - Atualizar perfil
- `GET /api/admin/users/` - Listar usuários (admin)
- `POST /api/admin/users/` - Criar usuário (admin)

### Headers de Autenticação
```javascript
headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
}
```

## 🧪 Testando os Templates

### 1. Executar o Servidor
```bash
cd backend
venv\Scripts\activate
python manage.py runserver
```

### 2. Acessar as Páginas
- Abrir navegador em `http://localhost:8000`
- Navegar para `/auth/login/` ou `/auth/register/`

### 3. Testar Funcionalidades
- Fazer login/registro
- Verificar redirecionamento
- Testar responsividade
- Verificar validações

## 🔧 Personalização

### Alterar Cores
Edite as variáveis CSS em cada template:
```css
:root {
    --primary-color: #sua-cor;
    --secondary-color: #sua-cor-secundaria;
}
```

### Alterar Logo
Substitua o ícone e texto no header:
```html
<div class="logo-icon">
    <i class="fas fa-seu-icone"></i>
</div>
<div class="logo-title">Seu Nome</div>
```

### Adicionar Funcionalidades
1. Crie novas seções no dashboard
2. Adicione novos endpoints na API
3. Implemente JavaScript para interação
4. Atualize a navegação

## 📝 Exemplos de Uso

### Login de Usuário
```javascript
const loginData = {
    email: 'usuario@exemplo.com',
    password: 'senha123'
};

const response = await fetch('/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
});
```

### Requisição Autenticada
```javascript
const accessToken = localStorage.getItem('access_token');

const response = await fetch('/api/auth/profile/', {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
});
```

## 🚨 Solução de Problemas

### Erro: "Template não encontrado"
- Verificar se o arquivo está na pasta correta
- Verificar se o nome do template está correto
- Verificar se o Django está configurado para templates

### Erro: "API não responde"
- Verificar se o servidor está rodando
- Verificar se as URLs estão corretas
- Verificar se o CORS está configurado

### Erro: "Token inválido"
- Verificar se o token está sendo salvo corretamente
- Verificar se o token não expirou
- Verificar se o formato do token está correto

## 📚 Recursos Adicionais

- **Bootstrap 5**: https://getbootstrap.com/docs/5.3/
- **Font Awesome**: https://fontawesome.com/
- **CSS Variables**: https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
- **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

## 🤝 Contribuição

Para adicionar novos templates:

1. **Criar arquivo HTML** na pasta apropriada
2. **Adicionar URL** em `auth_urls.py`
3. **Implementar funcionalidades** JavaScript
4. **Testar responsividade** em diferentes dispositivos
5. **Documentar** funcionalidades e uso

## 📞 Suporte

Em caso de problemas:

1. Verificar console do navegador para erros JavaScript
2. Verificar logs do Django para erros de backend
3. Verificar se todas as dependências estão instaladas
4. Verificar se as URLs estão configuradas corretamente
5. Consultar a documentação da API

---

**🎉 Templates criados com sucesso!** O sistema agora possui uma interface completa e moderna para autenticação e gerenciamento de usuários.
