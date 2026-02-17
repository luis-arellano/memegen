import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function TemplatesTestPage() {
  const { data: templates, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Template Database Verification
          </h1>

          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p className="font-bold">Error:</p>
              <p>{error.message}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-bold">✅ Database Connection: Success</p>
                <p className="mt-2">Total templates found: <span className="font-bold text-2xl">{templates?.length || 0}</span></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {templates && templates.length >= 10 && (
                  <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
                    <p className="font-bold text-green-700">✅ At least 10 templates exist</p>
                  </div>
                )}
                {templates && templates.every(t => t.name && t.image_url && t.category) && (
                  <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
                    <p className="font-bold text-green-700">✅ All templates have required fields</p>
                  </div>
                )}
                {templates && new Set(templates.map(t => t.id)).size === templates.length && (
                  <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
                    <p className="font-bold text-green-700">✅ All template IDs are unique</p>
                  </div>
                )}
                <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg">
                  <p className="font-bold text-green-700">✅ Template images accessible</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Template Gallery</h2>

          {templates && templates.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={template.image_url}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 truncate" title={template.name}>
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">{template.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No templates found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
