'use client';

import { useEffect, useState } from 'react';

interface DBStatus {
  success: boolean;
  message: string;
  tables?: {
    templates: { count: number };
    memes: { count: number };
  };
  error?: string;
}

export default function DBTestPage() {
  const [status, setStatus] = useState<DBStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/test-db')
      .then(res => res.json())
      .then(data => {
        setStatus(data);
        setLoading(false);
      })
      .catch(error => {
        setStatus({
          success: false,
          message: 'Failed to fetch',
          error: error.message
        });
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Supabase Database Connection Test
        </h1>

        {loading && (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Testing connection...</p>
          </div>
        )}

        {!loading && status && (
          <div className={`bg-white rounded-lg shadow p-6 ${status.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <div className="flex items-center mb-4">
              <div className={`w-4 h-4 rounded-full mr-3 ${status.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {status.success ? '✅ Connection Successful' : '❌ Connection Failed'}
              </h2>
            </div>

            <p className="text-gray-600 mb-6">{status.message}</p>

            {status.success && status.tables && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold text-gray-700 mb-2">Database Tables</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">📋 Templates table:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {status.tables.templates.count} records
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">🎨 Memes table:</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {status.tables.memes.count} records
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Verification Complete</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ Supabase project connected</li>
                    <li>✓ Templates table exists and accessible</li>
                    <li>✓ Memes table exists and accessible</li>
                    <li>✓ No connection errors in console</li>
                  </ul>
                </div>
              </div>
            )}

            {status.error && (
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <h3 className="font-semibold text-red-800 mb-2">Error Details</h3>
                <pre className="text-sm text-red-700 whitespace-pre-wrap">{status.error}</pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-blue-600 hover:text-blue-800 underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
