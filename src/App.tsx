import React, { useState, useEffect } from 'react';
import { PRESET_APPS } from './data/presetApps';
import { AppLightConfig, DeviceSettings, NotificationEvent } from './types';
import { PixelDeviceSimulator } from './components/PixelDeviceSimulator';
import { AppConfigurator } from './components/AppConfigurator';
import { AndroidWidgetPreview } from './components/AndroidWidgetPreview';
import { AndroidCodeExporter } from './components/AndroidCodeExporter';
import { HardwareExplanation } from './components/HardwareExplanation';
import { GitHubWorkflowGuide } from './components/GitHubWorkflowGuide';
import { SystemAppIntegration } from './components/SystemAppIntegration';
import { 
  Flashlight, 
  Smartphone, 
  Sparkles, 
  Code2, 
  AppWindow, 
  HelpCircle, 
  Power, 
  Zap, 
  Shield, 
  Sliders,
  BellRing,
  RotateCcw,
  GitBranch,
  Cpu
} from 'lucide-react';

export default function App() {
  const [apps, setApps] = useState<AppLightConfig[]>(() => {
    const saved = localStorage.getItem('pixel_light_apps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return PRESET_APPS;
      }
    }
    return PRESET_APPS;
  });

  const [selectedApp, setSelectedApp] = useState<AppLightConfig>(apps[0]);
  const [activeNotification, setActiveNotification] = useState<NotificationEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'widget' | 'code' | 'actions' | 'system' | 'guide'>('system');
  const [isServiceEnabled, setIsServiceEnabled] = useState(true);

  const [settings, setSettings] = useState<DeviceSettings>({
    deviceModel: 'Pixel 8',
    activeView: 'rear', // نبدأ بالعرض الخلفي كما في صورة المستخدم تماماً!
    isScreenOn: true,
    isLocked: true,
    isPocketMode: false,
    batteryLevel: 85,
    batterySaverThreshold: 15,
    edgeGlowThickness: 4,
    rearLedBrightness: 10,
    dndBypass: false,
    soundEnabled: true,
  });

  // حفظ التعديلات محلياً
  useEffect(() => {
    localStorage.setItem('pixel_light_apps', JSON.stringify(apps));
  }, [apps]);

  const handleUpdateApp = (updatedApp: AppLightConfig) => {
    setApps((prev) => prev.map((a) => (a.id === updatedApp.id ? updatedApp : a)));
    setSelectedApp(updatedApp);
  };

  const handleAddApp = (newApp: AppLightConfig) => {
    setApps((prev) => [newApp, ...prev]);
  };

  const handleDeleteApp = (id: string) => {
    const filtered = apps.filter((a) => a.id !== id);
    setApps(filtered);
    if (selectedApp.id === id && filtered.length > 0) {
      setSelectedApp(filtered[0]);
    }
  };

  const handleUpdateSettings = (newSettings: Partial<DeviceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const triggerTestNotification = (app: AppLightConfig) => {
    const newNotification: NotificationEvent = {
      id: 'notify_' + Date.now(),
      appName: app.name.split(' ')[0],
      packageName: app.packageName,
      title: `إشعار جديد من ${app.name.split(' ')[0]}`,
      message: app.id === 'facebook' 
        ? 'أرسل أحمد رسالة إليك على فيسبوك • وميض باللون الأزرق!' 
        : `لديك تنبيه وتفاعل جديد • نمط وميض ${app.flashCount} مرات`,
      color: app.brandColor,
      timestamp: 'الآن',
      isTest: true
    };

    setActiveNotification(newNotification);
    setSelectedApp(app);

    // إيقاف الإشعار بعد انتهاء مدة الوميض
    const duration = app.flashCount * app.flashSpeedMs * 2 + 1000;
    setTimeout(() => {
      setActiveNotification((current) => (current?.id === newNotification.id ? null : current));
    }, duration);
  };

  const resetToDefaults = () => {
    setApps(PRESET_APPS);
    setSelectedApp(PRESET_APPS[0]);
    localStorage.removeItem('pixel_light_apps');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* شريط الملاحة العلوي المتطور */}
      <header className="border-b border-zinc-850 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Flashlight className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  إشعارات Pixel 8 الضوئية الذكية
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-mono font-bold border border-blue-500/30">
                  Android 17 Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                إضاءة الفلاش ومؤشر الكاميرا وحواف الشاشة مخصصة لكل تطبيق
              </p>
            </div>
          </div>

          {/* الإجراءات السريعة في الهيدر */}
          <div className="flex items-center gap-2.5">
            {/* زر تجربة إشعار فيسبوك الأزرق فوراً */}
            <button
              onClick={() => {
                const fb = apps.find((a) => a.id === 'facebook') || apps[0];
                triggerTestNotification(fb);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              title="تجربة فورية لإشعار الفيسبوك باللون الأزرق"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] shadow-[0_0_8px_#1877F2]" />
              <span className="hidden sm:inline">تجربة إشعار فيسبوك الأزرق</span>
              <span className="sm:hidden">فيسبوك الأزرق</span>
            </button>

            {/* زر تشغيل/إيقاف الخدمة العامة */}
            <button
              onClick={() => setIsServiceEnabled(!isServiceEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isServiceEnabled
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isServiceEnabled ? 'الخدمة نشطة' : 'الخدمة متوقفة'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* التبويبات الرئيسية للتنقل السلس */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-2 w-full">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <button
              id="tab-simulator"
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>محاكي هاتف Pixel 8 والألوان</span>
            </button>

            <button
              id="tab-widget"
              onClick={() => setActiveTab('widget')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'widget'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <AppWindow className="w-4 h-4" />
              <span>ويدجت الشاشة الرئيسية (Widget)</span>
            </button>

            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>أكواد Kotlin و Jetpack Compose</span>
            </button>

            <button
              id="tab-actions"
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'actions'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>GitHub Actions لبناء APK</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                سحابي
              </span>
            </button>

            <button
              id="tab-system"
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'system'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>تطبيق مدمج بالنظام</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
                Priv-App
              </span>
            </button>

            <button
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>شرح فلاش Pixel (صورة المستخدم)</span>
            </button>
          </div>

          <button
            onClick={resetToDefaults}
            title="استعادة الإعدادات الافتراضية"
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors hidden md:block"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* المحتوى التفاعلي الرئيسي بحسب التبويب */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* العمود الأول: محاكي هاتف Pixel 8 ثلاثي الأبعاد مع الفلاش والحواف */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <PixelDeviceSimulator
                currentApp={selectedApp}
                settings={settings}
                activeNotification={activeNotification}
                onTriggerTest={triggerTestNotification}
                onUpdateSettings={handleUpdateSettings}
              />
            </div>

            {/* العمود الثاني: لوحة تخصيص التطبيقات والألوان المخصصة */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <AppConfigurator
                apps={apps}
                selectedApp={selectedApp}
                onSelectApp={setSelectedApp}
                onUpdateApp={handleUpdateApp}
                onAddApp={handleAddApp}
                onDeleteApp={handleDeleteApp}
                onTestFlash={triggerTestNotification}
              />
            </div>
          </div>
        )}

        {activeTab === 'widget' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <AndroidWidgetPreview
              apps={apps}
              settings={settings}
              onTriggerTest={triggerTestNotification}
              onTogglePower={() => setIsServiceEnabled(!isServiceEnabled)}
              isServiceEnabled={isServiceEnabled}
            />

            {/* محاكي تفاعلي مصغر لمشاهدة تأثير نقرات الويدجت */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 flex flex-col items-center">
              <p className="text-xs text-zinc-400 mb-4 text-center">
                عند النقر على أزرار الويدجت أعلاه، يمكنك مشاهدة الهاتف المضاء أدناه مباشرة:
              </p>
              <PixelDeviceSimulator
                currentApp={selectedApp}
                settings={settings}
                activeNotification={activeNotification}
                onTriggerTest={triggerTestNotification}
                onUpdateSettings={handleUpdateSettings}
              />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-6">
            <AndroidCodeExporter />
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-6">
            <GitHubWorkflowGuide />
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <SystemAppIntegration />
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <HardwareExplanation />
          </div>
        )}
      </main>

      {/* التذييل الراقي */}
      <footer className="border-t border-zinc-900 py-4 text-center text-xs text-zinc-500 bg-zinc-950">
        <p>
          مشروع إشعارات Pixel 8 الضوئية الذكية • متوافق مع أنظمة Android 14 و 15 و 16 و 17 • مبني بـ Jetpack Compose & Camera2 API
        </p>
      </footer>
    </div>
  );
}
