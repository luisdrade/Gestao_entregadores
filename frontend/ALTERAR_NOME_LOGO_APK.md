# 📱 Como Alterar o Nome e Logo do APK

## ✅ 1. Nome do App (ALTERADO)

O nome foi alterado de **"Gestao_entregadores_front"** para **"Gestão Entregadores"**.

**Localização:** `frontend/android/app/src/main/res/values/strings.xml`

---

## 🎨 2. Como Alterar a Logo

### Opção A: Usando uma única imagem (Método Simples)

Se você tem uma imagem PNG, siga estes passos:

1. **Prepare sua logo** (tamanho mínimo 192x192 pixels, PNG transparente)

2. **Use uma ferramenta online para gerar todos os tamanhos:**
   - https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - https://icon.kitchen/
   - https://www.favicon-generator.org/

3. **Ou baixe esta ferramenta:**
   - Android Asset Studio (já integrado ao Android Studio)

### Opção B: Substituir manualmente os arquivos

Substitua os seguintes arquivos em `frontend/android/app/src/main/res/mipmap-*`:

```
mipmap-mdpi/ic_launcher.webp (48x48)
mipmap-hdpi/ic_launcher.webp (72x72)
mipmap-xhdpi/ic_launcher.webp (96x96)
mipmap-xxhdpi/ic_launcher.webp (144x144)
mipmap-xxxhdpi/ic_launcher.webp (192x192)

mipmap-mdpi/ic_launcher_foreground.webp (48x48)
mipmap-hdpi/ic_launcher_foreground.webp (72x72)
mipmap-xhdpi/ic_launcher_foreground.webp (96x96)
mipmap-xxhdpi/ic_launcher_foreground.webp (144x144)
mipmap-xxxhdpi/ic_launcher_foreground.webp (192x192)

mipmap-mdpi/ic_launcher_round.webp (48x48)
mipmap-hdpi/ic_launcher_round.webp (72x72)
mipmap-xhdpi/ic_launcher_round.webp (96x96)
mipmap-xxhdpi/ic_launcher_round.webp (144x144)
mipmap-xxxhdpi/ic_launcher_round.webp (192x192)
```

### Opção C: Atualizar o app.json (Recomendado para Expo)

No arquivo `frontend/app.json`, linha 8:
```json
"icon": "assets/icon.png",
```

**Substitua o arquivo** `frontend/assets/icon.png` pela sua logo.

Depois, execute o comando para regenerar os ícones:
```bash
cd frontend
npx expo install expo
npx expo prebuild --clean
```

Isso vai regenerar automaticamente todos os tamanhos de ícone para Android.

---

## 🚀 3. Gerar Novo APK

Após alterar o nome e os ícones, gere um novo APK:

### Windows:
```powershell
cd frontend
npm run android -- --variant=release
```

Ou use o script já existente:
```powershell
cd frontend/android
.\gradlew assembleRelease
```

### Alternativa com Expo:
```bash
cd frontend
eas build --platform android --profile production
```

O APK será gerado em: `frontend/android/app/build/outputs/apk/release/`

---

## 📋 Resumo das Alterações

- ✅ **Nome alterado** no arquivo `strings.xml`
- 📝 **Próximos passos:**
  1. Substituir os ícones nos arquivos `mipmap-*`
  2. Ou substituir `frontend/assets/icon.png` e rodar `npx expo prebuild --clean`
  3. Gerar novo APK

---

## 💡 Dicas

- Use ícones com fundo transparente
- Evite textos muito pequenos (eles ficam ilegíveis)
- Teste em diferentes dispositivos Android
- Mantenha uma cópia dos ícones antigos antes de alterar

