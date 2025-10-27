# 🎨 Método SIMPLES para Alterar a Logo

## Passo a Passo

### 1️⃣ Crie sua logo
- Tamanho recomendado: **512x512 pixels**
- Formato: **PNG com fundo transparente**
- Salve como: `minha-logo.png`

### 2️⃣ Use esta ferramenta online

**Android Asset Studio:** https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

Passos:
1. Clique em "ICONS"
2. Selecione sua imagem
3. Ajuste as configurações se necessário
4. Clique em "DOWNLOAD" (baixo à esquerda)
5. Isso gera um ZIP com todos os tamanhos

### 3️⃣ Extraia e substitua os arquivos

O ZIP extraído terá uma estrutura assim:
```
res/
  └── mipmap-hdpi/
  └── mipmap-mdpi/
  └── mipmap-xhdpi/
  └── mipmap-xxhdpi/
  └── mipmap-xxxhdpi/
```

**Copie as pastas mipmap-** de dentro do ZIP para:
```
frontend/android/app/src/main/res/
```

Substitua os arquivos existentes!

### 4️⃣ Gere o novo APK

No PowerShell:
```powershell
cd frontend/android
.\gradlew clean
.\gradlew assembleRelease
```

Ou use o script existente:
```powershell
cd frontend
.\build-apk.ps1
```

O APK estará em:
```
frontend/android/app/build/outputs/apk/release/
```

---

## ⚡ Alternativa SUPER RÁPIDA (Expo)

Se você usar o Expo, é mais fácil:

1. Substitua este arquivo: `frontend/assets/icon.png` (pela sua logo)

2. Execute:
```bash
cd frontend
npx expo prebuild --clean
```

3. Gere o APK:
```bash
npm run build:android
```

Isso faz TUDO automaticamente! ✨

