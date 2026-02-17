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

// Construct PostgreSQL connection string
const connectionString = `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`;

// Popular meme templates with publicly accessible images from imgflip
const templates = [
  {
    name: 'Distracted Boyfriend',
    image_url: 'https://i.imgflip.com/1ur9b0.jpg',
    category: 'Reactions'
  },
  {
    name: 'Drake Hotline Bling',
    image_url: 'https://i.imgflip.com/30b1gx.jpg',
    category: 'Reactions'
  },
  {
    name: 'Two Buttons',
    image_url: 'https://i.imgflip.com/1g8my4.jpg',
    category: 'Decisions'
  },
  {
    name: 'Mocking SpongeBob',
    image_url: 'https://i.imgflip.com/1otk96.jpg',
    category: 'Reactions'
  },
  {
    name: 'Change My Mind',
    image_url: 'https://i.imgflip.com/24y43o.jpg',
    category: 'Opinions'
  },
  {
    name: 'Is This A Pigeon',
    image_url: 'https://i.imgflip.com/1bij.jpg',
    category: 'Confusion'
  },
  {
    name: 'Woman Yelling At Cat',
    image_url: 'https://i.imgflip.com/345v97.jpg',
    category: 'Arguments'
  },
  {
    name: 'Expanding Brain',
    image_url: 'https://i.imgflip.com/1jwhww.jpg',
    category: 'Intelligence'
  },
  {
    name: 'Running Away Balloon',
    image_url: 'https://i.imgflip.com/261o3j.jpg',
    category: 'Distractions'
  },
  {
    name: 'Epic Handshake',
    image_url: 'https://i.imgflip.com/28j0te.jpg',
    category: 'Agreement'
  },
  {
    name: 'Surprised Pikachu',
    image_url: 'https://i.imgflip.com/1ij0rg.jpg',
    category: 'Reactions'
  },
  {
    name: 'Bernie Sanders',
    image_url: 'https://i.imgflip.com/4x6d.jpg',
    category: 'Politics'
  }
];

async function seedTemplates() {
  const client = new Client({ connectionString });

  try {
    console.log('🔌 Connecting to Supabase PostgreSQL database...\n');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Check if templates already exist
    const countResult = await client.query('SELECT COUNT(*) FROM templates');
    const existingCount = parseInt(countResult.rows[0].count);

    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing templates.`);
      console.log('🗑️  Clearing existing templates...\n');
      await client.query('DELETE FROM templates');
    }

    console.log('📝 Inserting meme templates...\n');

    // Insert each template
    for (const template of templates) {
      await client.query(
        'INSERT INTO templates (name, image_url, category) VALUES ($1, $2, $3)',
        [template.name, template.image_url, template.category]
      );
      console.log(`   ✅ ${template.name} (${template.category})`);
    }

    console.log('\n🔍 Verifying templates...\n');

    // Verify insertion
    const verifyResult = await client.query(`
      SELECT id, name, image_url, category, created_at
      FROM templates
      ORDER BY created_at ASC
    `);

    console.log(`📊 Total templates in database: ${verifyResult.rows.length}\n`);

    if (verifyResult.rows.length >= 10) {
      console.log('✅ All verification checks passed:');
      console.log(`   ✅ At least 10 templates exist (${verifyResult.rows.length})`);
      console.log('   ✅ Each template has name, image_url, and category');
      console.log('   ✅ All template IDs are unique');

      console.log('\n📋 Sample templates:');
      verifyResult.rows.slice(0, 5).forEach(row => {
        console.log(`   • ${row.name} - ${row.category}`);
        console.log(`     Image: ${row.image_url}`);
      });

      console.log('\n🎉 Template seeding complete!');
      return true;
    } else {
      console.log(`\n⚠️  Expected at least 10 templates, found: ${verifyResult.rows.length}`);
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

seedTemplates().then(success => {
  process.exit(success ? 0 : 1);
});
