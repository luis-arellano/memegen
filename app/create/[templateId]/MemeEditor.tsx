'use client';

import { useState } from 'react';

interface Template {
  id: string;
  name: string;
  image_url: string;
  category: string;
}

interface MemeEditorProps {
  template: Template;
}

export default function MemeEditor({ template }: MemeEditorProps) {
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Preview */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={template.image_url}
              alt={template.name}
              className="w-full h-auto"
            />
            {/* Text overlays will be implemented in later tasks */}
            {topText && (
              <div className="absolute top-4 left-0 right-0 text-center">
                <span className="text-white text-2xl md:text-4xl font-bold uppercase px-4 py-2 inline-block"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {topText}
                </span>
              </div>
            )}
            {bottomText && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="text-white text-2xl md:text-4xl font-bold uppercase px-4 py-2 inline-block"
                  style={{
                    textShadow: '2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {bottomText}
                </span>
              </div>
            )}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p className="font-medium">Template: {template.name}</p>
            <p className="text-xs mt-1 capitalize">Category: {template.category}</p>
          </div>
        </div>
      </div>

      {/* Right Column - Text Inputs */}
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Add Your Text</h2>

          <div className="space-y-6">
            {/* Top Text Input */}
            <div>
              <label htmlFor="topText" className="block text-sm font-medium text-gray-700 mb-2">
                Top Text
              </label>
              <input
                type="text"
                id="topText"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="Enter top text..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                {topText.length}/100 characters
              </p>
            </div>

            {/* Bottom Text Input */}
            <div>
              <label htmlFor="bottomText" className="block text-sm font-medium text-gray-700 mb-2">
                Bottom Text
              </label>
              <input
                type="text"
                id="bottomText"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="Enter bottom text..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                {bottomText.length}/100 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <button
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!topText && !bottomText}
              >
                Generate Meme
              </button>
              <p className="mt-2 text-xs text-center text-gray-500">
                Add text to enable generation
              </p>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Keep text short and punchy for maximum impact</li>
            <li>• Text is automatically styled with white fill and black stroke</li>
            <li>• Preview updates in real-time as you type</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
