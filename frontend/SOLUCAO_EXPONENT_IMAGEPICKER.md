# Solução para o Erro do ExponentImagePicker

## Problema
```
ERROR Error: Cannot find native module 'ExponentImagePicker', js engine: hermes
```

## Soluções

### 1. Rebuild do App (Recomendado)
O problema geralmente ocorre quando o módulo nativo não foi linkado corretamente após a instalação.

```bash
# Limpar cache
npx expo start --clear

# Ou rebuild completo
npx expo run:android --clear
# ou
npx expo run:ios --clear
```

### 2. Verificar Configuração
O `app.json` já está configurado corretamente com:
- Plugin do expo-image-picker
- Permissões necessárias
- Configurações de iOS e Android

### 3. Reinstalar Dependências
```bash
# Remover node_modules e reinstalar
rm -rf node_modules
npm install

# Ou com yarn
yarn install
```

### 4. Verificar Versão do Expo
```bash
npx expo install --fix
```

### 5. Solução Temporária
Atualmente, o componente `_ModalCriarAnuncioVeiculo.jsx` está configurado para mostrar um alerta quando o usuário tenta selecionar uma imagem, permitindo que o app funcione normalmente.

## Para Reativar o Image Picker

1. Resolva o problema do módulo nativo usando uma das soluções acima
2. Descomente as linhas no arquivo `_ModalCriarAnuncioVeiculo.jsx`:
   - Linha 14: `import * as ImagePicker from 'expo-image-picker';`
   - Linhas 31-47: Todo o código comentado da função `selecionarImagem`

## Status Atual
✅ App funcionando sem erros  
✅ Comunidade implementada  
✅ Componentes traduzidos  
⚠️ Image picker temporariamente desabilitado  

## Próximos Passos
1. Testar o app para garantir que está funcionando
2. Resolver o problema do ExponentImagePicker
3. Reativar a funcionalidade de seleção de imagens
