import React, { useState, useEffect } from 'react';
import { AppLightConfig, DeviceSettings, NotificationEvent } from '../types';
import { 
  Flashlight, 
  RotateCw, 
  Smartphone, 
  Eye, 
  ShieldAlert, 
  Battery, 
  Volume2, 
  VolumeX, 
  Layers, 
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  MessageSquare
} from 'lucide-react';

interface PixelDeviceSimulatorProps {
  currentApp: AppLightConfig;
  settings: DeviceSettings;
  activeNotification: NotificationEvent | null;
  onTriggerTest: (app: AppLightConfig) => void;
  onUpdateSettings: (newSettings: Partial<DeviceSettings>) => void;
}

export const PixelDeviceSimulator: React.FC<PixelDeviceSimulatorProps> = ({
  currentApp,
  settings,
  activeNotification,
  onTriggerTest,
  onUpdateSettings,
}) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [pulseStep, setPulseStep] = useState(0);

  // تشغيل وميض الفلاش والضوء عند استقبال إشعار
  useEffect(() => {
    if (!activeNotification) {
      setIsFlashing(false);
      return;
    }

    if (settings.isPocketMode) {
      // مستشعر الجيب يمنع الإضاءة لتوفير البطارية ومنع الإزعاج
      return;
    }

    setIsFlashing(true);
    let currentPulse = 0;
    const totalPulses = currentApp.flashCount;
    const intervalMs = currentApp.flashSpeedMs;

    const interval = setInterval(() => {
      currentPulse++;
      setPulseStep((prev) => (prev + 1) % 2);

      if (currentPulse >= totalPulses * 2) {
        clearInterval(interval);
        setTimeout(() => {
          setIsFlashing(false);
          setPulseStep(0);
        }, 300);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeNotification, currentApp, settings.isPocketMode]);

  const activeColor = activeNotification ? activeNotification.color : currentApp.brandColor;
  const isLightActive = isFlashing && (pulseStep % 2 === 0);

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* شريط التحكم العلوي السريع بمحاكي Pixel 8 */}
      <div className="w-full flex items-center justify-between mb-4 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl p-2 px-3 backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <button
            id="view-toggle-rear"
            onClick={() => onUpdateSettings({ activeView: 'rear' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              settings.activeView === 'rear'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Flashlight className="w-3.5 h-3.5" />
            <span>خلف الهاتف (الفلاش ومؤشر LED)</span>
          </button>
          <button
            id="view-toggle-front"
            onClick={() => onUpdateSettings({ activeView: 'front' })}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              settings.activeView === 'front'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>أمام الهاتف (إضاءة الحواف والشاشة)</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            title={settings.isPocketMode ? 'مستشعر الجيب نشط (لن يضيء في الجيب)' : 'تفعيل محاكاة مستشعر الجيب'}
            onClick={() => onUpdateSettings({ isPocketMode: !settings.isPocketMode })}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              settings.isPocketMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
          </button>

          <button
            title={settings.isScreenOn ? 'إطفاء الشاشة (وضع AMOLED لتوفير الطاقة)' : 'تشغيل الشاشة'}
            onClick={() => onUpdateSettings({ isScreenOn: !settings.isScreenOn })}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              !settings.isScreenOn
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Battery className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* هيكل هاتف Google Pixel 8 المحاكي بدقة هندسية */}
      <div className="relative w-[310px] h-[640px] sm:w-[330px] sm:h-[670px] bg-zinc-950 rounded-[46px] p-3 shadow-2xl border-4 border-zinc-700/80 ring-1 ring-white/10 flex items-center justify-center transition-all duration-300">
        
        {/* أزرار الجهاز الجانبية (Volume & Power buttons for Pixel 8) */}
        <div className="absolute -left-[7px] top-28 w-[4px] h-12 bg-zinc-700 rounded-l-md border-r border-zinc-900" />
        <div className="absolute -left-[7px] top-44 w-[4px] h-20 bg-zinc-700 rounded-l-md border-r border-zinc-900" />

        {/* جسم الهاتف الداخلي */}
        <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-zinc-900 flex flex-col justify-between select-none">
          
          {/* ===================== العرض الخلفي لهاتف PIXEL 8 ===================== */}
          {settings.activeView === 'rear' ? (
            <div className="relative w-full h-full bg-gradient-to-b from-zinc-800 via-zinc-850 to-zinc-900 flex flex-col justify-between p-4 overflow-hidden">
              {/* لمعة الزجاج الخلفية لهاتف بيكسل */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 pointer-events-none" />

              {/* شريط كاميرا Pixel 8 الأيقوني العريض (Camera Visor Bar) */}
              <div className="relative mt-8 w-full h-28 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-750 rounded-3xl p-2.5 shadow-xl border-y border-zinc-600/50 flex items-center justify-between px-5">
                
                {/* العدسات المزدوجة داخل الفتحة البيضاوية السوداء */}
                <div className="w-28 h-16 bg-black/95 rounded-full border border-zinc-800 flex items-center justify-evenly px-2 shadow-inner">
                  {/* العدسة الرئيسية Wide Camera */}
                  <div className="w-9 h-9 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-blue-900/60" />
                    <div className="absolute w-2 h-2 rounded-full bg-blue-400/30 blur-[1px] top-1 right-1" />
                  </div>
                  {/* عدسة الزاوية الواسعة Ultrawide Camera */}
                  <div className="w-7 h-7 rounded-full bg-zinc-950 border border-zinc-700 flex items-center justify-center relative overflow-hidden">
                    <div className="w-4 h-4 rounded-full bg-zinc-900 border border-cyan-900/60" />
                    <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400/30 blur-[1px] top-1 right-1" />
                  </div>
                </div>

                {/* الجانب الأيمن من شريط الكاميرا: مستشعر الحرارة + فلاش الكاميرا + مؤشر الإشعار الضوئي (كما في صورة المستخدم تماماً!) */}
                <div className="flex items-center gap-3">
                  {/* ميكروفون ومستشعر طيفي */}
                  <div className="w-2 h-2 rounded-full bg-zinc-950 border border-zinc-800" />

                  {/* مؤشر LED الخلفي الذكي (الذي رسم حوله المستخدم دائرة حمراء في الصورة!) */}
                  <div className="relative flex items-center justify-center">
                    <div 
                      className={`w-7 h-7 rounded-full transition-all duration-200 border flex items-center justify-center ${
                        isLightActive
                          ? 'border-white scale-125 shadow-2xl'
                          : 'bg-zinc-900 border-zinc-700'
                      }`}
                      style={{
                        backgroundColor: isLightActive ? activeColor : 'rgba(24, 24, 27, 0.8)',
                        boxShadow: isLightActive 
                          ? `0 0 25px 8px ${activeColor}, 0 0 50px 15px ${activeColor}80` 
                          : 'none'
                      }}
                    >
                      {/* النقطة المضيئة الدقيقة في المنتصف */}
                      <div 
                        className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                          isLightActive ? 'bg-white blur-[0.5px]' : 'bg-zinc-800'
                        }`} 
                      />
                    </div>

                    {/* هالة الضوء النيونية المنتشرة على ظهر الهاتف (Bloom effect) */}
                    {isLightActive && (
                      <div 
                        className="absolute w-28 h-28 rounded-full pointer-events-none animate-pulse blur-xl opacity-80"
                        style={{ backgroundColor: activeColor }}
                      />
                    )}
                  </div>

                  {/* عتاد الفلاش الخلفي الفعلي (Flashlight LED) مع نبضات Strobe */}
                  <div className="relative flex items-center justify-center">
                    <div 
                      className={`w-6 h-6 rounded-full border border-zinc-600/70 flex items-center justify-center transition-all ${
                        isLightActive && currentApp.rearIndicatorEnabled
                          ? 'bg-amber-100 shadow-[0_0_35px_12px_rgba(255,255,255,0.9)] scale-110'
                          : 'bg-amber-950/40'
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isLightActive && currentApp.rearIndicatorEnabled
                          ? 'bg-white'
                          : 'bg-amber-600/60'
                      }`} />
                    </div>
                  </div>
                </div>

              </div>

              {/* شعار Google G الأيقوني في منتصف ظهر الهاتف */}
              <div className="my-auto flex flex-col items-center justify-center opacity-40 hover:opacity-75 transition-opacity">
                <div className="w-9 h-9 rounded-full border-2 border-zinc-400 flex items-center justify-center font-bold text-zinc-300 text-lg">
                  G
                </div>
                <span className="text-[10px] text-zinc-400 tracking-wider mt-1 font-mono">PIXEL 8</span>
              </div>

              {/* لافتة توضيحية لما يحدث في الجزء الخلفي */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 text-center text-xs">
                {isFlashing ? (
                  <div className="flex items-center justify-center gap-2 font-bold" style={{ color: activeColor }}>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeColor }}></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: activeColor }}></span>
                    </span>
                    <span>وميض نشط: {activeNotification?.appName || currentApp.name}</span>
                  </div>
                ) : (
                  <p className="text-zinc-400">
                    انقر على زر الاختبار لتشغيل وميض فلاش {currentApp.name}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ===================== العرض الأمامي للشاشة (Edge Lighting & Punch-Hole Ring) ===================== */
            <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-black">
              
              {/* إضاءة الحواف المحيطية (Screen Edge Lighting) المتناغمة مع لون الإشعار */}
              {currentApp.edgeLightingEnabled && isLightActive && (
                <div 
                  className="absolute inset-0 pointer-events-none z-30 transition-all duration-200"
                  style={{
                    boxShadow: `inset 0 0 16px 5px ${activeColor}, inset 0 0 35px 10px ${activeColor}90`,
                    border: `3px solid ${activeColor}`
                  }}
                />
              )}

              {/* وميض الشاشة الكلي (Screen Flash) */}
              {currentApp.screenFlashEnabled && isLightActive && (
                <div 
                  className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-150"
                  style={{
                    backgroundColor: activeColor,
                    opacity: 0.18
                  }}
                />
              )}

              {/* الجزء العلوي: شريط الحالة + ثقب الكاميرا الأمامية Punch-Hole */}
              <div className="relative z-40 w-full pt-3 px-6 flex items-center justify-between text-[11px] text-zinc-300 font-mono">
                <span>14:56</span>

                {/* ثقب الكاميرا الأمامية مع حلقة ضوئية تفاعلية باللون الأزرق لفيسبوك أو لون التطبيق */}
                <div className="relative flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-black border border-zinc-800 flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
                  </div>

                  {/* الحلقة الدائرية المضيئة حول ثقب الكاميرا (Camera Punch-Hole Ring) */}
                  {currentApp.cameraRingEnabled && isLightActive && (
                    <div 
                      className="absolute w-7 h-7 rounded-full animate-spin pointer-events-none"
                      style={{
                        border: `2.5px solid ${activeColor}`,
                        boxShadow: `0 0 14px 4px ${activeColor}`
                      }}
                    />
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold">5G</span>
                  <div className="w-3.5 h-2 border border-zinc-300 rounded-[2px] p-[1px]">
                    <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* محتوى الشاشة: قفل الشاشة مع إشعار تفاعلي بنظام Android 17 Material You */}
              <div className="relative z-30 flex-1 flex flex-col items-center justify-center px-4 py-6">
                
                {/* وضع AMOLED توفير الطاقة (شاشة سوداء مطفأة 0% استهلاك) */}
                {!settings.isScreenOn ? (
                  <div className="text-center my-auto">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-[11px] text-zinc-400 mb-2">
                      <Battery className="w-3 h-3 text-emerald-400" />
                      <span>وضع شاشة AMOLED المطورة (0% استهلاك)</span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      الشاشة تظل سوداء تماماً مع وميض الحواف وحلقة الكاميرا فقط لحفظ الطاقة
                    </p>
                  </div>
                ) : (
                  <>
                    {/* ساعة شاشة القفل بنمط أندرويد 17 */}
                    <div className="text-center mb-6">
                      <div className="text-6xl font-bold tracking-tighter text-zinc-100 font-mono">
                        14:56
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 font-medium">
                        الجمعة، 18 سبتمبر
                      </div>
                    </div>

                    {/* بطاقة الإشعار الحي مع اللون المخصص */}
                    {activeNotification ? (
                      <div 
                        className="w-full bg-zinc-900/95 backdrop-blur-xl border rounded-2xl p-3.5 shadow-2xl transition-all animate-bounce"
                        style={{ borderColor: `${activeColor}80` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                              style={{ backgroundColor: activeColor }}
                            >
                              f
                            </div>
                            <span className="text-xs font-bold text-zinc-100">{activeNotification.appName}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500">الآن</span>
                        </div>
                        <p className="text-xs font-semibold text-zinc-200">{activeNotification.title}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{activeNotification.message}</p>
                      </div>
                    ) : (
                      <div className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3 text-center">
                        <Lock className="w-4 h-4 mx-auto text-zinc-500 mb-1" />
                        <span className="text-xs text-zinc-500">لا توجد إشعارات نشطة حالياً</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* شريط الإيماءات السفلي (Gesture Bar) */}
              <div className="relative z-30 pb-3 flex justify-center">
                <div className="w-24 h-1 bg-zinc-600 rounded-full" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* أزرار التجربة السريعة للإشعارات الشائعة (فيسبوك، واتساب، إنستغرام، مكالمات) */}
      <div className="w-full mt-5 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>جرّب وميض الإشعار الآن (Live Test):</span>
          </span>
          <span className="text-[11px] text-zinc-500">
            {settings.activeView === 'rear' ? 'شاهد مؤشر الفلاش بالخلف' : 'شاهد حواف الشاشة وحلقة الكاميرا'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            id="test-facebook-button"
            onClick={() => onTriggerTest({
              id: 'facebook',
              name: 'فيسبوك (Facebook)',
              packageName: 'com.facebook.katana',
              brandColor: '#1877F2',
              flashMode: 'pulse',
              flashCount: 2,
              flashSpeedMs: 180,
              edgeLightingEnabled: true,
              rearIndicatorEnabled: true,
              cameraRingEnabled: true,
              screenFlashEnabled: true,
              enabled: true
            })}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 text-blue-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] shadow-[0_0_8px_#1877F2]" />
            <span>فيسبوك (أزرق)</span>
          </button>

          <button
            id="test-whatsapp-button"
            onClick={() => onTriggerTest({
              id: 'whatsapp',
              name: 'واتساب (WhatsApp)',
              packageName: 'com.whatsapp',
              brandColor: '#25D366',
              flashMode: 'pulse',
              flashCount: 3,
              flashSpeedMs: 150,
              edgeLightingEnabled: true,
              rearIndicatorEnabled: true,
              cameraRingEnabled: true,
              screenFlashEnabled: true,
              enabled: true
            })}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
            <span>واتساب (أخضر)</span>
          </button>

          <button
            id="test-instagram-button"
            onClick={() => onTriggerTest({
              id: 'instagram',
              name: 'إنستغرام (Instagram)',
              packageName: 'com.instagram.android',
              brandColor: '#E1306C',
              flashMode: 'breathe',
              flashCount: 2,
              flashSpeedMs: 250,
              edgeLightingEnabled: true,
              rearIndicatorEnabled: true,
              cameraRingEnabled: true,
              screenFlashEnabled: true,
              enabled: true
            })}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/50 text-pink-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#E1306C] shadow-[0_0_8px_#E1306C]" />
            <span>إنستغرام (وردي)</span>
          </button>

          <button
            id="test-calls-button"
            onClick={() => onTriggerTest({
              id: 'calls',
              name: 'مكالمة هاتفية (Call)',
              packageName: 'com.google.android.dialer',
              brandColor: '#EF4444',
              flashMode: 'continuous',
              flashCount: 6,
              flashSpeedMs: 200,
              edgeLightingEnabled: true,
              rearIndicatorEnabled: true,
              cameraRingEnabled: true,
              screenFlashEnabled: true,
              enabled: true
            })}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-95"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]" />
            <span>مكالمة (أحمر)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
