import { useState, useRef } from 'react';
import { WorldLocation, CanvasElement } from '../types';
import { Plus, Trash2, Link as LinkIcon, Move, X } from 'lucide-react';

interface WorldMakerProps {
  element: CanvasElement;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  pages?: { id: string; name: string }[];
}

export default function WorldMaker({ element, onUpdateElement, pages }: WorldMakerProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleLocationMouseDown = (e: React.MouseEvent, locationId: string) => {
    e.stopPropagation();
    setSelectedLocationId(locationId);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !selectedLocationId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onUpdateElement(element.id, {
      locations: locations.map(loc =>
        loc.id === selectedLocationId
          ? { ...loc, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
          : loc
      ),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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

  return (
    <div className="flex gap-4 h-full">
      <div className="flex-1 bg-slate-800 rounded-lg p-4 overflow-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Background Image URL
          </label>
          <input
            type="text"
            value={element.worldImage || ''}
            onChange={(e) => onUpdateElement(element.id, { worldImage: e.target.value })}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {element.worldImage && (
          <div
            ref={containerRef}
            className="relative cursor-crosshair bg-slate-900 rounded-lg overflow-hidden"
            onClick={handleContainerClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ minHeight: '400px' }}
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
                className={`absolute cursor-move transition-transform ${
                  selectedLocationId === location.id ? 'scale-110 z-20' : 'z-10'
                }`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseDown={(e) => handleLocationMouseDown(e, location.id)}
              >
                <div
                  className="whitespace-nowrap select-none flex items-center gap-2"
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
                  <Move size={12} />
                  {location.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {!element.worldImage && (
          <div className="bg-slate-900 rounded-lg p-12 text-center text-slate-400">
            <Plus size={48} className="mx-auto mb-4 opacity-50" />
            <p>Enter an image URL above to start creating your world</p>
          </div>
        )}
      </div>

      <div className="w-80 bg-slate-800 rounded-lg p-4 overflow-auto">
        <h3 className="text-lg font-semibold text-white mb-4">Locations</h3>

        {locations.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            <p className="text-sm">Click on the image to add locations</p>
          </div>
        )}

        {selectedLocation && (
          <div className="space-y-4 border-t border-slate-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Edit Location</h4>
              <button
                onClick={() => setSelectedLocationId(null)}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <X size={16} className="text-slate-400" />
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
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
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
                className="w-full px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded text-left flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <LinkIcon size={14} />
                  {location.name}
                </span>
                <span className="text-xs text-slate-400">
                  {Math.round(location.x)}%, {Math.round(location.y)}%
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
