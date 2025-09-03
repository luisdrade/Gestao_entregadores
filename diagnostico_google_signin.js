#!/usr/bin/env node

/**
 * Script de Diagnóstico para Google Sign-In
 * Execute: node diagnostico_google_signin.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 DIAGNÓSTICO DO GOOGLE SIGN-IN');
console.log('================================');

// 1. Verificar configuração
console.log('\n1. 📋 Verificando configuração...');
try {
  const configPath = path.join(__dirname, 'frontend/src/config/googleConfig.js');
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  if (configContent.includes('YOUR_WEB_CLIENT_ID')) {
    console.log('❌ WEB_CLIENT_ID ainda não foi configurado');
  } else if (configContent.includes('424994830272')) {
    console.log('✅ WEB_CLIENT_ID configurado');
  } else {
    console.log('⚠️ WEB_CLIENT_ID pode estar incorreto');
  }
  
  if (configContent.includes('YOUR_IOS_CLIENT_ID')) {
    console.log('❌ IOS_CLIENT_ID ainda não foi configurado');
  } else if (configContent.includes('424994830272')) {
    console.log('✅ IOS_CLIENT_ID configurado');
  } else {
    console.log('⚠️ IOS_CLIENT_ID pode estar incorreto');
  }
} catch (error) {
  console.log('❌ Erro ao ler configuração:', error.message);
}

// 2. Verificar dependências
console.log('\n2. 📦 Verificando dependências...');
try {
  const packagePath = path.join(__dirname, 'frontend/package.json');
  const packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  if (packageJson.dependencies['@react-native-google-signin/google-signin']) {
    console.log('✅ @react-native-google-signin/google-signin instalado');
  } else {
    console.log('❌ @react-native-google-signin/google-signin não encontrado');
  }
} catch (error) {
  console.log('❌ Erro ao verificar dependências:', error.message);
}

// 3. Verificar arquivos de implementação
console.log('\n3. 📁 Verificando arquivos de implementação...');
const filesToCheck = [
  'frontend/src/services/googleAuth.js',
  'frontend/src/components/GoogleSignInButton.jsx',
  'frontend/src/context/AuthContext.jsx',
  'frontend/src/app/index.jsx'
];

filesToCheck.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
});

// 4. Verificar backend
console.log('\n4. 🔧 Verificando backend...');
const backendFiles = [
  'backend/usuarios/views.py',
  'backend/usuarios/models.py',
  'backend/usuarios/urls.py'
];

backendFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} existe`);
  } else {
    console.log(`❌ ${file} não encontrado`);
  }
});

// 5. Verificar app.json
console.log('\n5. 📱 Verificando app.json...');
try {
  const appJsonPath = path.join(__dirname, 'frontend/app.json');
  const appJsonContent = fs.readFileSync(appJsonPath, 'utf8');
  const appJson = JSON.parse(appJsonContent);
  
  console.log(`✅ Package name: ${appJson.expo.android.package}`);
  console.log(`✅ Bundle identifier: ${appJson.expo.ios.bundleIdentifier}`);
  
  // Verificar se o plugin do Google Sign-In está configurado
  const plugins = appJson.expo.plugins || [];
  const googlePlugin = plugins.find(p => 
    Array.isArray(p) && p[0] === '@react-native-google-signin/google-signin'
  );
  
  if (googlePlugin) {
    console.log('✅ Plugin Google Sign-In configurado no app.json');
  } else {
    console.log('❌ Plugin Google Sign-In não configurado no app.json');
  }
} catch (error) {
  console.log('❌ Erro ao verificar app.json:', error.message);
}

// 6. Checklist de problemas comuns
console.log('\n6. 🔍 CHECKLIST DE PROBLEMAS COMUNS:');
console.log('=====================================');

console.log('\n❓ O erro acontece quando você:');
console.log('   - Clica no botão "Continuar com Google"?');
console.log('   - Inicia o aplicativo?');
console.log('   - Faz login?');

console.log('\n❓ Qual mensagem de erro aparece?');
console.log('   - "Google Play Services not available"?');
console.log('   - "Invalid client ID"?');
console.log('   - "Network error"?');
console.log('   - "User cancelled"?');
console.log('   - Outro erro?');

console.log('\n❓ Você está testando em:');
console.log('   - Dispositivo físico?');
console.log('   - Emulador?');
console.log('   - Expo Go?');

console.log('\n❓ O backend está rodando?');
console.log('   - Execute: cd backend && python manage.py runserver');

console.log('\n❓ O frontend está rodando?');
console.log('   - Execute: cd frontend && npm start');

// 7. Comandos para testar
console.log('\n7. 🚀 COMANDOS PARA TESTAR:');
console.log('===========================');

console.log('\n# 1. Verificar SHA-1 (Windows):');
console.log('keytool -list -v -keystore %USERPROFILE%\\.android\\debug.keystore -alias androiddebugkey -storepass android -keypass android');

console.log('\n# 2. Verificar SHA-1 (Linux/Mac):');
console.log('keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android');

console.log('\n# 3. Iniciar backend:');
console.log('cd backend && python manage.py runserver');

console.log('\n# 4. Iniciar frontend:');
console.log('cd frontend && npm start');

console.log('\n# 5. Testar endpoints:');
console.log('curl -X POST http://localhost:8000/api/auth/google-login/');

console.log('\n8. 📖 PRÓXIMOS PASSOS:');
console.log('=====================');
console.log('1. Execute os comandos acima');
console.log('2. Verifique se o SHA-1 está correto no Google Console');
console.log('3. Teste em dispositivo físico (não emulador)');
console.log('4. Verifique se o Google Play Services está instalado');
console.log('5. Consulte: GOOGLE_SIGNIN_SETUP.md');

console.log('\n💡 DICA: Se o erro persistir, compartilhe a mensagem de erro exata!');


