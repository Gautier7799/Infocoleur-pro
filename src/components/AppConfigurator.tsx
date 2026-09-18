import React, { useState } from 'react';
import { AppLightConfig, FlashMode } from '../types';
import { 
  Palette, 
  Sliders, 
  Plus, 
  Sparkles, 
  Bell, 
  Check, 
  Play, 
  Trash2,
  Settings2,
  Zap,
  Layers,
  CircleDot
} from 'lucide-react';

interface AppConfiguratorProps {
  apps: AppLightConfig[];
  selectedApp: AppLightConfig;
  onSelectApp: (app: AppLightConfig) => void;
  onUpdateApp: (updatedApp: AppLightConfig) => void;
  onAddApp: (newApp: AppLightConfig) => void;
  onDeleteApp: (id: string) => void;
  onTestFlash: (app: AppLightConfig) => void;
}

const COLOR_PRESETS = [
  { name: 'أزرق فيسبوك', hex: '#1877F2' },
  { name: 'أخضر واتساب', hex: '#25D366' },
  { name: 'وردي إنستغرام', hex: '#E1306C' },
  { name: 'سماوي تيليجرام', hex: '#0088CC' },
  { name: 'أصفر سناب شات', hex: '#FFFC00' },
  { name: 'أحمر مكالمات', hex: '#EF4444' },
  { name: 'فيروزي نيون', hex: '#00F2FE' },
  { name: 'بنفسجي ملكي', hex: '#8B5CF6' },
  { name: 'برتقالي مشرق', hex: '#F97316' },
  { name: 'أبيض ناصع', hex: '#FFFFFF' }
];

export const AppConfigurator: React.FC<AppConfiguratorProps> = ({
  apps,
  selectedApp,
  onSelectApp,
  onUpdateApp,
  onAddApp,
  onDeleteApp,
  onTestFlash,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newPackageName, setNewPackageName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');

  const handleAddNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    const newApp: AppLightConfig = {
      id: 'custom_' + Date.now(),
      name: newAppName.trim(),
      packageName: newPackageName.trim() || 'com.custom.app',
      brandColor: newColor,
      flashMode: 'pulse',
      flashCount: 2,
      flashSpeedMs: 180,
      edgeLightingEnabled: true,
      rearIndicatorEnabled: true,
      cameraRingEnabled: true,
      screenFlashEnabled: true,
      enabled: true,
      customRhythmName: 'نمط إشعار مخصص'
    };

    onAddApp(newApp);
    onSelectApp(newApp);
    setNewAppName('');
    setNewPackageName('');
    setIsAddingNew(false);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* قائمة التطبيقات المجهزة */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span>تطبيقات الإشعارات الضوئية</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              حدد لون ونمط وميض الفلاش المخصص لكل تطبيق
            </p>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة تطبيق جديد</span>
          </button>
        </div>

        {/* نموذج إضافة تطبيق مخصص */}
        {isAddingNew && (
          <form onSubmit={handleAddNewApp} className="mb-4 p-4 rounded-2xl bg-zinc-950 border border-blue-500/40 animate-fadeIn">
            <h3 className="text-xs font-bold text-blue-400 mb-2">إضافة تطبيق مخصص لقائمة الإشعارات</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">اسم التطبيق</label>
                <input
                  type="text"
                  placeholder="مثال: ديسكورد، لينكدإن..."
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">اسم الحزمة (Package Name)</label>
                <input
                  type="text"
                  placeholder="مثال: com.discord"
                  value={newPackageName}
                  onChange={(e) => setNewPackageName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">اختر اللون:</span>
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-zinc-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                >
                  حفظ التطبيق
                </button>
              </div>
            </div>
          </form>
        )}

        {/* شبكة أزرار التطبيقات لاختيار التطبيق النشط */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {apps.map((app) => {
            const isSelected = selectedApp.id === app.id;
            return (
              <button
                key={app.id}
                onClick={() => onSelectApp(app)}
                className={`flex items-center justify-between p-3 rounded-2xl border text-right transition-all ${
                  isSelected
                    ? 'bg-zinc-800/90 border-white/40 shadow-lg scale-[1.01]'
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-800/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 transition-transform"
                    style={{
                      backgroundColor: app.brandColor,
                      boxShadow: `0 0 10px ${app.brandColor}99`
                    }}
                  />
                  <div className="truncate text-right">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                      {app.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate font-mono">
                      {app.flashCount} ومضات • {app.flashMode}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTestFlash(app);
                  }}
                  title="تجربة فورية في المحاكي"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors ml-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </button>
            );
          })}
        </div>
      </div>

      {/* لوحة التخصيص الدقيق للتطبيق المحدد (Selected App Config) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md"
              style={{
                backgroundColor: selectedApp.brandColor,
                boxShadow: `0 0 16px ${selectedApp.brandColor}80`
              }}
            >
              {selectedApp.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <span>تخصيص: {selectedApp.name}</span>
                {selectedApp.id === 'facebook' && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30">
                    أزرق فيسبوك المطلوب
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">{selectedApp.packageName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTestFlash(selectedApp)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>تشغيل التجربة</span>
            </button>
          </div>
        </div>

        {/* 1. اختيار اللون والتدرجات النيونية */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-400" />
              <span>لون وميض الإشعار (Light Color):</span>
            </label>
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              <span>{selectedApp.brandColor}</span>
              <input
                type="color"
                value={selectedApp.brandColor}
                onChange={(e) => onUpdateApp({ ...selectedApp, brandColor: e.target.value })}
                className="w-6 h-6 rounded-md cursor-pointer bg-transparent border-0"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                onClick={() => onUpdateApp({ ...selectedApp, brandColor: preset.hex })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs border transition-all ${
                  selectedApp.brandColor.toLowerCase() === preset.hex.toLowerCase()
                    ? 'border-white bg-zinc-800 text-white font-bold shadow-md'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.hex }}
                />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. نمط الفلاش والسرعة وعدد الومضات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              عدد الومضات (Pulse Count):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={selectedApp.flashCount}
                onChange={(e) => onUpdateApp({ ...selectedApp, flashCount: parseInt(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold font-mono text-blue-400 bg-blue-950/60 px-2 py-1 rounded-lg border border-blue-800/50">
                {selectedApp.flashCount}
              </span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-2">
              سرعة الوميض (Speed ms):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="80"
                max="500"
                step="20"
                value={selectedApp.flashSpeedMs}
                onChange={(e) => onUpdateApp({ ...selectedApp, flashSpeedMs: parseInt(e.target.value) })}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold font-mono text-blue-400 bg-blue-950/60 px-2 py-1 rounded-lg border border-blue-800/50">
                {selectedApp.flashSpeedMs}ms
              </span>
            </div>
          </div>
        </div>

        {/* 3. خيارات الإضاءة التفاعلية (المؤشر الخلفي، إضاءة الحواف، حلقة الكاميرا) */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-200 block mb-1">
            مناطق الإضاءة النشطة لهذا التطبيق:
          </label>

          {/* فلاش ومؤشر الكاميرا الخلفي */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <CircleDot className="w-4 h-4 text-blue-400" />
              <div>
                <p className="text-xs font-bold text-zinc-200">فلاش ومؤشر LED الكاميرا الخلفي</p>
                <p className="text-[10px] text-zinc-500">وميض الفلاش ومؤشر شريط الكاميرا (الذي في صورتك)</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedApp.rearIndicatorEnabled}
              onChange={(e) => onUpdateApp({ ...selectedApp, rearIndicatorEnabled: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* إضاءة حواف الشاشة الملونة */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-zinc-200">إضاءة حواف الشاشة (Edge Lighting)</p>
                <p className="text-[10px] text-zinc-500">حواف نيونية ملونة بنفس لون التطبيق (شاشات AMOLED)</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedApp.edgeLightingEnabled}
              onChange={(e) => onUpdateApp({ ...selectedApp, edgeLightingEnabled: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>

          {/* حلقة ثقب الكاميرا الأمامية */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <div>
                <p className="text-xs font-bold text-zinc-200">حلقة الكاميرا الأمامية (Punch-Hole Ring)</p>
                <p className="text-[10px] text-zinc-500">حلقة ضوئية تدور حول عدسة السيلفي في Pixel 8</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selectedApp.cameraRingEnabled}
              onChange={(e) => onUpdateApp({ ...selectedApp, cameraRingEnabled: e.target.checked })}
              className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
