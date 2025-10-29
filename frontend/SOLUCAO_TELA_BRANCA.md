# Solução: Tela Branca no Emulador

## Problema
O app estava mostrando apenas uma tela branca no emulador.

## Causa
Havia dois sistemas de navegação conflitantes:
1. Expo Router (configurado no `package.json` e `_layout.jsx`)
2. React Navigation (no arquivo `App.js`)

O arquivo `index.js` estava registrando o `App.js` antigo em vez de usar o Expo Router.

## Solução Aplicada ✅

Corrigido o arquivo `index.js` para usar o Expo Router corretamente:

```javascript
import 'expo-router/entry';
```

## Próximos Passos

Para resolver completamente:

### 1. Limpar Cache do Metro
```bash
cd frontend
npx expo start --clear
```

### 2. Rebuild do App Android
```bash
npm run android
```

OU se já está com o Metro rodando, pressione `r` no terminal para reload.

### 3. Verificar se o app está funcionando
Agora você deve ver a tela de login ou o app funcionando normalmente.

## Sobre os Logs

O problema dos logs não estar aparecendo era causado pelo mesmo conflito. Com o app funcionando corretamente, os logs devem aparecer:

### Onde ver os logs:
1. **Terminal do Metro** - onde você executou `npm start`
2. **Expo Dev Tools** - aperte `j` no terminal ou acesse `http://localhost:19002`
3. **Android Logcat** - `adb logcat | grep ReactNativeJS`

## Se ainda tiver problemas

Execute os comandos na ordem:

```bash
# 1. Limpar tudo
cd frontend
npm run start -- --clear

# 2. Em outro terminal, limpar cache do Android
cd android
./gradlew clean

# 3. Voltar e rodar
cd ..
npm run android
```

## Arquivos Modificados
- ✅ `index.js` - Corrigido para usar Expo Router
- ✅ `src/app/_layout.jsx` - Já estava correto
- ✅ Removido `DebugConsole.jsx` temporariamente

