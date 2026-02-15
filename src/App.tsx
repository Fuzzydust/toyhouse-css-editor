import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import CodeExportPanel from './components/CodeExportPanel';
import LayersPanel from './components/LayersPanel';
import WorldMaker from './components/WorldMaker';
import { CanvasElement, Project, Page } from './types';

function App() {
  const [project, setProject] = useState<Project>({
    name: 'Untitled Project',
    canvasWidth: 800,
    canvasHeight: 1200,
    canvasBackground: '#ffffff',
    elements: [],
    pages: [],
    currentPageId: undefined,
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [worldMakerMode, setWorldMakerMode] = useState(false);
  const [history, setHistory] = useState<Project[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);
  const historyTimeoutRef = useRef<number | null>(null);

  const selectedElement = project.elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }

    historyTimeoutRef.current = setTimeout(() => {
      setHistory((prev) => {
        const lastState = prev[historyIndex];
        if (lastState && JSON.stringify(lastState) === JSON.stringify(project)) {
          return prev;
        }
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(project);
        return newHistory.slice(-50);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 49));
    }, 400);

    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, [project, historyIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const undo = () => {
    if (historyIndex > 0) {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
        historyTimeoutRef.current = null;
      }
      isUndoRedoAction.current = true;
      const previousState = history[historyIndex - 1];
      setProject(previousState);
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
        historyTimeoutRef.current = null;
      }
      isUndoRedoAction.current = true;
      const nextState = history[historyIndex + 1];
      setProject(nextState);
      setHistoryIndex((prev) => prev + 1);
    }
  };

  const addElement = (element: CanvasElement) => {
    setProject((prev) => {
      const maxZIndex = prev.elements.reduce((max, el) => Math.max(max, el.zIndex), 0);
      const newElement = { ...element, zIndex: maxZIndex + 1 };
      return {
        ...prev,
        elements: [...prev.elements, newElement],
      };
    });
    setSelectedElementId(element.id);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setProject((prev) => ({
      ...prev,
      elements: prev.elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    }));
  };

  const deleteElement = (id: string) => {
    setProject((prev) => ({
      ...prev,
      elements: prev.elements.filter((el) => el.id !== id),
    }));
    setSelectedElementId(null);
  };

  const reorderElement = (id: string, direction: 'up' | 'down') => {
    setProject((prev) => {
      const element = prev.elements.find((el) => el.id === id);
      if (!element) return prev;

      const sortedElements = [...prev.elements].sort((a, b) => b.zIndex - a.zIndex);
      const currentIndex = sortedElements.findIndex((el) => el.id === id);

      let targetElementId: string | null = null;
      if (direction === 'up' && currentIndex > 0) {
        targetElementId = sortedElements[currentIndex - 1].id;
      } else if (direction === 'down' && currentIndex < sortedElements.length - 1) {
        targetElementId = sortedElements[currentIndex + 1].id;
      }

      if (!targetElementId) return prev;

      const targetElement = prev.elements.find((el) => el.id === targetElementId);
      if (!targetElement) return prev;

      const elements = prev.elements.map((el) => {
        if (el.id === id) {
          return { ...el, zIndex: targetElement.zIndex };
        }
        if (el.id === targetElementId) {
          return { ...el, zIndex: element.zIndex };
        }
        return el;
      });

      return { ...prev, elements };
    });
  };

  const updateCanvasSettings = (updates: Partial<Project>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  };

  const addPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      name: `Page ${(project.pages?.length || 0) + 1}`,
      canvasWidth: 800,
      canvasHeight: 1200,
      canvasBackground: '#ffffff',
      elements: [],
    };
    setProject((prev) => ({
      ...prev,
      pages: [...(prev.pages || []), newPage],
    }));
  };

  const changePage = (pageId: string) => {
    if (pageId === 'main') {
      setProject((prev) => ({ ...prev, currentPageId: undefined }));
    } else {
      setProject((prev) => ({ ...prev, currentPageId: pageId }));
    }
    setSelectedElementId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <Header
        project={project}
        onProjectUpdate={updateCanvasSettings}
        onPageChange={changePage}
        onPageAdd={addPage}
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
      />

      {worldMakerMode && selectedElement?.type === 'world' ? (
        <div className="flex-1 overflow-hidden">
          <WorldMaker
            element={selectedElement}
            onUpdateElement={updateElement}
            pages={project.pages?.map(p => ({ id: p.id, name: p.name })) || []}
            onClose={() => setWorldMakerMode(false)}
          />
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Toolbar onAddElement={addElement} />

          <main className="flex-1 flex flex-col overflow-hidden">
            <Canvas
              project={project}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
              onUpdateElement={updateElement}
            />
          </main>

          <LayersPanel
            elements={project.elements}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={updateElement}
            onDeleteElement={deleteElement}
            onReorderElement={reorderElement}
          />

          <div className="w-80 bg-slate-900 border-l border-slate-700 overflow-y-auto">
            <PropertiesPanel
              element={selectedElement}
              onUpdateElement={updateElement}
              onDeleteElement={deleteElement}
              canvasSettings={{
                width: project.canvasWidth,
                height: project.canvasHeight,
                background: project.canvasBackground,
              }}
              onUpdateCanvas={updateCanvasSettings}
              onEditWorld={() => setWorldMakerMode(true)}
            />
            <CodeExportPanel project={project} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
