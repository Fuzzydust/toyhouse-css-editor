import { useState, useRef } from 'react';
import { WorldLocation, CanvasElement, Project } from '../types';
import { Plus, Trash2, Link as LinkIcon, X, ArrowLeft } from 'lucide-react';

interface WorldMakerProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateCanvas: (updates: Partial<Project>) => void;
  pages?: { id: string; name: string }[];
  onClose?: () => void;
}

export default function WorldMaker({ element, onUpdateElement, onUpdateCanvas, pages, onClose }: WorldMakerProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const locations = element.locations || [];
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const newLocation: WorldLocation = {
        id: Date.now().toString(),
        name: `Location ${locations.length + 1}`,
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y)),
        buttonStyles: {
          backgroundColor: '#1a1a1a',
          color: '#ffffff',
          borderColor: '#ffffff',
          borderWidth: 2,
          borderRadius: 8,
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: 'bold',
        },
      };

      onUpdateElement(element.id, {
        locations: [...locations, newLocation],
      });
      setSelectedLocationId(newLocation.id);
    }
  };

  const handleLocationClick = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation();
    setSelectedLocationId(locationId);
  };

  const updateLocation = (locationId: string, updates: Partial<WorldLocation>) => {
    onUpdateElement(element.id, {
      locations: locations.map(loc =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      ),
    });
  };

  const deleteLocation = (locationId: string) => {
    onUpdateElement(element.id, {
      locations: locations.filter(loc => loc.id !== locationId),
    });
    setSelectedLocationId(null);
  };

  const updateLocationStyles = (locationId: string, styles: Partial<WorldLocation['buttonStyles']>) => {
    onUpdateElement(element.id, {
      locations: locations.map(loc =>
        loc.id === locationId
          ? { ...loc, buttonStyles: { ...loc.buttonStyles, ...styles } }
          : loc
      ),
    });
  };

  const handleImageUrlChange = (url: string) => {
    onUpdateElement(element.id, { worldImage: url });

    if (url) {
      const img = new Image();
      img.onload = () => {
        onUpdateCanvas({
          canvasWidth: img.naturalWidth,
          canvasHeight: img.naturalHeight,
        });
      };
      img.src = url;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
                Back to Canvas
              </button>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">World Maker</h2>
              <p className="text-sm text-slate-400">Create interactive locations on your world map</p>
            </div>
          </div>
          <div className="text-sm text-slate-400">
            {locations.length} location{locations.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Background Image URL
            </label>
            <input
              type="text"
              value={element.worldImage || ''}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              placeholder="Enter image URL (e.g., https://example.com/map.jpg)"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
            />
            <p className="text-xs text-slate-400 mt-2">Canvas will automatically resize to match image dimensions</p>
          </div>

          <div className="flex-1 overflow-auto p-4">

            {element.worldImage && (
              <div
                ref={containerRef}
                className="relative cursor-crosshair bg-slate-900 rounded-lg overflow-hidden shadow-xl"
                onClick={handleContainerClick}
                style={{ minHeight: '600px' }}
              >
                <img
                  src={element.worldImage}
                  alt="World background"
                  className="w-full h-auto block pointer-events-none select-none"
                  draggable={false}
                />

                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`absolute cursor-pointer transition-all ${
                      selectedLocationId === location.id ? 'scale-110 z-20 ring-2 ring-teal-400' : 'z-10 hover:scale-105'
                    }`}
                    style={{
                      left: `${location.x}%`,
                      top: `${location.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={(e) => handleLocationClick(e, location.id)}
                  >
                    <div
                      className="whitespace-nowrap select-none shadow-lg"
                      style={{
                        backgroundColor: location.buttonStyles?.backgroundColor || '#1a1a1a',
                        color: location.buttonStyles?.color || '#ffffff',
                        border: `${location.buttonStyles?.borderWidth || 2}px solid ${location.buttonStyles?.borderColor || '#ffffff'}`,
                        borderRadius: `${location.buttonStyles?.borderRadius || 8}px`,
                        padding: location.buttonStyles?.padding || '8px 14px',
                        fontSize: location.buttonStyles?.fontSize || '14px',
                        fontWeight: location.buttonStyles?.fontWeight || 'bold',
                      }}
                    >
                      {location.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!element.worldImage && (
              <div className="bg-slate-900 rounded-lg p-12 text-center text-slate-400 flex-1 flex items-center justify-center">
                <div>
                  <Plus size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Enter an image URL above to start</p>
                  <p className="text-sm mt-2">Then click on the image to add location markers</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-96 bg-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-700">
            <h3 className="text-lg font-semibold text-white">Locations</h3>
            <p className="text-xs text-slate-400 mt-1">Click on the image to add new locations</p>
          </div>

          <div className="flex-1 overflow-auto p-4">

            {locations.length === 0 && (
              <div className="text-center text-slate-400 py-12">
                <LinkIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-base">No locations yet</p>
                <p className="text-sm mt-2">Click on the image to add your first location</p>
              </div>
            )}

            {selectedLocation && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white text-base">Edit Location</h4>
                  <button
                    onClick={() => setSelectedLocationId(null)}
                    className="p-1.5 hover:bg-slate-700 rounded"
                  >
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Location Name
              </label>
              <input
                type="text"
                value={selectedLocation.name}
                onChange={(e) => updateLocation(selectedLocation.id, { name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Link Type
              </label>
              <select
                value={selectedLocation.link?.type || 'none'}
                onChange={(e) => {
                  if (e.target.value === 'none') {
                    const { link, ...rest } = selectedLocation;
                    updateLocation(selectedLocation.id, rest);
                  } else {
                    updateLocation(selectedLocation.id, {
                      link: {
                        type: e.target.value as 'page' | 'url',
                        target: '',
                      },
                    });
                  }
                }}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="none">No Link</option>
                <option value="page">Page</option>
                <option value="url">URL</option>
              </select>
            </div>

            {selectedLocation.link?.type === 'page' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Page
                </label>
                <select
                  value={selectedLocation.link.target}
                  onChange={(e) =>
                    updateLocation(selectedLocation.id, {
                      link: { type: 'page', target: e.target.value, openInNewTab: selectedLocation.link?.openInNewTab },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a page</option>
                  {pages?.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedLocation.link?.type === 'url' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target URL
                </label>
                <input
                  type="text"
                  value={selectedLocation.link.target}
                  onChange={(e) =>
                    updateLocation(selectedLocation.id, {
                      link: { type: 'url', target: e.target.value, openInNewTab: selectedLocation.link?.openInNewTab },
                    })
                  }
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div className="border-t border-slate-700 pt-4">
              <h5 className="text-sm font-medium text-slate-300 mb-3">Button Styles</h5>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={selectedLocation.buttonStyles?.backgroundColor || '#1a1a1a'}
                    onChange={(e) =>
                      updateLocationStyles(selectedLocation.id, { backgroundColor: e.target.value })
                    }
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={selectedLocation.buttonStyles?.color || '#ffffff'}
                    onChange={(e) =>
                      updateLocationStyles(selectedLocation.id, { color: e.target.value })
                    }
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Border Color</label>
                  <input
                    type="color"
                    value={selectedLocation.buttonStyles?.borderColor || '#ffffff'}
                    onChange={(e) =>
                      updateLocationStyles(selectedLocation.id, { borderColor: e.target.value })
                    }
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Border Width</label>
                  <input
                    type="number"
                    value={selectedLocation.buttonStyles?.borderWidth || 2}
                    onChange={(e) =>
                      updateLocationStyles(selectedLocation.id, { borderWidth: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Border Radius</label>
                  <input
                    type="number"
                    value={selectedLocation.buttonStyles?.borderRadius || 8}
                    onChange={(e) =>
                      updateLocationStyles(selectedLocation.id, { borderRadius: parseInt(e.target.value) })
                    }
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>

                <button
                  onClick={() => deleteLocation(selectedLocation.id)}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  Delete Location
                </button>
              </div>
            )}

            {!selectedLocation && locations.length > 0 && (
              <div className="space-y-2">
                {locations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => setSelectedLocationId(location.id)}
                    className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-left flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2 flex-1 min-w-0">
                      <LinkIcon size={16} className="flex-shrink-0" />
                      <span className="truncate">{location.name}</span>
                    </span>
                    <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                      {Math.round(location.x)}%, {Math.round(location.y)}%
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
