import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import CodeExportPanel from './components/CodeExportPanel';
import LayersPanel from './components/LayersPanel';
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
  const [history, setHistory] = useState<Project[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  const selectedElement = project.elements.find((el) => el.id === selectedElementId);

  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(project);
      return newHistory.slice(-50);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  }, [project]);

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
      isUndoRedoAction.current = true;
      const previousState = history[historyIndex - 1];
      setProject(previousState);
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextState = history[historyIndex + 1];
      setProject(nextState);
      setHistoryIndex((prev) => prev + 1);
    }
  };

  const addElement = (element: CanvasElement) => {
    setProject((prev) => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
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
      const elements = [...prev.elements];
      const element = elements.find((el) => el.id === id);
      if (!element) return prev;

      const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);
      const currentIndex = sortedElements.findIndex((el) => el.id === id);

      if (direction === 'up' && currentIndex > 0) {
        const targetElement = sortedElements[currentIndex - 1];
        const tempZIndex = element.zIndex;
        element.zIndex = targetElement.zIndex;
        targetElement.zIndex = tempZIndex;
      } else if (direction === 'down' && currentIndex < sortedElements.length - 1) {
        const targetElement = sortedElements[currentIndex + 1];
        const tempZIndex = element.zIndex;
        element.zIndex = targetElement.zIndex;
        targetElement.zIndex = tempZIndex;
      }

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
          />
          <CodeExportPanel project={project} />
        </div>
      </div>
    </div>
  );
}

export default App;
