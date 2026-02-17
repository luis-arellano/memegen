import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = supabaseUrl.match(/https:\/\/(.+?)\.supabase\.co/)[1];

const createTablesSQL = `
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

-- Create index on template_id for faster queries
CREATE INDEX IF NOT EXISTS idx_memes_template_id ON memes(template_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_memes_created_at ON memes(created_at DESC);
`;

async function createTables() {
  console.log('🔧 Creating tables in Supabase...\n');

  try {
    // Use Supabase Management API
    const response = await fetch(
      `https://${projectRef}.supabase.co/rest/v1/rpc/exec`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({ query: createTablesSQL })
      }
    );

    if (!response.ok) {
      // Try alternative approach using psql REST endpoint
      console.log('Trying alternative method...\n');

      // Use the SQL API endpoint
      const sqlResponse = await fetch(
        `https://${projectRef}.supabase.co/rest/v1/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            query: createTablesSQL
          })
        }
      );

      console.log('Manual SQL execution required.');
      console.log('\n📋 Please run this SQL in Supabase SQL Editor:');
      console.log('─'.repeat(60));
      console.log(createTablesSQL);
      console.log('─'.repeat(60));
      console.log('\nGo to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    }

  } catch (error) {
    console.log('\n📋 SQL to run manually in Supabase:');
    console.log('─'.repeat(60));
    console.log(createTablesSQL);
    console.log('─'.repeat(60));
    console.log('\nGo to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
  }
}

createTables();
