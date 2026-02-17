import { chromium } from '@playwright/test';
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
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim().replace(':', '');
    const value = match[2].trim();
    env[key] = value;
  }
});

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

async function createTablesViaAPI() {
  console.log('🔧 Creating Supabase tables programmatically...\n');

  // Use Supabase's PostgREST directly
  const projectRef = 'ebmbudezyioutjrnpwxd';

  // Try using fetch to execute SQL via Supabase REST API
  // Supabase exposes a query interface through PostgREST
  try {
    console.log(' Attempting to create tables via Supabase API...\n');

    // We'll need to use the PostgreSQL connection string approach
    // For now, let's just output the SQL and verify manually

    console.log('📋 SQL to execute:');
    console.log('─'.repeat(60));
    console.log(SQL);
    console.log('─'.repeat(60));

    // Save SQL to file for easy execution
    const fs = await import('fs');
    fs.writeFileSync(join(__dirname, 'schema.sql'), SQL);
    console.log('\n✅ SQL saved to scripts/schema.sql');

    console.log('\n📝 To create tables:');
    console.log('   Option 1: Manual via Supabase Dashboard');
    console.log('   - Go to: https://supabase.com/dashboard/project/' + projectRef + '/sql/new');
    console.log('   - Copy and paste the SQL above');
    console.log('   - Click "Run"');
    console.log('\n   Option 2: Use psql (if you have PostgreSQL client)');
    console.log('   - Get connection string from Supabase dashboard');
    console.log('   - Run: psql "connection-string" < scripts/schema.sql');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

createTablesViaAPI();
