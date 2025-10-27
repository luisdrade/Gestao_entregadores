# 🔍 Como Ver os Logs de Debug no Emulador/Simulador

## 📱 Android (Android Studio Emulador)

### Método 1: Metro Bundler (Recomendado)
Ao rodar o app com `npm start` ou `expo start`, os logs aparecem automaticamente no terminal Metro.

### Método 2: Logcat (Logs do Android)
```bash
# No terminal, com o emulador rodando:
adb logcat | grep -E "ReactNativeJS|gestaoentregadores|expo"
```

Ou abra o Android Studio > View > Tool Windows > Logcat e filtre por:
- Tag: `ReactNativeJS`
- Package: `com.luisdrade.gestaoentregadores`

### Método 3: Ver logs completos
```bash
# Ver todos os logs do app
adb logcat -s ReactNativeJS:* *:S
```

## 🍎 iOS (Xcode Simulador)

### Método 1: Metro Bundler (Recomendado)
Ao rodar `npm start`, os logs aparecem automaticamente.

### Método 2: Console do macOS
Abra o aplicativo **Console** no macOS e filtre por:
- Process: Expo Go (ou o nome do seu app)
- OU filtre por texto: "ReactNativeJS"

### Método 3: Terminal
```bash
# Ver logs do simulador iOS
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Expo"' --level debug
```

## ⚡ Comandos Úteis

### Filtrar apenas logs do seu app:
```bash
# Android
adb logcat | grep -E "gestaoentregadores"

# iOS
xcrun simctl spawn booted log stream --predicate 'subsystem == "com.luisdrade.gestaoentregadores"'
```

### Limpar logs antigos:
```bash
# Android
adb logcat -c

# iOS (reinicie o simulador)
```

## 🐛 Logs que Você Verá Agora

Com as melhorias feitas, você verá:

### ✅ No Sucesso:
```
📤 AuthContext - Enviando dados de cadastro: {...}
📤 AuthContext - Endpoint: /api/auth/register/
✅ AuthContext - Resposta do backend: {...}
📧 AuthContext - Requer verificação por email
```

### ❌ No Erro:
```
❌ AuthContext - Erro no cadastro:
   Tipo: 400
   Status: Bad Request
   Dados: {
     "details": {
       "email": ["Este campo é obrigatório."]
     }
   }
   Mensagem: Request failed with status code 400

📤 Enviando dados ao backend: {...}
🔍 Resultado do signUp: { success: false, error: {...} }
❌ Erro no cadastro - Resultado completo: {...}
```

## 📝 Debug Passo a Passo

1. **Inicie o app no emulador**
   ```bash
   cd frontend
   npm start
   # Ou
   expo start
   ```

2. **Deixe o Metro bundler aberto** - é nele que aparecem os logs principais

3. **Tente fazer o cadastro** com os dados que estão falhando

4. **Procure pelos emojis no console:**
   - 📤 = Enviando dados
   - ✅ = Sucesso
   - ❌ = Erro
   - 🔍 = Debug

5. **Copie o erro completo** e me envie!

## 💡 Dicas

- **Logs mais verbosos:** Adicione no terminal: `EXPO_PUBLIC_ENABLE_HTTP_LOGS=true`
- **Limpar cache:** Se os logs não aparecerem, tente:
  ```bash
  cd frontend
  npx expo start --clear
  ```

## 🔗 Links Úteis

- [Documentação do Expo Logs](https://docs.expo.dev/workflow/debugging/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

