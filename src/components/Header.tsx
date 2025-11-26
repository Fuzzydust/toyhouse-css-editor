import { Project } from '../types';

interface HeaderProps {
  project: Project;
  onProjectUpdate: (updates: Partial<Project>) => void;
  onPageChange: (pageId: string) => void;
  onPageAdd: () => void;
}

export default function Header({ project }: HeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">{project.name}</h1>
        </div>
      </div>
    </header>
  );
}
