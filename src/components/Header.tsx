import { Project } from '../types';
import { Undo2, Redo2 } from 'lucide-react';

interface HeaderProps {
  project: Project;
  onProjectUpdate: (updates: Partial<Project>) => void;
  onPageChange: (pageId: string) => void;
  onPageAdd: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Header({ project, onUndo, onRedo, canUndo, canRedo }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">{project.name}</h1>

          <div className="flex items-center gap-2 ml-8">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 rounded-lg hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
