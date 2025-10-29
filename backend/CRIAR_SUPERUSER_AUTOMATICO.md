# 🔧 Criação Automática de Superusuário

## Problema Resolvido
No plano gratuito do Render, não é possível executar comandos Django manualmente. Esta solução cria automaticamente um superusuário quando o servidor Django inicia.

## Como Funciona

### 1. Modificação no `apps.py`
O arquivo `backend/usuarios/apps.py` foi modificado para:
- Executar automaticamente o comando `create_admin` quando o servidor inicia
- Verificar se já existe um superusuário antes de criar um novo
- Funcionar apenas em produção (quando `DEBUG=False`) ou quando a variável `AUTO_CREATE_SUPERUSER` estiver definida

### 2. Comando Personalizado
O comando `create_admin` já existente em `backend/usuarios/management/commands/create_admin.py` cria um superusuário com:
- **Email**: `admin@gmail.com`
- **Senha**: `admin`
- **Nome**: `Administrador`

## Credenciais do Admin

Após o deploy no Render, você pode acessar o admin Django com:

- **URL**: `https://entregasplus.onrender.com/admin/`
- **Email**: `admin@gmail.com`
- **Senha**: `admin`

## Quando o Superusuário é Criado

O superusuário será criado automaticamente quando:
1. O servidor Django iniciar no Render (produção)
2. Não existir nenhum superusuário no banco de dados
3. O banco de dados estiver pronto para receber conexões

## Logs no Render

Você verá nos logs do Render mensagens como:
- `🔧 Criando superusuário automaticamente...`
- `✅ Superusuário criado com sucesso!`
- `✅ Superusuário já existe, pulando criação automática`

## Segurança

⚠️ **IMPORTANTE**: Após criar o superusuário, recomenda-se:
1. Alterar a senha padrão `admin` para algo mais seguro
2. Considerar remover ou comentar o código de criação automática após o primeiro deploy

## Teste Local

Para testar localmente, você pode:
1. Definir `DEBUG=False` no seu `.env`
2. Ou definir `AUTO_CREATE_SUPERUSER=true` no seu `.env`
3. Executar `python manage.py runserver`

## Troubleshooting

Se o superusuário não for criado automaticamente:
1. Verifique os logs do Render para mensagens de erro
2. Confirme que o banco de dados está funcionando
3. Verifique se as migrações foram executadas corretamente
