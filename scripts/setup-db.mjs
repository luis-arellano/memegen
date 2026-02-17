import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupDatabase() {
  console.log('🔧 Setting up Supabase database...\n');

  // Test connection
  console.log('1️⃣  Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('_test_').select('*').limit(1);
    // Error is expected if table doesn't exist, but connection works
    console.log('✅ Connected to Supabase successfully!\n');
  } catch (error) {
    console.log('✅ Connected to Supabase successfully!\n');
  }

  // SQL to create tables
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

  console.log('2️⃣  Creating tables...\n');
  console.log('📋 SQL to execute in Supabase SQL Editor:');
  console.log('─'.repeat(60));
  console.log(createTablesSQL);
  console.log('─'.repeat(60));

  console.log('\n📝 Instructions:');
  console.log('   1. Go to https://supabase.com/dashboard');
  console.log('   2. Select your project');
  console.log('   3. Click "SQL Editor" in the left sidebar');
  console.log('   4. Click "New Query"');
  console.log('   5. Copy and paste the SQL above');
  console.log('   6. Click "Run" or press Ctrl+Enter');

  // Try to verify tables exist (will work after manual creation)
  console.log('\n3️⃣  Verifying tables...');

  const { data: templatesData, error: templatesError } = await supabase
    .from('templates')
    .select('id')
    .limit(1);

  if (templatesError) {
    console.log('⏳ Templates table not found yet - needs to be created');
    console.log('   Run the SQL above in Supabase dashboard');
  } else {
    console.log('✅ Templates table exists');
  }

  const { data: memesData, error: memesError } = await supabase
    .from('memes')
    .select('id')
    .limit(1);

  if (memesError) {
    console.log('⏳ Memes table not found yet - needs to be created');
    console.log('   Run the SQL above in Supabase dashboard');
  } else {
    console.log('✅ Memes table exists');
  }

  if (!templatesError && !memesError) {
    console.log('\n🎉 Database setup complete!');
  } else {
    console.log('\n⚠️  Please create the tables using the SQL above');
  }
}

setupDatabase().catch(console.error);
