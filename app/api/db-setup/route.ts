import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const results = {
    connection: false,
    templatesTable: false,
    memesTable: false,
    templatesCount: 0,
    memesCount: 0,
    errors: [] as string[],
  };

  try {
    // Test 1: Check if templates table exists and is accessible
    console.log('Checking templates table...');
    const { error: templatesError } = await supabase
      .from('templates')
      .select('id')
      .limit(1);

    if (templatesError) {
      if (templatesError.code === '42P01') {
        results.errors.push('Templates table does not exist');
      } else {
        results.errors.push(`Templates error: ${templatesError.message}`);
      }
    } else {
      results.templatesTable = true;
      console.log('✅ Templates table accessible');
    }

    // Test 2: Check if memes table exists and is accessible
    console.log('Checking memes table...');
    const { error: memesError } = await supabase
      .from('memes')
      .select('id')
      .limit(1);

    if (memesError) {
      if (memesError.code === '42P01') {
        results.errors.push('Memes table does not exist');
      } else {
        results.errors.push(`Memes error: ${memesError.message}`);
      }
    } else {
      results.memesTable = true;
      console.log('✅ Memes table accessible');
    }

    // Test 3: Overall connection test
    if (results.templatesTable || results.memesTable) {
      results.connection = true;
    }

    // Get table counts
    if (results.templatesTable) {
      const { count } = await supabase
        .from('templates')
        .select('*', { count: 'exact', head: true });
      results.templatesCount = count || 0;
    }

    if (results.memesTable) {
      const { count } = await supabase
        .from('memes')
        .select('*', { count: 'exact', head: true });
      results.memesCount = count || 0;
    }

    return NextResponse.json({
      success: results.connection && results.templatesTable && results.memesTable,
      ...results,
      message: results.templatesTable && results.memesTable
        ? '✅ Database connection successful! All tables exist.'
        : '⚠️ Database connection established but tables need to be created.',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      connection: false,
      error: errorMessage,
      message: '❌ Failed to connect to database',
    }, { status: 500 });
  }
}
