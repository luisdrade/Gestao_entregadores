# Estrutura de CSS do Projeto

Este diretório contém todos os arquivos CSS organizados de forma modular para facilitar a manutenção e desenvolvimento.

## Estrutura de Arquivos

```
src/styles/
├── global.css                    # Estilos globais compartilhados
├── pages/                       # CSS específico para cada página
│   ├── Login.css               # Estilos da página de Login
│   ├── Register.css            # Estilos da página de Cadastro
│   ├── AdminDashboard.css      # Estilos do painel administrativo
│   ├── DeliveryDashboard.css   # Estilos do dashboard do entregador
│   ├── DeliveryComunidade.css  # Estilos da comunidade
│   ├── CadastroVeiculo.css     # Estilos do cadastro de veículos
│   └── Relatorios.css          # Estilos dos relatórios
└── README.md                   # Este arquivo
```

## Como Usar

### 1. CSS Global
O arquivo `global.css` contém estilos que se aplicam a toda a aplicação:
- Reset básico
- Tipografia global
- Utilitários comuns
- Animações globais
- Responsividade base

### 2. CSS por Página
Cada página tem seu próprio arquivo CSS com estilos específicos:
- **Login.css**: Estilos para formulário de login, validações, estados de loading
- **Register.css**: Estilos para formulário de cadastro, validações
- **AdminDashboard.css**: Estilos para painel administrativo, tabelas, modais
- **DeliveryDashboard.css**: Estilos para dashboard com gráficos e métricas
- **DeliveryComunidade.css**: Estilos para fórum e anúncios de veículos
- **CadastroVeiculo.css**: Estilos para formulário e lista de veículos
- **Relatorios.css**: Estilos para relatórios detalhados, gráficos, exportação

### 3. Importação nos Componentes
Cada componente importa seu CSS específico:

```jsx
// Exemplo: Login.jsx
import '../styles/pages/Login.css';

// Exemplo: AdminDashboard.jsx
import '../../styles/pages/AdminDashboard.css';
```

## Convenções de Nomenclatura

### Classes CSS
- **Prefixo por página**: `login-`, `register-`, `admin-`, `delivery-`, `cadastro-`, `relatorios-`
- **Componentes**: `.componente-nome` (ex: `.login-form`, `.admin-card`)
- **Estados**: `.componente-estado` (ex: `.login-loading`, `.admin-error`)
- **Modificadores**: `.componente--modificador` (ex: `.card--hover`, `.button--primary`)

### Estrutura de Classes
```css
/* Container principal */
.pagina-container {
  /* estilos do container */
}

/* Componentes */
.pagina-componente {
  /* estilos do componente */
}

/* Estados */
.pagina-componente.estado {
  /* estilos do estado */
}

/* Responsividade */
@media (max-width: 768px) {
  .pagina-componente {
    /* estilos mobile */
  }
}
```

## Características dos Estilos

### 1. Design System
- **Cores**: Paleta consistente baseada no Material-UI
- **Tipografia**: Roboto como fonte principal
- **Espaçamento**: Sistema de 8px (4px, 8px, 16px, 24px, 32px)
- **Bordas**: Border-radius de 8px, 12px, 16px, 20px
- **Sombras**: Sistema de elevação com box-shadow

### 2. Responsividade
- **Mobile First**: Estilos base para mobile
- **Breakpoints**: 480px, 768px, 1200px
- **Grid**: CSS Grid e Flexbox para layouts
- **Componentes**: Adaptáveis a diferentes tamanhos

### 3. Animações
- **Transições**: 0.3s ease para interações
- **Hover**: Efeitos sutis de elevação e cor
- **Loading**: Estados de carregamento animados
- **Entrada**: Animações de fade-in e slide-in

### 4. Acessibilidade
- **Focus**: Indicadores visuais claros
- **Contraste**: Cores com contraste adequado
- **Screen Readers**: Classes `.sr-only` para conteúdo oculto
- **Navegação**: Suporte a navegação por teclado

## Manutenção

### Adicionando Novos Estilos
1. Identifique se é um estilo global ou específico de página
2. Use as convenções de nomenclatura estabelecidas
3. Mantenha a consistência com o design system
4. Teste a responsividade em diferentes dispositivos

### Modificando Estilos Existentes
1. Verifique se a mudança afeta outras páginas
2. Use classes específicas para evitar conflitos
3. Mantenha a compatibilidade com versões anteriores
4. Documente mudanças significativas

### Debugging
1. Use as ferramentas de desenvolvedor do navegador
2. Verifique a especificidade das regras CSS
3. Confirme se os imports estão corretos
4. Teste em diferentes navegadores

## Performance

### Otimizações
- **CSS Modular**: Apenas estilos necessários são carregados
- **Classes Específicas**: Evita conflitos e duplicação
- **Animações**: Usa `transform` e `opacity` para performance
- **Responsividade**: Media queries eficientes

### Boas Práticas
- Evite `!important` desnecessário
- Use classes em vez de seletores complexos
- Mantenha a especificidade baixa
- Organize os estilos em ordem lógica

## Exemplos de Uso

### Página de Login
```css
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-paper {
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Dashboard
```css
.delivery-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  padding: 20px 0;
}

.delivery-card {
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.delivery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}
```

Esta estrutura modular facilita a manutenção, melhora a performance e garante consistência visual em toda a aplicação.















