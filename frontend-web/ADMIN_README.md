# Dashboard Administrativo - Sistema de Gestão de Entregadores

## Funcionalidades Implementadas

### Tela de Admin (/admin)
- **Visualização de usuários**: Lista todos os usuários cadastrados no sistema
- **Status dos usuários**: Mostra se o usuário está ativo ou inativo
- **Ativação/Desativação**: Permite ativar ou desativar usuários
- **Exclusão de usuários**: Permite excluir usuários permanentemente
- **Busca**: Campo de busca para filtrar usuários por nome ou email
- **Atualização**: Botão para recarregar a lista de usuários

### Recursos de Segurança
- **Rota protegida**: Apenas usuários com is_staff ou is_superuser podem acessar
- **Confirmação de exclusão**: Dialog de confirmação antes de excluir usuários
- **Feedback visual**: Loading states e mensagens de erro/sucesso

## Como Usar

1. **Acesse a tela de admin**: Navegue para /admin (apenas para administradores)
2. **Visualize usuários**: A lista mostra todos os usuários com suas informações
3. **Busque usuários**: Use o campo de busca para filtrar por nome ou email
4. **Gerencie status**: Clique no ícone de pessoa para ativar/desativar usuários
5. **Exclua usuários**: Clique no ícone de lixeira para excluir (com confirmação)
6. **Atualize dados**: Use o botão "Atualizar" para recarregar a lista

## Endpoints da API Necessários

O frontend espera os seguintes endpoints no backend:

- GET /api/admin/users/ - Listar todos os usuários
- PATCH /api/admin/users/{id}/activate/ - Ativar usuário
- PATCH /api/admin/users/{id}/deactivate/ - Desativar usuário
- DELETE /api/admin/users/{id}/ - Excluir usuário

## Estrutura de Dados Esperada

Cada usuário deve ter os seguintes campos:
- id: ID único do usuário
- 
ame: Nome do usuário
- email: Email do usuário
- is_active: Boolean indicando se está ativo
- date_joined: Data de cadastro
- is_staff: Boolean indicando se é staff
- is_superuser: Boolean indicando se é superusuário

## Tecnologias Utilizadas

- React 19
- Material-UI (MUI) para interface
- React Router para navegação
- Axios para requisições HTTP
- Context API para gerenciamento de estado
