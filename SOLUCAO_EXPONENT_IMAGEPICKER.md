# 🔧 Solução para Erro: Cannot find native module 'ExponentImagePicker'

## 🚨 **Problema Identificado**
```
ERROR  Error: Cannot find native module 'ExponentImagePicker', js engine: hermes
```

## 📋 **Causas Possíveis**

1. **Módulo não instalado corretamente**
2. **Versão incompatível do Expo**
3. **Cache corrompido**
4. **Configuração incorreta do app.json**
5. **Problemas com o desenvolvimento**

## 🔧 **Soluções Passo a Passo**

### **1. Verificar Instalação do expo-image-picker**

```bash
# Navegar para o diretório frontend
cd frontend

# Verificar se está instalado
npm list expo-image-picker

# Se não estiver instalado, instalar
npm install expo-image-picker@~16.1.4

# Ou usar yarn
yarn add expo-image-picker@~16.1.4
```

### **2. Limpar Cache e Reinstalar**

```bash
# Limpar cache do npm
npm cache clean --force

# Remover node_modules
rm -rf node_modules
rm package-lock.json

# Reinstalar dependências
npm install

# Limpar cache do Expo
npx expo install --fix
```

### **3. Verificar Versão do Expo**

```bash
# Verificar versão do Expo CLI
npx expo --version

# Verificar versão do SDK
npx expo doctor
```

### **4. Configurar app.json Corretamente**

Certifique-se de que o `app.json` tenha as configurações corretas:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "O app precisa acessar suas fotos para selecionar uma imagem de perfil.",
          "cameraPermission": "O app precisa acessar sua câmera para tirar uma foto de perfil."
        }
      ]
    ]
  }
}
```

### **5. Rebuild do App**

```bash
# Para desenvolvimento
npx expo start --clear

# Para Android
npx expo run:android

# Para iOS
npx expo run:ios
```

### **6. Verificar package.json**

Certifique-se de que o `package.json` tenha:

```json
{
  "dependencies": {
    "expo": "~53.0.22",
    "expo-image-picker": "~16.1.4"
  }
}
```

## 🚀 **Solução Alternativa - Usar Importação Condicional**

Se o problema persistir, podemos usar uma abordagem alternativa no código:

```javascript
// Em perfil.jsx
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

// Importação condicional do ImagePicker
let ImagePicker = null;

const loadImagePicker = async () => {
  try {
    ImagePicker = await import('expo-image-picker');
    return true;
  } catch (error) {
    console.error('Erro ao carregar ImagePicker:', error);
    return false;
  }
};

const handleUploadPhoto = async () => {
  const isAvailable = await loadImagePicker();
  
  if (!isAvailable) {
    Alert.alert(
      'Funcionalidade Indisponível',
      'O seletor de imagens não está disponível no momento. Tente novamente mais tarde.',
      [{ text: 'OK' }]
    );
    return;
  }

  // Resto do código...
};
```

## 🔍 **Verificações Adicionais**

### **1. Verificar se está usando Expo Go ou Development Build**

```bash
# Se estiver usando Expo Go, pode haver limitações
# Recomendado usar Development Build para funcionalidades nativas

# Criar Development Build
npx expo prebuild
```

### **2. Verificar Configurações do Metro**

Crie ou atualize o `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

module.exports = config;
```

### **3. Verificar Versões Compatíveis**

```bash
# Verificar compatibilidade
npx expo install --check
```

## 🆘 **Se Nada Funcionar**

### **1. Usar Alternativa Temporária**

```javascript
// Função temporária sem ImagePicker
const handleUploadPhoto = () => {
  Alert.alert(
    'Upload de Foto',
    'Funcionalidade temporariamente indisponível. Use a versão web para upload de fotos.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Abrir Web', 
        onPress: () => {
          // Abrir versão web
          Linking.openURL('http://seu-backend.com/admin');
        }
      }
    ]
  );
};
```

### **2. Usar WebView para Upload**

```javascript
import { WebView } from 'react-native-webview';

const UploadWebView = () => {
  return (
    <WebView
      source={{ uri: 'http://seu-backend.com/upload-foto' }}
      style={{ flex: 1 }}
    />
  );
};
```

## ✅ **Comandos de Verificação**

```bash
# 1. Verificar instalação
npm list expo-image-picker

# 2. Verificar versões
npx expo --version
npx expo doctor

# 3. Limpar e reinstalar
npm cache clean --force
rm -rf node_modules
npm install

# 4. Rebuild
npx expo start --clear
```

## 📱 **Configurações Específicas por Plataforma**

### **Android (android/app/src/main/AndroidManifest.xml)**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### **iOS (ios/YourApp/Info.plist)**
```xml
<key>NSCameraUsageDescription</key>
<string>O app precisa acessar sua câmera para tirar uma foto de perfil.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>O app precisa acessar suas fotos para selecionar uma imagem de perfil.</string>
```

## 🎯 **Próximos Passos**

1. **Execute os comandos de limpeza**
2. **Reinstale o expo-image-picker**
3. **Configure o app.json**
4. **Rebuild o app**
5. **Teste novamente**

Se o problema persistir, podemos implementar uma solução alternativa temporária enquanto resolvemos o problema do módulo nativo.

---

**Status:** 🔧 Em resolução
**Prioridade:** Alta
**Impacto:** Funcionalidade de upload de fotos
