# Componentes Reutilizáveis

Este diretório contém componentes reutilizáveis que podem ser usados em toda a aplicação para manter consistência visual e funcional.

## Componentes Disponíveis

### 1. _CampoEntrada
Campo de entrada com validação e ícones opcionais.

```jsx
import { _CampoEntrada } from '../components';

<_CampoEntrada
  label="Nome"
  value={nome}
  onChangeText={setNome}
  placeholder="Digite seu nome"
  error={!!errors.nome}
  errorMessage={errors.nome}
  leftIcon={<Ionicons name="person" size={20} color="#666" />}
/>
```

### 2. _Botao
Botão reutilizável com diferentes variantes e tamanhos.

```jsx
import { _Botao } from '../components';

<_Botao
  title="Salvar"
  onPress={handleSave}
  variant="primary" // 'primary', 'secondary', 'danger', 'outline'
  size="medium" // 'small', 'medium', 'large'
  loading={isLoading}
  disabled={!isValid}
  icon={<Ionicons name="save" size={20} color="#fff" />}
/>
```

### 3. _SeletorOpcoes
Seletor de opções com suporte a seleção única ou múltipla.

```jsx
import { _SeletorOpcoes } from '../components';

<_SeletorOpcoes
  label="Tipo de Pagamento"
  options={[
    { value: 'diaria', label: 'Diária', icon: <Ionicons name="calendar" size={20} /> },
    { value: 'pacote', label: 'Por Pacote', icon: <Ionicons name="cube" size={20} /> }
  ]}
  selectedValue={tipoPagamento}
  onSelect={setTipoPagamento}
  orientation="horizontal" // 'horizontal' ou 'vertical'
/>
```

### 4. _ModalConfirmacao
Modal de confirmação com diferentes tipos de alerta.

```jsx
import { _ModalConfirmacao } from '../components';

<_ModalConfirmacao
  visible={showModal}
  title="Confirmar Exclusão"
  message="Tem certeza que deseja excluir este item?"
  confirmText="Excluir"
  cancelText="Cancelar"
  type="danger" // 'default', 'danger', 'warning', 'success'
  onConfirm={handleDelete}
  onCancel={() => setShowModal(false)}
/>
```

### 5. _EstadoCarregamento
Estado de carregamento, erro ou lista vazia.

```jsx
import { _EstadoCarregamento } from '../components';

<_EstadoCarregamento
  isLoading={loading}
  hasError={error}
  isEmpty={data.length === 0}
  onRetry={handleRetry}
  loadingText="Carregando dados..."
  errorText="Erro ao carregar"
  emptyText="Nenhum item encontrado"
/>
```

### 6. _CampoMoeda
Campo de entrada para valores monetários com formatação automática.

```jsx
import { _CampoMoeda } from '../components';

<_CampoMoeda
  label="Valor"
  value={valor}
  onChangeText={setValor}
  prefix="R$"
  maxValue={10000}
  minValue={0}
  error={!!errors.valor}
  errorMessage={errors.valor}
/>
```

### 7. _NavegadorAbas
Navegador de abas com diferentes estilos.

```jsx
import { _NavegadorAbas } from '../components';

<_NavegadorAbas
  tabs={[
    { key: 'postagens', label: 'Postagens' },
    { key: 'anuncios', label: 'Anúncios' }
  ]}
  activeTab={activeTab}
  onTabPress={setActiveTab}
  variant="pills" // 'default', 'pills', 'underline'
  orientation="horizontal" // 'horizontal' ou 'vertical'
/>
```

### 8. _ListaVazia
Componente para exibir quando uma lista está vazia.

```jsx
import { _ListaVazia } from '../components';

<_ListaVazia
  title="Nenhuma postagem ainda"
  subtitle="Seja o primeiro a compartilhar algo!"
  icon="📝"
  actionText="Criar Postagem"
  onActionPress={handleCreatePost}
  showAction={true}
/>
```

## Componentes Consolidados

### _Header (Melhorado)
O componente `_Header.jsx` foi melhorado com funcionalidades do `_Cabecalho.jsx`:
- ✅ Mantém compatibilidade com código existente
- ✅ Adiciona suporte a `rightComponent`
- ✅ Adiciona suporte a `showWelcome` e `welcomeText`
- ✅ Adiciona suporte a cores personalizáveis
- ✅ Inclui `SafeAreaView` para melhor compatibilidade

### _KPICard (Melhorado)
O componente `_KPICard.jsx` foi melhorado com funcionalidades do `_CardEstatistica.jsx`:
- ✅ Mantém compatibilidade com cores nomeadas (green, blue, red, etc.)
- ✅ Adiciona suporte a ícones
- ✅ Adiciona suporte a subtítulos
- ✅ Adiciona suporte a diferentes tamanhos (small, medium, large)
- ✅ Adiciona suporte a variantes (default, outlined, filled)
- ✅ Adiciona suporte a cores personalizadas via hex
- ✅ Adiciona suporte a `onPress` para tornar clicável

## Componentes Existentes (Mantidos)

Os componentes existentes com prefixo `_` foram mantidos para compatibilidade:

- `_ModalCriarAnuncioVeiculo`
- `_ModalCriarPostagem`
- `_CardAnuncioVeiculo`
- `_CardPostagem`
- `_KPICard`
- `_Header`
- `_NavBar_Superior`
- `_NavBar_Inferior`
- `_DataComp`
- `_HoraComp`
- `_CarregamentoError`
- `GoogleSignInButton`

## Como Usar

### Importação Individual
```jsx
import { _CampoEntrada, _Botao } from '../components';
```

### Importação de Arquivo Específico
```jsx
import _CampoEntrada from '../components/_CampoEntrada';
```

## Benefícios

1. **Consistência**: Todos os componentes seguem o mesmo padrão visual
2. **Reutilização**: Reduz duplicação de código
3. **Manutenibilidade**: Mudanças em um local afetam toda a aplicação
4. **Flexibilidade**: Componentes altamente customizáveis
5. **Acessibilidade**: Componentes seguem boas práticas de acessibilidade

## Migração

Para migrar código existente para usar os novos componentes:

1. Identifique padrões repetidos no código
2. Substitua por componentes reutilizáveis
3. Teste a funcionalidade
4. Remova código duplicado

## Exemplo de Migração

**Antes:**
```jsx
<View style={styles.inputContainer}>
  <Text style={styles.label}>Nome</Text>
  <TextInput
    style={[styles.input, error && styles.inputError]}
    value={nome}
    onChangeText={setNome}
    placeholder="Digite seu nome"
  />
  {error && <Text style={styles.errorText}>{error}</Text>}
</View>
```

**Depois:**
```jsx
<_CampoEntrada
  label="Nome"
  value={nome}
  onChangeText={setNome}
  placeholder="Digite seu nome"
  error={!!error}
  errorMessage={error}
/>
```
