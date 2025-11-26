import { useRef, useState } from 'react';
import { Project, CanvasElement } from '../types';

interface CanvasProps {
  project: Project;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

export default function Canvas({
  project,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{
    id: string;
    startX: number;
    startY: number;
    elementX: number;
    elementY: number;
  } | null>(null);

  const [resizing, setResizing] = useState<{
    id: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    handle: string;
  } | null>(null);

  const [rotating, setRotating] = useState<{
    id: string;
    startAngle: number;
    elementRotation: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const handleElementClick = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (element.locked) return;
    onSelectElement(element.id);
  };

  const handleMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (element.locked) return;

    const target = e.target as HTMLElement;
    if (target.classList.contains('rotate-handle') || target.closest('.rotate-handle')) {
      const elementDiv = e.currentTarget as HTMLElement;
      const rect = elementDiv.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);

      setRotating({
        id: element.id,
        startAngle,
        elementRotation: element.rotation,
        centerX,
        centerY,
      });
    } else if (target.classList.contains('resize-handle')) {
      setResizing({
        id: element.id,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: element.width,
        startHeight: element.height,
        handle: target.dataset.handle || '',
      });
    } else {
      setDragging({
        id: element.id,
        startX: e.clientX,
        startY: e.clientY,
        elementX: element.x,
        elementY: element.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const deltaX = e.clientX - dragging.startX;
      const deltaY = e.clientY - dragging.startY;
      onUpdateElement(dragging.id, {
        x: dragging.elementX + deltaX,
        y: dragging.elementY + deltaY,
      });
    } else if (resizing) {
      const deltaX = e.clientX - resizing.startX;
      const deltaY = e.clientY - resizing.startY;

      let newWidth = resizing.startWidth;
      let newHeight = resizing.startHeight;

      if (resizing.handle.includes('e')) newWidth += deltaX;
      if (resizing.handle.includes('w')) newWidth -= deltaX;
      if (resizing.handle.includes('s')) newHeight += deltaY;
      if (resizing.handle.includes('n')) newHeight -= deltaY;

      onUpdateElement(resizing.id, {
        width: Math.max(20, newWidth),
        height: Math.max(20, newHeight),
      });
    } else if (rotating) {
      const currentAngle = Math.atan2(e.clientY - rotating.centerY, e.clientX - rotating.centerX) * (180 / Math.PI);
      const angleDiff = currentAngle - rotating.startAngle;
      const newRotation = rotating.elementRotation + angleDiff;

      onUpdateElement(rotating.id, {
        rotation: Math.round(newRotation),
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setResizing(null);
    setRotating(null);
  };

  const renderElement = (element: CanvasElement) => {
    if (element.visible === false) return null;

    const isSelected = element.id === selectedElementId;
    const isLocked = element.locked === true;

    const style: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      transform: `rotate(${element.rotation}deg)`,
      cursor: isLocked ? 'not-allowed' : 'move',
      pointerEvents: 'auto',
      ...element.styles,
    };

    if (element.styles?.mixBlendMode) {
      style.mixBlendMode = element.styles.mixBlendMode as any;
    }

    if (element.type === 'text') {
      style.display = 'flex';
      style.alignItems = 'center';
      style.justifyContent = 'center';
      style.fontSize = element.fontSize;
      style.color = element.fontColor;
      style.fontFamily = element.fontFamily;
      style.textAlign = element.textAlign as any;
    }

    if (element.type === 'shape' && element.shapeType === 'triangle') {
      style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    }

    if (element.type === 'shape' && element.shapeType === 'polygon' && element.sides) {
      style.clipPath = createPolygonClipPath(element.sides);
    }

    const content = element.type === 'text' ? (element.content || 'Text') : null;

    const elementContent = (
      <>
        {content}
        {element.link && !isSelected && (
          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-none">
            🔗
          </div>
        )}

        {isSelected && !isLocked && (
          <>
            <div className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize" data-handle="nw" />
            <div className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize" data-handle="ne" />
            <div className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-sw-resize" data-handle="sw" />
            <div className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize" data-handle="se" />
            <div className="rotate-handle absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full cursor-grab hover:bg-green-400 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="pointer-events-none">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
              </svg>
            </div>
          </>
        )}
        {isSelected && isLocked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-slate-900/80 text-yellow-400 px-2 py-1 rounded text-xs font-semibold">
              Locked
            </div>
          </div>
        )}
      </>
    );

    return (
      <div
        key={element.id}
        style={style}
        onClick={(e) => handleElementClick(e, element)}
        onMouseDown={(e) => handleMouseDown(e, element)}
        className={`${isSelected ? 'ring-2 ring-blue-500' : ''} ${element.link ? 'cursor-pointer hover:opacity-80' : ''}`}
      >
        {elementContent}
      </div>
    );
  };

  const createPolygonClipPath = (sides: number): string => {
    const points: string[] = [];
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2;

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const x = 50 + 50 * Math.cos(angle);
      const y = 50 + 50 * Math.sin(angle);
      points.push(`${x}% ${y}%`);
    }

    return `polygon(${points.join(', ')})`;
  };

  return (
    <div className="flex-1 overflow-auto p-8 bg-slate-800/50">
      <div
        ref={canvasRef}
        className="relative mx-auto shadow-2xl"
        style={{
          width: project.canvasWidth,
          height: project.canvasHeight,
          background: project.canvasBackground,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={() => onSelectElement(null)}
      >
        {project.elements.map(renderElement)}
      </div>
    </div>
  );
}
