import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  Terminal, 
  FolderTree, 
  ExternalLink,
  Code2,
  Sparkles,
  Loader2
} from 'lucide-react';

interface SourceFile {
  path: string;
  name: string;
  exists: boolean;
  content: string;
  size: number;
}

interface SourceCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceCodeModal: React.FC<SourceCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [files, setFiles] = useState<SourceFile[]>([]);
  const [selectedFilePath, setSelectedFilePath] = useState<string>('src/App.tsx');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/codebase')
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.files)) {
            setFiles(data.files);
            if (!data.files.some((f: SourceFile) => f.path === selectedFilePath)) {
              if (data.files.length > 0) {
                setSelectedFilePath(data.files[0].path);
              }
            }
          }
        })
        .catch(err => console.error('Failed to load codebase:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentFile = files.find(f => f.path === selectedFilePath) || files[0];

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fade-in" dir="rtl">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">كود مشروع فرحة كاملاً</h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-bold">
                  React + TypeScript
                </span>
              </div>
              <p className="text-xs text-slate-400">
                يمكنك تحميل المشروع كاملاً كملف ZIP أو تصفح ونسخ أي ملف برمجي بنقرة واحدة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct ZIP Download button */}
            <a
              href="/api/download-zip"
              download="farha-events-iraq.zip"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>تحميل الكل ZIP</span>
            </a>

            {/* Close modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/60 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col p-3 overflow-y-auto max-h-48 md:max-h-none">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2.5 px-2">
              <FolderTree className="w-3.5 h-3.5 text-amber-400" />
              <span>ملفات المشروع ({files.length})</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-6 text-slate-400 text-xs gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                <span>جاري قراءة الملفات...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {files.map((file) => {
                  const isSelected = file.path === currentFile?.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-rose-600 text-white font-bold shadow-xs'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className={`text-[10px] opacity-60 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                        {(file.size / 1024).toFixed(1)}k
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
            {/* File Path and Copy Action */}
            <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-400 truncate">
                <span className="text-amber-400">📁</span>
                <span className="text-slate-200 font-semibold">{currentFile?.path || 'اختر ملفاً'}</span>
              </div>

              <button
                onClick={handleCopy}
                disabled={!currentFile}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ كود الملف</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed bg-[#0d1117] selection:bg-rose-600 selection:text-white">
              {currentFile ? (
                <pre className="whitespace-pre overflow-x-auto select-text font-mono" dir="ltr">
                  <code>{currentFile.content}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  لم يتم اختيار ملف
                </div>
              )}
            </div>

            {/* Quick terminal instructions */}
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>أوامر التشغيل:</span>
                <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 border border-slate-800">
                  npm install
                </code>
                <span>ثم</span>
                <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 border border-slate-800">
                  npm run dev
                </code>
              </div>

              <a
                href="/api/download-zip"
                download="farha-events-iraq.zip"
                className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تنزيل كل الملفات في مجلد واحد (ZIP)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
