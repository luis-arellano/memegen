import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse .env file
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+):\s*(.*)$|^([^#=]+)=(.*)$/);
  if (match) {
    const key = (match[1] || match[3])?.trim();
    const value = (match[2] || match[4])?.trim();
    if (key && value) {
      env[key] = value;
    }
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = env.SUPABASE_DB_PASSWORD;
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)[1];
const connectionString = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

const client = new Client({ connectionString });

async function checkTemplates() {
  try {
    await client.connect();
    console.log('Connected to database via PostgreSQL\n');

    const result = await client.query('SELECT * FROM templates ORDER BY created_at ASC');
    console.log(`Templates found: ${result.rows.length}\n`);

    if (result.rows.length > 0) {
      console.log('Templates:');
      result.rows.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name} (${template.category})`);
      });
    }

    await client.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkTemplates();
