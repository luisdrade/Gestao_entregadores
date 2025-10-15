# 🚀 Como Usar o Sistema de Despesas

## ⚡ Execução Rápida

### 1. Popular Dados Iniciais
```bash
# Windows
cd backend
.\populate_despesas.ps1

# Linux/Mac
cd backend
./populate_despesas.sh
```

### 2. Testar o Sistema
```bash
cd backend
python test_despesas.py
```

### 3. Iniciar Servidor
```bash
cd backend
python manage.py runserver
```

## 📱 No App Mobile

1. **Acesse**: Cálculos → Financeiro
2. **Veja**: Despesas já cadastradas
3. **Adicione**: Novas despesas conforme necessário
4. **Crie**: Categorias personalizadas se precisar

## 🎯 O que Foi Implementado

### ✅ Dados Iniciais
- **20+ despesas** por entregador
- **5 categorias personalizadas** por entregador
- **11 categorias padrão** específicas para entregadores
- **Valores realistas** (R$ 5,00 a R$ 120,00)
- **Datas variadas** (últimos 30 dias)

### ✅ Categorias Padrão
- Alimentação
- Combustível
- Manutenção do Veículo
- Pedágio
- Estacionamento
- Seguro
- Licenciamento
- **Ferramentas e Equipamentos** (novo)
- **Comunicação (Celular/Internet)** (novo)
- **Uniforme e EPIs** (novo)
- **Documentação e Licenças** (novo)
- Outros

### ✅ Categorias Personalizadas
- Gasolina
- Óleo do Motor
- Pneus
- Lavagem
- Ferramentas

## 🔧 Comandos Úteis

```bash
# Limpar e recriar dados
python manage.py populate_despesas --clear

# Ver estatísticas
python test_despesas.py

# Executar migrações
python manage.py makemigrations
python manage.py migrate
```

## 📊 Exemplo de Dados Criados

### Despesas de Exemplo:
- **Combustível**: "Abastecimento de gasolina - Posto Shell" - R$ 85,50
- **Alimentação**: "Almoço no restaurante - Marmitex" - R$ 18,50
- **Manutenção**: "Troca de óleo do motor" - R$ 45,00
- **Pedágio**: "Pedágio - Rodovia SP-348" - R$ 15,80
- **Ferramentas**: "Compra de caixa térmica para entregas" - R$ 45,00
- **Comunicação**: "Recarga de celular para trabalho" - R$ 30,00
- **Uniforme**: "Compra de uniforme da empresa" - R$ 80,00
- **Documentação**: "Renovação da CNH" - R$ 120,00

## 🎉 Pronto!

Agora você tem um sistema completo de despesas com:
- ✅ Dados iniciais realistas
- ✅ Categorias específicas para entregadores
- ✅ Possibilidade de adicionar novas despesas
- ✅ Categorias personalizadas
- ✅ Relatórios e dashboard
