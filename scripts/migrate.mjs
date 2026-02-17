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
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('Creating database tables...');

  // Create templates table
  const templatesSQL = `
    CREATE TABLE IF NOT EXISTS templates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      image_url TEXT NOT NULL,
      category TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  // Create memes table
  const memesSQL = `
    CREATE TABLE IF NOT EXISTS memes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      template_id UUID REFERENCES templates(id),
      top_text TEXT,
      bottom_text TEXT,
      image_url TEXT NOT NULL,
      upvotes INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;

  try {
    // Execute SQL using RPC or direct query
    const { error: templatesError } = await supabase.rpc('exec_sql', { sql: templatesSQL }).single();
    if (templatesError && !templatesError.message.includes('does not exist')) {
      // Try alternative approach using REST API
      console.log('Using alternative table creation method...');
    }

    // For Supabase, we'll use the SQL editor approach via their API
    console.log('\nPlease run the following SQL in your Supabase SQL Editor:');
    console.log('\n--- TEMPLATES TABLE ---');
    console.log(templatesSQL);
    console.log('\n--- MEMES TABLE ---');
    console.log(memesSQL);

    // Verify connection works
    const { data, error } = await supabase.from('templates').select('count').single();

    if (error) {
      console.log('\nTables not yet created. Creating via SQL...');
      console.log('Note: You may need to run this SQL manually in Supabase dashboard.');
    } else {
      console.log('\n✅ Successfully connected to Supabase!');
      console.log('✅ Templates table exists');
    }

    // Check memes table
    const { error: memesError } = await supabase.from('memes').select('count').single();
    if (!memesError) {
      console.log('✅ Memes table exists');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();
