import { useState, useRef, useEffect } from 'react';
import { Upload, X, Move, Lock, Unlock } from 'lucide-react';

interface PageDoll {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  locked: boolean;
}

function App() {
  const [pageDolls, setPageDolls] = useState<PageDoll[]>([]);
  const [draggedDoll, setDraggedDoll] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showPanel, setShowPanel] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxHeight = 300;
        const aspectRatio = img.width / img.height;
        const height = Math.min(maxHeight, img.height);
        const width = height * aspectRatio;

        const newDoll: PageDoll = {
          id: Date.now().toString(),
          imageUrl: event.target?.result as string,
          x: window.innerWidth - width - 20,
          y: window.innerHeight - height - 20,
          width,
          height,
          locked: false,
        };
        setPageDolls((prev) => [...prev, newDoll]);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUrlSubmit = (url: string) => {
    if (!url.trim()) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const maxHeight = 300;
      const aspectRatio = img.width / img.height;
      const height = Math.min(maxHeight, img.height);
      const width = height * aspectRatio;

      const newDoll: PageDoll = {
        id: Date.now().toString(),
        imageUrl: url,
        x: window.innerWidth - width - 20,
        y: window.innerHeight - height - 20,
        width,
        height,
        locked: false,
      };
      setPageDolls((prev) => [...prev, newDoll]);
    };
    img.onerror = () => {
      alert('Failed to load image from URL');
    };
    img.src = url;
  };

  const removeDoll = (id: string) => {
    setPageDolls((prev) => prev.filter((doll) => doll.id !== id));
  };

  const toggleLock = (id: string) => {
    setPageDolls((prev) =>
      prev.map((doll) =>
        doll.id === id ? { ...doll, locked: !doll.locked } : doll
      )
    );
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const doll = pageDolls.find((d) => d.id === id);
    if (!doll || doll.locked) return;

    setDraggedDoll(id);
    setDragOffset({
      x: e.clientX - doll.x,
      y: e.clientY - doll.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedDoll) return;

      setPageDolls((prev) =>
        prev.map((doll) =>
          doll.id === draggedDoll
            ? {
                ...doll,
                x: e.clientX - dragOffset.x,
                y: e.clientY - dragOffset.y,
              }
            : doll
        )
      );
    };

    const handleMouseUp = () => {
      setDraggedDoll(null);
    };

    if (draggedDoll) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedDoll, dragOffset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Page Doll Tool</h1>
          <p className="text-slate-300 text-lg">
            Add draggable image overlays to your page
          </p>
        </header>

        <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">
                Upload Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Upload size={20} />
                Choose Image File
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800 text-slate-400">or</span>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-3">
                Image URL
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const url = formData.get('imageUrl') as string;
                  handleImageUrlSubmit(url);
                  e.currentTarget.reset();
                }}
              >
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="imageUrl"
                    placeholder="https://example.com/image.png"
                    className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>

            {pageDolls.length > 0 && (
              <div className="pt-6 border-t border-slate-700">
                <h3 className="text-white font-medium mb-3">Active Page Dolls</h3>
                <div className="space-y-2">
                  {pageDolls.map((doll) => (
                    <div
                      key={doll.id}
                      className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg"
                    >
                      <img
                        src={doll.imageUrl}
                        alt="Page doll thumbnail"
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 text-sm text-slate-400">
                        Position: ({Math.round(doll.x)}, {Math.round(doll.y)})
                      </div>
                      <button
                        onClick={() => toggleLock(doll.id)}
                        className="p-2 hover:bg-slate-700 rounded transition-colors text-slate-400 hover:text-white"
                        title={doll.locked ? 'Unlock' : 'Lock'}
                      >
                        {doll.locked ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                      <button
                        onClick={() => removeDoll(doll.id)}
                        className="p-2 hover:bg-red-600 rounded transition-colors text-slate-400 hover:text-white"
                        title="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700 p-6">
            <h3 className="text-white font-medium mb-3">How to Use</h3>
            <ul className="space-y-2 text-slate-300">
              <li>• Upload an image or paste an image URL</li>
              <li>• Drag the page doll anywhere on the screen</li>
              <li>• Click the lock icon to prevent accidental movement</li>
              <li>• Click the X icon to remove a page doll</li>
            </ul>
          </div>
        </div>
      </div>

      {pageDolls.map((doll) => (
        <div
          key={doll.id}
          className={`page-doll fixed ${doll.locked ? 'cursor-not-allowed' : 'cursor-move'}`}
          style={{
            left: `${doll.x}px`,
            top: `${doll.y}px`,
            zIndex: 9999,
          }}
          onMouseDown={(e) => handleMouseDown(e, doll.id)}
        >
          <img
            src={doll.imageUrl}
            alt="Page doll"
            style={{
              maxHeight: `${doll.height}px`,
              width: 'auto',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            className="shadow-2xl rounded-lg"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
