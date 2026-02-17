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

async function fixRLSPolicies() {
  try {
    await client.connect();
    console.log('🔌 Connected to database\n');

    // Enable RLS on templates table if not already enabled
    console.log('📋 Enabling RLS on templates table...');
    await client.query('ALTER TABLE templates ENABLE ROW LEVEL SECURITY;');

    // Drop existing policy if it exists
    console.log('🗑️  Dropping existing policy (if any)...');
    await client.query('DROP POLICY IF EXISTS "Allow public read access" ON templates;');

    // Create policy to allow public read access
    console.log('✅ Creating public read access policy...');
    await client.query(`
      CREATE POLICY "Allow public read access"
      ON templates
      FOR SELECT
      TO anon, authenticated
      USING (true);
    `);

    // Do the same for memes table
    console.log('\n📋 Enabling RLS on memes table...');
    await client.query('ALTER TABLE memes ENABLE ROW LEVEL SECURITY;');

    console.log('🗑️  Dropping existing policy (if any)...');
    await client.query('DROP POLICY IF EXISTS "Allow public read access" ON memes;');

    console.log('✅ Creating public read access policy...');
    await client.query(`
      CREATE POLICY "Allow public read access"
      ON memes
      FOR SELECT
      TO anon, authenticated
      USING (true);
    `);

    // Also allow public insert on memes
    console.log('🗑️  Dropping existing insert policy (if any)...');
    await client.query('DROP POLICY IF EXISTS "Allow public insert access" ON memes;');

    console.log('✅ Creating public insert access policy...');
    await client.query(`
      CREATE POLICY "Allow public insert access"
      ON memes
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
    `);

    console.log('\n✅ RLS policies configured successfully!');
    console.log('   - templates: public read access');
    console.log('   - memes: public read and insert access');

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixRLSPolicies();
