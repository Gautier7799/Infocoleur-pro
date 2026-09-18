import React from 'react';
import { AppLightConfig, DeviceSettings } from '../types';
import { 
  AppWindow, 
  Power, 
  Sparkles, 
  BatteryCharging, 
  ShieldCheck, 
  Sliders, 
  Flashlight,
  Volume2
} from 'lucide-react';

interface AndroidWidgetPreviewProps {
  apps: AppLightConfig[];
  settings: DeviceSettings;
  onTriggerTest: (app: AppLightConfig) => void;
  onTogglePower: () => void;
  isServiceEnabled: boolean;
}

export const AndroidWidgetPreview: React.FC<AndroidWidgetPreviewProps> = ({
  apps,
  settings,
  onTriggerTest,
  onTogglePower,
  isServiceEnabled,
}) => {
  const facebookApp = apps.find((a) => a.id === 'facebook') || apps[0];
  const whatsappApp = apps.find((a) => a.id === 'whatsapp') || apps[1];
  const callsApp = apps.find((a) => a.id === 'calls') || apps[2];

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <AppWindow className="w-4 h-4 text-blue-400" />
            <span>ويدجت الشاشة الرئيسية (Pixel Home Widget)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            ويدجت بنمط Material You (Android 14/15/16/17) للتحكم السريع مباشرة من الشاشة الرئيسية
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs border border-blue-500/20 font-mono">
          Glance 3x2 Widget
        </span>
      </div>

      {/* محاكاة ويدجت الشاشة الرئيسية الواقعي لهاتف Pixel 8 */}
      <div className="relative mx-auto max-w-md p-4 rounded-3xl bg-gradient-to-br from-zinc-800/90 via-zinc-850/95 to-zinc-900/90 border border-zinc-700/60 shadow-2xl backdrop-blur-xl">
        
        {/* الجزء العلوي للويدجت */}
        <div className="flex items-center justify-between mb-3 border-b border-zinc-700/50 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Flashlight className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-100">فلاش الإشعارات الذكي</h4>
              <p className="text-[10px] text-zinc-400 font-medium">Pixel Light Notify</p>
            </div>
          </div>

          {/* زر تشغيل/إيقاف الخدمة في الويدجت */}
          <button
            onClick={onTogglePower}
            className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isServiceEnabled
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{isServiceEnabled ? 'نشط ●' : 'متوقف'}</span>
          </button>
        </div>

        {/* أزرار التجربة السريعة داخل الويدجت */}
        <div className="mb-3">
          <span className="text-[10px] font-semibold text-zinc-400 block mb-1.5">
            تجربة فورية بنقرة واحدة (One-Tap Test):
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onTriggerTest(facebookApp)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/40 text-blue-300 transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-3 h-3 rounded-full bg-[#1877F2] shadow-[0_0_8px_#1877F2] mb-1" />
              <span className="text-[11px] font-bold">فيسبوك</span>
              <span className="text-[9px] text-blue-400/80 font-mono">أزرق ملكي</span>
            </button>

            <button
              onClick={() => onTriggerTest(whatsappApp)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/40 text-emerald-300 transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-3 h-3 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366] mb-1" />
              <span className="text-[11px] font-bold">واتساب</span>
              <span className="text-[9px] text-emerald-400/80 font-mono">أخضر</span>
            </button>

            <button
              onClick={() => onTriggerTest(callsApp)}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl bg-red-600/15 hover:bg-red-600/25 border border-red-500/40 text-red-300 transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-3 h-3 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444] mb-1" />
              <span className="text-[11px] font-bold">المكالمات</span>
              <span className="text-[9px] text-red-400/80 font-mono">أحمر</span>
            </button>
          </div>
        </div>

        {/* مؤشرات حماية الهاتف */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 bg-zinc-950/60 rounded-xl p-2 border border-zinc-800">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>حماية الجيب نشطة</span>
          </span>
          <span className="flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-emerald-400" />
            <span>استهلاك 0% في وضع السكون</span>
          </span>
        </div>
      </div>
    </div>
  );
};
