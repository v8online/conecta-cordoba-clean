const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: 'postgresql://postgres.omvgimkhvhdshghstnxy:252525@aws-0-us-east-1.pooler.supabase.com:6543/postgres'
});

async function setupDatabase() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Base de datos configurada correctamente');
  } catch (error) {
    console.error('❌ Error configurando base de datos:', error.message);
  } finally {
    pool.end();
  }
}

setupDatabase();