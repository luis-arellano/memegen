import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? 'SET' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTemplates() {
  console.log('Checking templates in database...\n');

  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('❌ Error querying templates:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully queried templates table`);
  console.log(`📊 Total templates found: ${data?.length || 0}\n`);

  if (data && data.length > 0) {
    console.log('Templates:');
    data.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} (${template.category})`);
    });
  } else {
    console.log('⚠️ No templates found in database');
  }
}

checkTemplates();
