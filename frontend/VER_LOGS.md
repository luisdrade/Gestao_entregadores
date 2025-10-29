# Como Ver os Logs no App React Native/Expo

## Problema
Os logs (`console.log`, `console.error`, etc.) não estão aparecendo.

## Soluções

### 1. Verificar onde o Metro Bundler está rodando

Quando você executa `npm start` ou `npx expo start`, os logs aparecem no **terminal onde o comando está rodando**.

### 2. Abrir o Expo Dev Tools

Quando você inicia o Expo, aparecem instruções no terminal. Procure por:
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press j │ open debugger
```

Para ver os logs:
- **Pressione `j`** no terminal para abrir o Expo Dev Tools
- **OU** acesse `http://localhost:19002` no navegador
- **OU** use o comando: `npx expo start --dev-client`

### 3. Usar React Native Debugger

Se quiser uma ferramenta mais avançada:
```bash
npm install -g react-native-debugger
```

### 4. Verificar logs no dispositivo físico/emulador

**Android:**
```bash
# Logs do Android
adb logcat | grep ReactNativeJS

# OU logs do Expo
adb logcat | grep Expo
```

**iOS (se estiver usando):**
```bash
# No terminal onde o app está rodando
npx react-native log-ios
```

### 5. Usar Debug remoto

No app, agite o dispositivo ou pressione `Ctrl+M` (Android) ou `Cmd+D` (iOS) e selecione:
- **Debug** ou **Open Debugger**

Isso abrirá o Chrome DevTools.

### 6. Comandos úteis

```bash
# Limpar cache e iniciar novamente
npx expo start --clear

# Iniciar com logs detalhados
npx expo start --dev-client

# Ver apenas logs do React Native
npx react-native start --verbose
```

### 7. Verificar se está em modo de desenvolvimento

No arquivo `app.json`, não deve ter `"production"` em nenhum lugar. O app deve estar em modo desenvolvimento.

### 8. Logs específicos no seu código

Você tem logs em vários lugares:
- `register.jsx` linha 67: `console.log('🔍 Resultado do signUp:', result);`
- `AuthContext.jsx` várias linhas com emojis (🔍, ✅, ⚠️, etc.)

Esses logs aparecem onde o Metro Bundler está rodando.

## Dica Importante

✅ **Os logs SEMPRE aparecem no terminal onde você executou `npm start` ou `npx expo start`**

Se você não está vendo os logs, verifique:
1. O terminal correto onde o Expo está rodando
2. Se o Metro Bundler está realmente executando
3. Se está em modo desenvolvimento (não em produção)

