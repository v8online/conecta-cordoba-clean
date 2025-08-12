const https = require('https');

const VERCEL_TOKEN = 'ifBp6xjryNRzroHEr8rkFXbw';

// Crear deployment desde GitHub
const deployData = JSON.stringify({
  name: 'conecta-cordoba-clean',
  gitSource: {
    type: 'github',
    repo: 'v8online/conecta-cordoba-clean',
    ref: 'main'
  },
  env: {
    DATABASE_URL: 'postgresql://postgres.omvgimkhvhdshghstnxy:252525@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
  },
  projectSettings: {
    framework: 'nextjs',
    buildCommand: 'npm run build',
    devCommand: 'npm run dev',
    installCommand: 'npm install'
  }
});

const options = {
  hostname: 'api.vercel.com',
  port: 443,
  path: '/v13/deployments',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(deployData)
  }
};

console.log('🚀 Iniciando deployment...');

const req = https.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.url) {
        console.log(`✅ Deployment creado exitosamente!`);
        console.log(`🔗 URL: https://${result.url}`);
        console.log(`📝 ID: ${result.id}`);
        console.log(`⚡ Estado: ${result.readyState || 'BUILDING'}`);
      } else if (result.error) {
        console.log(`❌ Error en deployment:`, result.error);
      } else {
        console.log('📋 Respuesta completa:', result);
      }
    } catch (e) {
      console.log('📄 Respuesta raw:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error de conexión: ${e.message}`);
});

req.write(deployData);
req.end();