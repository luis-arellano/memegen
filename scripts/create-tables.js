import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse .env file manually
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

if (!supabaseUrl || !dbPassword) {
  console.error('❌ Missing database credentials');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_DB_PASSWORD');
  process.exit(1);
}

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)[1];

// Construct PostgreSQL connection string (using direct connection, not pooler)
const connectionString = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

const SQL = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

async function createTables() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL database...\n');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('📋 Creating tables...\n');
    await client.query(SQL);
    console.log('✅ Tables created successfully!\n');

    // Verify tables exist
    console.log('🔍 Verifying tables...\n');

    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('templates', 'memes')
      ORDER BY table_name;
    `);

    console.log('📊 Tables found:');
    tablesResult.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });

    if (tablesResult.rows.length === 2) {
      console.log('\n🎉 Database setup complete!');
      return true;
    } else {
      console.log('\n⚠️  Expected 2 tables, found:', tablesResult.rows.length);
      return false;
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('   Error code:', error.code);
    }
    return false;
  } finally {
    await client.end();
  }
}

createTables().then(success => {
  process.exit(success ? 0 : 1);
});
