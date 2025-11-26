import { Layers, Eye, EyeOff, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { CanvasElement } from '../types';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onReorderElement: (id: string, direction: 'up' | 'down') => void;
}

export default function LayersPanel({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onReorderElement,
}: LayersPanelProps) {
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementLabel = (el: CanvasElement): string => {
    if (el.type === 'text') return el.content || 'Text';
    if (el.type === 'pagedoll') return 'Page Doll';
    if (el.type === 'shape') return el.shapeType || 'Shape';
    return el.type;
  };

  return (
    <div className="w-64 bg-slate-900 border-l border-slate-700 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Layers</h3>
        </div>
      </div>

      <div className="p-2">
        {sortedElements.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">No elements yet</p>
        ) : (
          <div className="space-y-1">
            {sortedElements.map((el, index) => (
              <div
                key={el.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                  selectedElementId === el.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => onSelectElement(el.id)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement(el.id, { visible: !el.visible });
                  }}
                  className="p-1 hover:bg-slate-600 rounded"
                >
                  {el.visible !== false ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <span className="flex-1 text-sm truncate">{getElementLabel(el)}</span>

                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderElement(el.id, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderElement(el.id, 'down');
                    }}
                    disabled={index === sortedElements.length - 1}
                    className="p-1 hover:bg-slate-600 rounded disabled:opacity-30"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="p-1 hover:bg-red-600 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
