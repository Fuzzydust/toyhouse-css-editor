import { Trash2, Settings, Link, X } from 'lucide-react';
import { CanvasElement } from '../types';
import { useState } from 'react';

interface PropertiesPanelProps {
  element: CanvasElement | undefined;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  canvasSettings: {
    width: number;
    height: number;
    background: string;
  };
  onUpdateCanvas: (updates: any) => void;
  onEditWorld?: () => void;
}

const TOYHOUSE_FONTS = [
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive' },
  { name: 'Impact', value: 'Impact, sans-serif' },
  { name: 'Lucida Console', value: '"Lucida Console", monospace' },
  { name: 'Tahoma', value: 'Tahoma, sans-serif' },
  { name: 'Palatino', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
  { name: 'Garamond', value: 'Garamond, serif' },
  { name: 'Bookman', value: '"Bookman Old Style", serif' },
  { name: 'Arial Black', value: '"Arial Black", sans-serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Fantasy', value: 'fantasy' },
];

export default function PropertiesPanel({
  element,
  onUpdateElement,
  onDeleteElement,
  canvasSettings,
  onUpdateCanvas,
  onEditWorld,
}: PropertiesPanelProps) {
  const [showImageLinkPopup, setShowImageLinkPopup] = useState(false);
  const [imageLink, setImageLink] = useState('');

  if (!element) {
    return (
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-slate-400" />
          <h3 className="text-lg font-semibold text-white">Canvas Settings</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Width (px)</label>
            <input
              type="number"
              value={canvasSettings.width}
              onChange={(e) => onUpdateCanvas({ canvasWidth: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Height (px)</label>
            <input
              type="number"
              value={canvasSettings.height}
              onChange={(e) => onUpdateCanvas({ canvasHeight: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Background</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={canvasSettings.background}
                onChange={(e) => onUpdateCanvas({ canvasBackground: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={canvasSettings.background}
                onChange={(e) => onUpdateCanvas({ canvasBackground: e.target.value })}
                className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (element.type === 'world') {
    return (
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">World Properties</h3>
          <button
            onClick={() => onDeleteElement(element.id)}
            className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-teal-500/10 border border-teal-500/30 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">🗺️</div>
              <div className="flex-1">
                <h4 className="font-medium text-teal-300 mb-1">Interactive World</h4>
                <p className="text-sm text-slate-300">
                  {element.locations?.length || 0} location{element.locations?.length !== 1 ? 's' : ''} added
                </p>
              </div>
            </div>
            <button
              onClick={onEditWorld}
              className="w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
            >
              Edit World Locations
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Width</label>
              <input
                type="number"
                value={Math.round(element.width)}
                onChange={(e) => onUpdateElement(element.id, { width: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Height</label>
              <input
                type="number"
                value={Math.round(element.height)}
                onChange={(e) => onUpdateElement(element.id, { height: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Z-Index</label>
            <input
              type="number"
              value={element.zIndex}
              onChange={(e) => onUpdateElement(element.id, { zIndex: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white capitalize">
          {element.type === 'pagedoll' ? 'Page Doll' : element.type} Properties
        </h3>
        <button
          onClick={() => onDeleteElement(element.id)}
          className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {element.type === 'pagedoll' && (
        <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-sm text-cyan-300">
          Page dolls stay fixed to the browser viewport (bottom-right position), just like on Toyhou.se. X = right offset, Y = bottom offset.
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">X</label>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => onUpdateElement(element.id, { x: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Y</label>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => onUpdateElement(element.id, { y: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Width</label>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => onUpdateElement(element.id, { width: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Height</label>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => onUpdateElement(element.id, { height: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Rotation (deg)</label>
          <input
            type="number"
            value={element.rotation}
            onChange={(e) => onUpdateElement(element.id, { rotation: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Z-Index</label>
          <input
            type="number"
            value={element.zIndex}
            onChange={(e) => onUpdateElement(element.id, { zIndex: parseInt(e.target.value) })}
            className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {element.type === 'button' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Button Text</label>
              <input
                type="text"
                value={element.content || 'Button'}
                onChange={(e) => onUpdateElement(element.id, { content: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Font Family</label>
              <select
                value={element.fontFamily || 'Arial, sans-serif'}
                onChange={(e) => onUpdateElement(element.id, { fontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                {TOYHOUSE_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Font Size</label>
                <input
                  type="number"
                  value={element.fontSize}
                  onChange={(e) => onUpdateElement(element.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Font Weight</label>
                <select
                  value={element.fontWeight || 'bold'}
                  onChange={(e) => onUpdateElement(element.id, { fontWeight: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Lighter</option>
                  <option value="bolder">Bolder</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.fontColor}
                  onChange={(e) => onUpdateElement(element.id, { fontColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.fontColor}
                  onChange={(e) => onUpdateElement(element.id, { fontColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Link</label>
              <div className="space-y-2">
                <select
                  value={element.link?.type || ''}
                  onChange={(e) => {
                    if (!e.target.value) {
                      onUpdateElement(element.id, { link: undefined });
                    } else {
                      onUpdateElement(element.id, {
                        link: {
                          type: e.target.value as 'page' | 'url',
                          target: '',
                          openInNewTab: false,
                        },
                      });
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">No Link</option>
                  <option value="page">Link to Page</option>
                  <option value="url">Link to URL</option>
                </select>

                {element.link && (
                  <>
                    <input
                      type="text"
                      value={element.link.target}
                      onChange={(e) =>
                        onUpdateElement(element.id, {
                          link: { ...element.link!, target: e.target.value },
                        })
                      }
                      placeholder={element.link.type === 'page' ? 'Page ID' : 'https://example.com'}
                      className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={element.link.openInNewTab || false}
                        onChange={(e) =>
                          onUpdateElement(element.id, {
                            link: { ...element.link!, openInNewTab: e.target.checked },
                          })
                        }
                        className="rounded bg-slate-800 border-slate-600"
                      />
                      Open in new tab
                    </label>
                  </>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Padding</label>
              <input
                type="text"
                value={element.styles?.padding || '8px 14px'}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    styles: { ...element.styles, padding: e.target.value },
                  })
                }
                placeholder="8px 14px"
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Border Width (px)</label>
              <input
                type="number"
                value={element.styles?.borderWidth || 2}
                onChange={(e) =>
                  onUpdateElement(element.id, {
                    styles: { ...element.styles, borderWidth: parseInt(e.target.value) },
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Border Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.styles?.borderColor || '#ffffff'}
                  onChange={(e) =>
                    onUpdateElement(element.id, {
                      styles: { ...element.styles, borderColor: e.target.value },
                    })
                  }
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.styles?.borderColor || '#ffffff'}
                  onChange={(e) =>
                    onUpdateElement(element.id, {
                      styles: { ...element.styles, borderColor: e.target.value },
                    })
                  }
                  className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>
          </>
        )}

        {element.type !== 'text' && element.type !== 'button' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Link</label>
            <div className="space-y-2">
              <select
                value={element.link?.type || ''}
                onChange={(e) => {
                  if (!e.target.value) {
                    onUpdateElement(element.id, { link: undefined });
                  } else {
                    onUpdateElement(element.id, {
                      link: {
                        type: e.target.value as 'page' | 'url',
                        target: '',
                        openInNewTab: false,
                      },
                    });
                  }
                }}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="">No Link</option>
                <option value="page">Link to Page</option>
                <option value="url">Link to URL</option>
              </select>

              {element.link && (
                <>
                  <input
                    type="text"
                    value={element.link.target}
                    onChange={(e) =>
                      onUpdateElement(element.id, {
                        link: { ...element.link!, target: e.target.value },
                      })
                    }
                    placeholder={element.link.type === 'page' ? 'Page ID' : 'https://example.com'}
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                  />
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={element.link.openInNewTab || false}
                      onChange={(e) =>
                        onUpdateElement(element.id, {
                          link: { ...element.link!, openInNewTab: e.target.checked },
                        })
                      }
                      className="rounded bg-slate-800 border-slate-600"
                    />
                    Open in new tab
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {element.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Text Content</label>
              <textarea
                value={element.content}
                onChange={(e) => onUpdateElement(element.id, { content: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Font Family</label>
              <select
                value={element.fontFamily || 'Arial, sans-serif'}
                onChange={(e) => onUpdateElement(element.id, { fontFamily: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                {TOYHOUSE_FONTS.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Font Size</label>
              <input
                type="number"
                value={element.fontSize}
                onChange={(e) => onUpdateElement(element.id, { fontSize: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Font Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.fontColor}
                  onChange={(e) => onUpdateElement(element.id, { fontColor: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={element.fontColor}
                  onChange={(e) => onUpdateElement(element.id, { fontColor: e.target.value })}
                  className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Background Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={element.styles?.backgroundColor || '#ffffff'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, backgroundColor: e.target.value },
                })
              }
              className="w-12 h-10 rounded cursor-pointer"
            />
            <input
              type="text"
              value={element.styles?.backgroundColor || ''}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, backgroundColor: e.target.value },
                })
              }
              className="flex-1 px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Border Radius (px)</label>
          <input
            type="number"
            value={element.styles?.borderRadius || 0}
            onChange={(e) =>
              onUpdateElement(element.id, {
                styles: { ...element.styles, borderRadius: parseInt(e.target.value) },
              })
            }
            className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={element.styles?.opacity || 1}
            onChange={(e) =>
              onUpdateElement(element.id, {
                styles: { ...element.styles, opacity: parseFloat(e.target.value) },
              })
            }
            className="w-full"
          />
        </div>

        {(element.type === 'image' || element.type === 'pagedoll' || element.type === 'shape' || element.type === 'div') && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                {element.styles?.backgroundImage ? 'Image URL' : 'Add Background Image'}
              </label>
              <button
                onClick={() => {
                  const bgImage = element.styles?.backgroundImage || '';
                  const url = bgImage.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
                  setImageLink(url);
                  setShowImageLinkPopup(true);
                }}
                className="w-full px-3 py-2 bg-slate-800 text-blue-400 rounded border border-slate-600 hover:bg-slate-700 transition-colors flex items-center gap-2 justify-center"
              >
                <Link className="w-4 h-4" />
                {element.styles?.backgroundImage ? 'View/Edit Image Link' : 'Add Background Image'}
              </button>
            </div>

            {element.styles?.backgroundImage && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Image Size</label>
                  <select
                    value={element.styles?.backgroundSize || 'cover'}
                    onChange={(e) =>
                      onUpdateElement(element.id, {
                        styles: { ...element.styles, backgroundSize: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="cover">Cover (Fill Shape)</option>
                    <option value="contain">Contain (Fit Inside)</option>
                    <option value="100% 100%">Stretch</option>
                    <option value="auto">Original Size</option>
                    <option value="custom">Custom Zoom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Zoom Level
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-8">25%</span>
                    <input
                      type="range"
                      min="25"
                      max="300"
                      step="5"
                      value={(() => {
                        const size = element.styles?.backgroundSize || 'cover';
                        if (size === 'custom' || (typeof size === 'string' && size.includes('%') && !size.includes('100% 100%'))) {
                          const match = size.match(/^(\d+)%/);
                          if (match) return parseInt(match[1]);
                        }
                        return 100;
                      })()}
                      onChange={(e) => {
                        const zoom = e.target.value;
                        onUpdateElement(element.id, {
                          styles: { ...element.styles, backgroundSize: `${zoom}%` },
                        });
                      }}
                      className="flex-1"
                    />
                    <span className="text-xs text-slate-400 w-10">300%</span>
                    <input
                      type="number"
                      min="25"
                      max="300"
                      step="5"
                      value={(() => {
                        const size = element.styles?.backgroundSize || 'cover';
                        if (size === 'custom' || (typeof size === 'string' && size.includes('%') && !size.includes('100% 100%'))) {
                          const match = size.match(/^(\d+)%/);
                          if (match) return parseInt(match[1]);
                        }
                        return 100;
                      })()}
                      onChange={(e) => {
                        const zoom = e.target.value || '100';
                        onUpdateElement(element.id, {
                          styles: { ...element.styles, backgroundSize: `${zoom}%` },
                        });
                      }}
                      className="w-16 px-2 py-1 bg-slate-800 text-white text-center rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <span className="text-xs text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Image Position</label>
                  <select
                    value={element.styles?.backgroundPosition || 'center'}
                    onChange={(e) =>
                      onUpdateElement(element.id, {
                        styles: { ...element.styles, backgroundPosition: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="top left">Top Left</option>
                    <option value="top right">Top Right</option>
                    <option value="bottom left">Bottom Left</option>
                    <option value="bottom right">Bottom Right</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Horizontal Position
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-8">Left</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={(() => {
                        const pos = element.styles?.backgroundPosition || 'center';
                        if (typeof pos === 'string' && pos.includes('%')) {
                          return parseInt(pos.split(' ')[0]);
                        }
                        const keywordMap: Record<string, number> = {
                          'left': 0, 'center': 50, 'right': 100,
                          'top left': 0, 'top': 50, 'top right': 100,
                          'bottom left': 0, 'bottom': 50, 'bottom right': 100
                        };
                        return keywordMap[pos] ?? 50;
                      })()}
                      onChange={(e) => {
                        const xVal = e.target.value;
                        const currentPos = element.styles?.backgroundPosition || 'center';
                        let yVal = '50';
                        if (typeof currentPos === 'string' && currentPos.includes('%')) {
                          yVal = currentPos.split(' ')[1]?.replace('%', '') || '50';
                        } else if (typeof currentPos === 'string') {
                          const keywordMap: Record<string, number> = {
                            'top': 0, 'top left': 0, 'top right': 0,
                            'center': 50, 'left': 50, 'right': 50,
                            'bottom': 100, 'bottom left': 100, 'bottom right': 100
                          };
                          yVal = String(keywordMap[currentPos] ?? 50);
                        }
                        onUpdateElement(element.id, {
                          styles: { ...element.styles, backgroundPosition: `${xVal}% ${yVal}%` },
                        });
                      }}
                      className="flex-1"
                    />
                    <span className="text-xs text-slate-400 w-8 text-right">Right</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={(() => {
                        const pos = element.styles?.backgroundPosition || 'center';
                        if (typeof pos === 'string' && pos.includes('%')) {
                          return parseInt(pos.split(' ')[0]);
                        }
                        const keywordMap: Record<string, number> = {
                          'left': 0, 'center': 50, 'right': 100,
                          'top left': 0, 'top': 50, 'top right': 100,
                          'bottom left': 0, 'bottom': 50, 'bottom right': 100
                        };
                        return keywordMap[pos] ?? 50;
                      })()}
                      onChange={(e) => {
                        const xVal = e.target.value || '50';
                        const currentPos = element.styles?.backgroundPosition || 'center';
                        let yVal = '50';
                        if (typeof currentPos === 'string' && currentPos.includes('%')) {
                          yVal = currentPos.split(' ')[1]?.replace('%', '') || '50';
                        } else if (typeof currentPos === 'string') {
                          const keywordMap: Record<string, number> = {
                            'top': 0, 'top left': 0, 'top right': 0,
                            'center': 50, 'left': 50, 'right': 50,
                            'bottom': 100, 'bottom left': 100, 'bottom right': 100
                          };
                          yVal = String(keywordMap[currentPos] ?? 50);
                        }
                        onUpdateElement(element.id, {
                          styles: { ...element.styles, backgroundPosition: `${xVal}% ${yVal}%` },
                        });
                      }}
                      className="w-14 px-2 py-1 bg-slate-800 text-white text-center rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <span className="text-xs text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Vertical Position
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-8">Top</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={(() => {
                        const pos = element.styles?.backgroundPosition || 'center';
                        if (typeof pos === 'string' && pos.includes('%')) {
                          return parseInt(pos.split(' ')[1]?.replace('%', '') || '50');
                        }
                        const keywordMap: Record<string, number> = {
                          'top': 0, 'top left': 0, 'top right': 0,
                          'center': 50, 'left': 50, 'right': 50,
                          'bottom': 100, 'bottom left': 100, 'bottom right': 100
                        };
                        return keywordMap[pos] ?? 50;
                      })()}
                      onChange={(e) => {
                        const yVal = e.target.value;
                        const currentPos = element.styles?.backgroundPosition || 'center';
                        let xVal = '50';
                        if (typeof currentPos === 'string' && currentPos.includes('%')) {
                          xVal = currentPos.split(' ')[0]?.replace('%', '') || '50';
                        } else if (typeof currentPos === 'string') {
                          const keywordMap: Record<string, number> = {
                            'left': 0, 'top left': 0, 'bottom left': 0,
                            'center': 50, 'top': 50, 'bottom': 50,
                            'right': 100, 'top right': 100, 'bottom right': 100
                          };
                          xVal = String(keywordMap[currentPos] ?? 50);
                        }
                        onUpdateElement(element.id, {
                          styles: { ...element.styles, backgroundPosition: `${xVal}% ${yVal}%` },
                        });
                      }}
                      className="flex-1"
                    />
                    <span className="text-xs text-slate-400 w-8 text-right">Bottom</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={(() => {
                        const pos = element.styles?.backgroundPosition || 'center';
                        if (typeof pos === 'string' && pos.includes('%')) {
                          return parseInt(pos.split(' ')[1]?.replace('%', '') || '50');
                        }
                        const keywordMap: Record<string, number> = {
                          'top': 0, 'top left': 0, 'top right': 0,
                          'center': 50, 'left': 50, 'right': 50,
                          'bottom': 100, 'bottom left': 100, 'bottom right': 100
                        };
                        return keywordMap[pos] ?? 50;
                      })()}
                      onChange={(e) => {
                        const yVal = e.target.value || '50';
                        const currentPos = element.styles?.backgroundPosition || 'center';
                        let xVal = '50';
                        if (typeof currentPos === 'string' && currentPos.includes('%')) {
                          xVal = currentPos.split(' ')[0]?.replace('%', '') || '50';
                        } else if (typeof currentPos === 'string') {
                          const keywordMap: Record<string, number> = {
                            'left': 0, 'top left': 0, 'bottom left': 0,
                            'center': 50, 'top': 50, 'bottom': 50,
                            'right': 100, 'top right': 100, 'bottom right': 100
                          };
                          xVal = String(keywordMap[currentPos] ?? 50);
                        }
                        onUpdateElement(element.id, {
                          styles: { ...element.styles, backgroundPosition: `${xVal}% ${yVal}%` },
                        });
                      }}
                      className="w-14 px-2 py-1 bg-slate-800 text-white text-center rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
                    />
                    <span className="text-xs text-slate-400">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Image Repeat</label>
                  <select
                    value={element.styles?.backgroundRepeat || 'no-repeat'}
                    onChange={(e) =>
                      onUpdateElement(element.id, {
                        styles: { ...element.styles, backgroundRepeat: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="no-repeat">No Repeat</option>
                    <option value="repeat">Repeat</option>
                    <option value="repeat-x">Repeat Horizontally</option>
                    <option value="repeat-y">Repeat Vertically</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {element.type === 'shape' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Blend Mode (Cutout)</label>
            <select
              value={element.styles?.mixBlendMode || 'normal'}
              onChange={(e) =>
                onUpdateElement(element.id, {
                  styles: { ...element.styles, mixBlendMode: e.target.value },
                })
              }
              className="w-full px-3 py-2 bg-slate-800 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply (Darken)</option>
              <option value="screen">Screen (Lighten)</option>
              <option value="overlay">Overlay</option>
              <option value="darken">Darken</option>
              <option value="lighten">Lighten</option>
              <option value="color-dodge">Color Dodge</option>
              <option value="color-burn">Color Burn</option>
              <option value="hard-light">Hard Light</option>
              <option value="soft-light">Soft Light</option>
              <option value="difference">Difference (Cutout)</option>
              <option value="exclusion">Exclusion (Cutout)</option>
            </select>
          </div>
        )}
      </div>

      {showImageLinkPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageLinkPopup(false)}>
          <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 border border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Image URL</h3>
              <button
                onClick={() => setShowImageLinkPopup(false)}
                className="p-1 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Current Image URL</label>
                <textarea
                  value={imageLink}
                  onChange={(e) => setImageLink(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none font-mono text-sm"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (imageLink.trim()) {
                      onUpdateElement(element.id, {
                        styles: {
                          ...element.styles,
                          backgroundImage: `url(${imageLink})`,
                          backgroundSize: element.styles?.backgroundSize || 'cover',
                          backgroundPosition: element.styles?.backgroundPosition || 'center',
                        },
                      });
                    } else {
                      const { backgroundImage, backgroundSize, backgroundPosition, ...restStyles } = element.styles || {};
                      onUpdateElement(element.id, {
                        styles: restStyles,
                      });
                    }
                    setShowImageLinkPopup(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {imageLink.trim() ? 'Update Image' : 'Remove Image'}
                </button>
                <button
                  onClick={() => setShowImageLinkPopup(false)}
                  className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
