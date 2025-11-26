import { Square, Image, Type, Circle, Triangle, Hexagon, Scroll } from 'lucide-react';
import { CanvasElement } from '../types';

interface ToolbarProps {
  onAddElement: (element: CanvasElement) => void;
}

export default function Toolbar({ onAddElement }: ToolbarProps) {
  const createDiv = () => {
    const element: CanvasElement = {
      id: `div-${Date.now()}`,
      type: 'div',
      x: 100,
      y: 100,
      width: 200,
      height: 200,
      rotation: 0,
      zIndex: 1,
      styles: {
        backgroundColor: '#3b82f6',
        borderRadius: 0,
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createImage = () => {
    const url = prompt('Enter image URL:');
    if (!url) return;

    const element: CanvasElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      rotation: 0,
      zIndex: 1,
      styles: {
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createPageDoll = () => {
    const url = prompt('Enter image URL for page doll:');
    if (!url) return;

    const element: CanvasElement = {
      id: `pagedoll-${Date.now()}`,
      type: 'pagedoll',
      x: 10,
      y: 10,
      width: 200,
      height: 300,
      rotation: 0,
      zIndex: 100,
      scrollBehavior: 'fixed',
      styles: {
        backgroundImage: `url(${url})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createText = () => {
    const element: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: 1,
      content: 'Edit me',
      fontSize: 16,
      fontColor: '#000000',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      styles: {
        backgroundColor: 'transparent',
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createCircle = () => {
    const element: CanvasElement = {
      id: `circle-${Date.now()}`,
      type: 'shape',
      shapeType: 'circle',
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      rotation: 0,
      zIndex: 1,
      styles: {
        backgroundColor: '#ef4444',
        borderRadius: '50%',
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createRectangle = () => {
    const element: CanvasElement = {
      id: `rect-${Date.now()}`,
      type: 'shape',
      shapeType: 'rectangle',
      x: 100,
      y: 100,
      width: 200,
      height: 120,
      rotation: 0,
      zIndex: 1,
      styles: {
        backgroundColor: '#8b5cf6',
        borderRadius: 8,
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createTriangle = () => {
    const element: CanvasElement = {
      id: `triangle-${Date.now()}`,
      type: 'shape',
      shapeType: 'triangle',
      x: 100,
      y: 100,
      width: 150,
      height: 130,
      rotation: 0,
      zIndex: 1,
      styles: {
        backgroundColor: '#10b981',
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const createPolygon = (sides: number) => {
    const element: CanvasElement = {
      id: `polygon-${Date.now()}`,
      type: 'shape',
      shapeType: 'polygon',
      sides,
      x: 100,
      y: 100,
      width: 150,
      height: 150,
      rotation: 0,
      zIndex: 1,
      styles: {
        backgroundColor: '#f59e0b',
        opacity: 1,
      },
    };
    onAddElement(element);
  };

  const tools = [
    { icon: Square, label: 'Div', onClick: createDiv, color: 'from-blue-500 to-blue-600' },
    { icon: Image, label: 'Image', onClick: createImage, color: 'from-rose-500 to-rose-600' },
    { icon: Scroll, label: 'Page Doll', onClick: createPageDoll, color: 'from-cyan-500 to-cyan-600' },
    { icon: Type, label: 'Text', onClick: createText, color: 'from-green-500 to-green-600' },
    { icon: Circle, label: 'Circle', onClick: createCircle, color: 'from-red-500 to-red-600' },
    { icon: Square, label: 'Rectangle', onClick: createRectangle, color: 'from-violet-500 to-violet-600' },
    { icon: Triangle, label: 'Triangle', onClick: createTriangle, color: 'from-emerald-500 to-emerald-600' },
    { icon: Hexagon, label: 'Hexagon', onClick: () => createPolygon(6), color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <aside className="w-20 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-6 gap-4">
      <div className="text-xs font-semibold text-slate-400 mb-2">TOOLS</div>
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            onClick={tool.onClick}
            className="group relative flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-800 transition-all"
            title={tool.label}
          >
            <div className={`p-2 bg-gradient-to-br ${tool.color} rounded-lg group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-slate-400 group-hover:text-white">{tool.label}</span>
          </button>
        );
      })}
    </aside>
  );
}
