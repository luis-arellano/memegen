import pkg from 'pg';
const { Client } = pkg;
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse .env file
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  // Handle both KEY=value and KEY: value formats
  let match = line.match(/^([^#=:]+):?\s*(.*)$/);
  if (match && match[2]) {
    const key = match[1].trim();
    const value = match[2].trim();
    if (value) env[key] = value;
  }
});

// Construct PostgreSQL connection string
// Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const projectRef = 'ebmbudezyioutjrnpwxd';
const password = env.SUPABASE_DB_PASSWORD || 'PYJPjb9qwXa7vXPg';

const connectionString = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

const SQL = `
-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memes table
CREATE TABLE IF NOT EXISTS memes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
  top_text TEXT,
  bottom_text TEXT,
  image_url TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_memes_template_id ON memes(template_id);
CREATE INDEX IF NOT EXISTS idx_memes_created_at ON memes(created_at DESC);
`;

async function migrate() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔧 Connecting to Supabase database...\n');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    console.log('📝 Executing migration SQL...\n');
    await client.query(SQL);

    console.log('✅ Tables created successfully!\n');

    // Verify tables exist
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('templates', 'memes')
      ORDER BY table_name;
    `);

    console.log('📊 Tables in database:');
    result.rows.forEach(row => {
      console.log(`   ✅ ${row.table_name}`);
    });

    console.log('\n🎉 Database migration complete!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

migrate();
