/*
  Sincroniza a variável API_BASE_URL do .env da raiz
  para os .env do mobile (Expo) e web (Vite).
*/

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ROOT_ENV = path.join(ROOT, '.env');
const FRONTEND_ENV = path.join(ROOT, 'frontend', '.env');
const WEB_ENV = path.join(ROOT, 'frontend-web', '.env');

function readRootApiBaseUrl() {
  if (!fs.existsSync(ROOT_ENV)) {
    throw new Error(`Arquivo .env não encontrado na raiz: ${ROOT_ENV}`);
  }
  const content = fs.readFileSync(ROOT_ENV, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    if (key === 'API_BASE_URL') {
      const value = rest.join('=');
      return value.trim();
    }
  }
  throw new Error('Variável API_BASE_URL não encontrada no .env raiz');
}

function writeEnv(filePath, lines) {
  const content = lines.join('\n');
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log(`✔ Escrito: ${filePath}`);
}

function main() {
  try {
    const apiBaseUrl = process.env.API_BASE_URL || readRootApiBaseUrl();
    if (!/^https?:\/\//i.test(apiBaseUrl)) {
      throw new Error('API_BASE_URL inválida. Deve incluir protocolo (http/https).');
    }

    const frontendLines = [
      `# Gerado por sync-env.js em ${new Date().toISOString()}`,
      `EXPO_PUBLIC_API_BASE_URL=${apiBaseUrl}`,
    ];
    writeEnv(FRONTEND_ENV, frontendLines);

    const webLines = [
      `# Gerado por sync-env.js em ${new Date().toISOString()}`,
      `VITE_API_BASE_URL=${apiBaseUrl}`,
    ];
    writeEnv(WEB_ENV, webLines);

    console.log('✅ Sincronização concluída. Reinicie os servidores de desenvolvimento.');
  } catch (err) {
    console.error('❌ Erro na sincronização:', err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
