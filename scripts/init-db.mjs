import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env');
const envContent = readFileSync(envPath, 'utf-8');

// Parse .env manually
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim().replace(':', '');
    const value = match[2].trim();
    env[key] = value;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Initializing Supabase database...\n');
console.log('URL:', supabaseUrl);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initDatabase() {
  // First, let's test if we can create a simple entry to verify connection
  console.log('1️⃣  Testing connection...');

  // Since we can't execute raw SQL easily, let's verify the tables exist by trying to query them
  // If they don't exist, we'll provide instructions

  const { data: templatesTest, error: templatesError } = await supabase
    .from('templates')
    .select('id')
    .limit(1);

  const { data: memesTest, error: memesError } = await supabase
    .from('memes')
    .select('id')
    .limit(1);

  if (templatesError || memesError) {
    console.log('\n❌ Tables do not exist yet\n');
    console.log('Please create them using the Supabase dashboard:');
    console.log('\n1. Go to: https://supabase.com/dashboard/project/ebmbudezyioutjrnpwxd/sql/new');
    console.log('2. Run this SQL:\n');
    console.log(`
-- Create templates table
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memes table
CREATE TABLE memes (
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
CREATE INDEX idx_memes_template_id ON memes(template_id);
CREATE INDEX idx_memes_created_at ON memes(created_at DESC);
    `);
    console.log('\n3. After running, execute this script again to verify\n');
    return false;
  }

  console.log('✅ Templates table exists');
  console.log('✅ Memes table exists');
  console.log('\n🎉 Database is ready!\n');
  return true;
}

initDatabase().catch(console.error);
