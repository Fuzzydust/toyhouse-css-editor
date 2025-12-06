import { useState } from 'react';
import { Plus, X, Type } from 'lucide-react';
import { CustomFont } from '../types';

interface FontsPanelProps {
  customFonts: CustomFont[];
  onAddFont: (font: CustomFont) => void;
  onRemoveFont: (fontId: string) => void;
}

export default function FontsPanel({ customFonts, onAddFont, onRemoveFont }: FontsPanelProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  const [fontType, setFontType] = useState<'google' | 'custom'>('google');

  const handleAddFont = () => {
    if (!fontName.trim() || !fontUrl.trim()) return;

    const newFont: CustomFont = {
      id: Date.now().toString(),
      name: fontName.trim(),
      url: fontUrl.trim(),
      type: fontType,
    };

    onAddFont(newFont);
    setFontName('');
    setFontUrl('');
    setIsAdding(false);
  };

  const getGoogleFontUrl = (fontFamily: string) => {
    const encodedFamily = fontFamily.replace(/\s+/g, '+');
    return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@400;700&display=swap`;
  };

  return (
    <div className="border-t border-slate-700 mt-4 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-200">Custom Fonts</h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
          title="Add Font"
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {isAdding && (
        <div className="mb-3 p-3 bg-slate-800 rounded-lg space-y-2">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Font Type</label>
            <select
              value={fontType}
              onChange={(e) => setFontType(e.target.value as 'google' | 'custom')}
              className="w-full px-2 py-1 bg-slate-700 text-white text-sm rounded border border-slate-600"
            >
              <option value="google">Google Font</option>
              <option value="custom">Custom URL</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {fontType === 'google' ? 'Font Family Name' : 'Font Name'}
            </label>
            <input
              type="text"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              placeholder={fontType === 'google' ? 'e.g., Roboto' : 'My Custom Font'}
              className="w-full px-2 py-1 bg-slate-700 text-white text-sm rounded border border-slate-600"
            />
          </div>

          {fontType === 'google' ? (
            <div className="text-xs text-slate-400 bg-slate-900 p-2 rounded">
              URL will be: {fontName ? getGoogleFontUrl(fontName) : 'Enter font name'}
            </div>
          ) : (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Font URL (CSS)</label>
              <input
                type="text"
                value={fontUrl}
                onChange={(e) => setFontUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-2 py-1 bg-slate-700 text-white text-sm rounded border border-slate-600"
              />
            </div>
          )}

          <button
            onClick={() => {
              if (fontType === 'google') {
                setFontUrl(getGoogleFontUrl(fontName));
                setTimeout(handleAddFont, 0);
              } else {
                handleAddFont();
              }
            }}
            className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            Add Font
          </button>
        </div>
      )}

      <div className="space-y-1">
        {customFonts && customFonts.length > 0 ? (
          customFonts.map((font) => (
            <div
              key={font.id}
              className="flex items-center justify-between p-2 bg-slate-800 rounded hover:bg-slate-700 group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{font.name}</div>
                <div className="text-xs text-slate-400 truncate">{font.type === 'google' ? 'Google Font' : 'Custom'}</div>
              </div>
              <button
                onClick={() => onRemoveFont(font.id)}
                className="p-1 hover:bg-slate-600 rounded text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100"
                title="Remove Font"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-xs text-slate-500 text-center py-4">
            No custom fonts added yet
          </div>
        )}
      </div>
    </div>
  );
}
