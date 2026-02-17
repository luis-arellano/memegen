import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  console.log('🔧 Running Supabase database migration...\n');

  try {
    // Create templates table
    console.log('📋 Creating templates table...');
    const { error: templatesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS templates (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          image_url TEXT NOT NULL,
          category TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Since rpc might not exist, let's use a different approach
    // We'll create a test insert to verify the table exists
    const { data: templatesData, error: templatesCheckError } = await supabase
      .from('templates')
      .select('count')
      .limit(0);

    if (templatesCheckError && templatesCheckError.code === '42P01') {
      console.log('⚠️  Templates table does not exist. Creating via SQL editor required.');
      console.log('   Go to: https://supabase.com/dashboard/project/ebmbudezyioutjrnpwxd/sql/new');
      console.log('   And run the SQL from scripts/schema.sql\n');
    } else if (templatesCheckError) {
      console.log('❌ Error checking templates table:', templatesCheckError.message);
    } else {
      console.log('✅ Templates table exists and is accessible');
    }

    // Check memes table
    console.log('📋 Checking memes table...');
    const { data: memesData, error: memesCheckError } = await supabase
      .from('memes')
      .select('count')
      .limit(0);

    if (memesCheckError && memesCheckError.code === '42P01') {
      console.log('⚠️  Memes table does not exist. Creating via SQL editor required.');
    } else if (memesCheckError) {
      console.log('❌ Error checking memes table:', memesCheckError.message);
    } else {
      console.log('✅ Memes table exists and is accessible');
    }

    // Test overall connection
    console.log('\n🔌 Testing database connection...');
    const { data, error: connectionError } = await supabase
      .from('templates')
      .select('count');

    if (connectionError) {
      console.log('❌ Connection test failed:', connectionError.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log(`📊 Templates count: ${data?.length || 0}`);

    return true;

  } catch (error) {
    console.error('❌ Migration error:', error.message);
    return false;
  }
}

// Run the migration
runMigration().then(success => {
  process.exit(success ? 0 : 1);
});
