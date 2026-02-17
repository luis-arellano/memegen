import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function TemplatesPage() {
  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-bold">Error loading templates</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-gray-900">
            Meme Templates
          </h1>
          <p className="mt-2 text-gray-600">
            Choose a template to start creating your meme
          </p>
        </div>
      </header>

      {/* Template Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {templates && templates.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="aspect-square relative bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={template.image_url}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-gray-900 truncate" title={template.name}>
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{template.category}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No templates available yet.</p>
          </div>
        )}

        {/* Template Count */}
        {templates && templates.length > 0 && (
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Showing {templates.length} template{templates.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
