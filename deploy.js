const https = require('https');
const fs = require('fs');

const VERCEL_TOKEN = 'ifBp6xjryNRzroHEr8rkFXbw';
const PROJECT_NAME = 'conecta-cordoba-clean';

const deployData = JSON.stringify({
  name: PROJECT_NAME,
  gitSource: {
    type: 'github',
    repo: 'v8online/conecta-cordoba-clean',
    ref: 'main'
  },
  env: {
    DATABASE_URL: 'postgresql://postgres.omvgimkhvhdshghstnxy:252525@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
  },
  projectSettings: {
    framework: 'nextjs'
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

const req = https.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.url) {
        console.log(`✅ Deployment created: ${result.url}`);
        console.log(`🔗 Live URL: https://${result.url}`);
      } else {
        console.log('❌ Deployment response:', result);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Request error: ${e.message}`);
});

req.write(deployData);
req.end();