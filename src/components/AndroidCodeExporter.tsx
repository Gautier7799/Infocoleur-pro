import React, { useState } from 'react';
import { ANDROID_SOURCE_FILES, AndroidSourceFile } from '../data/androidSourceCode';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Terminal,
  FolderGit2
} from 'lucide-react';

export const AndroidCodeExporter: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeFile = ANDROID_SOURCE_FILES[activeFileIndex];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = () => {
    const allCode = ANDROID_SOURCE_FILES.map(
      (f) => `// ================================\n// File: ${f.path}\n// ${f.description}\n// ================================\n\n${f.code}\n\n`
    ).join('\n');
    navigator.clipboard.writeText(allCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl w-full">
      {/* الرأس والتعليمات */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            <span>كود تطبيق أندرويد الكامل (Kotlin + Jetpack Compose)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            أكواد احترافية ومستقرة 100% جاهزة للنسخ واللصق مباشرة في مشروع Android Studio لهاتف Pixel 8
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all border border-zinc-700"
          >
            <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
            <span>نسخ جميع الملفات دفعة واحدة</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ هذا الملف'}</span>
          </button>
        </div>
      </div>

      {/* شريط اختيار الملفات */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 scrollbar-none">
        {ANDROID_SOURCE_FILES.map((file, idx) => (
          <button
            key={file.name}
            onClick={() => {
              setActiveFileIndex(idx);
              setCopied(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeFileIndex === idx
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{file.name}</span>
          </button>
        ))}
      </div>

      {/* وصف ومسار الملف المختار */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <Terminal className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="truncate">
            <p className="text-xs font-mono text-blue-300 font-semibold truncate">{activeFile.path}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{activeFile.description}</p>
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono uppercase bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">
          {activeFile.category}
        </span>
      </div>

      {/* محرر عرض الكود مع الترقيم والتنسيق */}
      <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800/90 overflow-hidden text-left" dir="ltr">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs text-zinc-400 font-mono">
          <span>{activeFile.name}</span>
          <span>Kotlin / Android SDK 35</span>
        </div>

        <pre className="p-4 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[380px] leading-relaxed select-all">
          <code>{activeFile.code}</code>
        </pre>
      </div>

      {/* لمسات الشراكة وأفضل الممارسات التقنية */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-emerald-400">
            <Cpu className="w-4 h-4" />
            <span>حماية البطارية (0% Drain)</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            يعتمد الكود على تعليق الروابط فور انتهاء الإشعار، واستخدام شاشة سوداء تماماً مع تقنية AMOLED لإلغاء أي استهلاك كهربائي.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-400">
            <ShieldCheck className="w-4 h-4" />
            <span>مستشعر الاقتراب (Proximity)</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            مستشعر الجيب مدمج تلقائياً لمنع إطلاق الفلاش أثناء وجود الهاتف في الجيب أو وضعه مقلوباً على الطاولة.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-pink-400">
            <Sparkles className="w-4 h-4" />
            <span>أحدث واجهات Camera2</span>
          </div>
          <p className="text-[11px] text-zinc-400 leading-normal">
            استخدام دالة <code className="text-pink-300">turnOnTorchWithStrengthLevel</code> المخصصة لنظام أندرويد 13 فما فوق للتحكم الدقيق بقوة الفلاش.
          </p>
        </div>
      </div>
    </div>
  );
};
