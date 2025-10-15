# 💰 Sistema de Despesas - Guia Completo

## 📋 Visão Geral

O sistema de despesas permite que entregadores registrem e categorizem seus gastos relacionados ao trabalho, facilitando o controle financeiro e cálculo de lucros.

## 🚀 Como Popular Dados Iniciais

### Opção 1: Script Automático (Recomendado)

**Windows:**
```powershell
cd backend
.\populate_despesas.ps1
```

**Linux/Mac:**
```bash
cd backend
./populate_despesas.sh
```

### Opção 2: Comando Manual

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py populate_despesas
```

### Opção 3: Limpar e Recriar

```bash
python manage.py populate_despesas --clear
```

## 📊 Dados Iniciais Incluídos

### Categorias Padrão
- **Alimentação** - Refeições e lanches
- **Combustível** - Gasolina, etanol, diesel
- **Manutenção do Veículo** - Óleo, filtros, revisões
- **Pedágio** - Taxas de rodovias
- **Estacionamento** - Taxas de estacionamento
- **Seguro** - Seguro do veículo
- **Licenciamento** - Taxas de licenciamento
- **Ferramentas e Equipamentos** - Caixas térmicas, cordas
- **Comunicação** - Celular, internet
- **Uniforme e EPIs** - Roupas de trabalho, equipamentos de segurança
- **Documentação** - CNH, licenças
- **Outros** - Gastos diversos

### Categorias Personalizadas Criadas
- **Gasolina** - Gastos específicos com gasolina
- **Óleo do Motor** - Troca de óleo e filtros
- **Pneus** - Compra e manutenção de pneus
- **Lavagem** - Lavagem e limpeza do veículo
- **Ferramentas** - Ferramentas e equipamentos de trabalho

### Despesas de Exemplo
- **20+ despesas** por entregador com valores realistas
- **Datas variadas** (últimos 30 dias)
- **Valores típicos** de entregador (R$ 5,00 a R$ 120,00)
- **Descrições detalhadas** para cada gasto

## 📱 Como Usar no App

### 1. Visualizar Despesas
- Acesse **"Cálculos"** → **"Financeiro"**
- Veja todas as despesas já cadastradas
- Use filtros por categoria e período

### 2. Adicionar Nova Despesa
- Clique em **"Adicionar Despesa"**
- Escolha uma categoria padrão ou personalizada
- Preencha: descrição, valor, data
- Salve a despesa

### 3. Criar Categoria Personalizada
- Na tela de despesas, clique em **"Adicionar despesa"**
- Selecione **"Adicionar despesa"** novamente
- Preencha nome e descrição da categoria
- Salve e use na próxima despesa

## 🔧 Estrutura Técnica

### Modelos
- **Despesa** - Registro individual de gastos
- **CategoriaDespesa** - Categorias personalizadas por usuário
- **RegistroTrabalho** - Registro de dias trabalhados

### APIs Disponíveis
- `POST /registro/api/registro-despesa/` - Criar despesa
- `GET /registro/api/registro-despesa/` - Listar despesas
- `GET /registro/api/categorias-despesas/` - Listar categorias
- `POST /registro/api/categorias-despesas/` - Criar categoria

### Validações
- **Campos obrigatórios**: tipo_despesa, descricao, valor, data
- **Valor**: deve ser positivo
- **Data**: formato válido
- **Categoria personalizada**: deve existir e estar ativa

## 📈 Relatórios e Dashboard

### Relatórios Disponíveis
- **Relatório de Despesas** - Lista detalhada por período
- **Relatório de Trabalho** - Ganhos vs despesas
- **Dashboard Financeiro** - Resumo visual dos gastos

### Métricas Calculadas
- **Total de despesas** por período
- **Despesas por categoria**
- **Média de gastos** diários/semanais
- **Lucro líquido** (ganhos - despesas)

## 🛠️ Personalização

### Adicionar Novas Categorias Padrão
1. Edite `backend/registro_entregadespesa/models.py`
2. Adicione na lista `CATEGORIA_CHOICES`
3. Execute migrações: `python manage.py makemigrations && python manage.py migrate`

### Modificar Dados Iniciais
1. Edite `backend/registro_entregadespesa/management/commands/populate_despesas.py`
2. Modifique a lista `despesas_iniciais`
3. Execute: `python manage.py populate_despesas --clear`

## 🚨 Troubleshooting

### Erro: "Nenhum entregador encontrado"
- Crie usuários primeiro no sistema
- Verifique se os usuários estão ativos

### Erro: "Categoria não encontrada"
- Execute o comando de popular despesas
- Verifique se as categorias foram criadas

### Dados não aparecem no app
- Verifique se o usuário está logado
- Confirme se as APIs estão funcionando
- Verifique logs do servidor

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do servidor
2. Confirme se as migrações foram executadas
3. Teste as APIs diretamente
4. Verifique a documentação da API
