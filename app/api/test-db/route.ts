import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test templates table
    const { data: templates, error: templatesError } = await supabase
      .from('templates')
      .select('id, name')
      .limit(5);

    if (templatesError) {
      throw templatesError;
    }

    // Test memes table
    const { data: memes, error: memesError } = await supabase
      .from('memes')
      .select('id, top_text, bottom_text')
      .limit(5);

    if (memesError) {
      throw memesError;
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      tables: {
        templates: {
          count: templates?.length || 0,
          sample: templates || []
        },
        memes: {
          count: memes?.length || 0,
          sample: memes || []
        }
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: errorMessage
    }, { status: 500 });
  }
}
