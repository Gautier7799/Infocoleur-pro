import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  Terminal, 
  Download, 
  Check, 
  Copy, 
  Layers, 
  Settings, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  FileCode2, 
  Sliders, 
  AlertCircle,
  FolderTree,
  Flame,
  ArrowRight
} from 'lucide-react';

export function SystemAppIntegration() {
  const [copiedScript, setCopiedScript] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'magisk' | 'adb' | 'tile' | 'privapp'>('magisk');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2500);
  };

  // كود التثبيت عبر ADB Shell
  const adbScript = `# 1. تفعيل وضع تصحيح أخطاء USB على هاتف Pixel 8
adb devices

# 2. الدخول بامتيازات الروت وإعادة تجهيز قسم النظام للقراءة والكتابة
adb root
adb remount

# 3. إنشاء مسار تطبيق النظام في /system/priv-app
adb shell "mkdir -p /system/priv-app/PixelLightNotify"

# 4. دفع ملف الـ APK المترجم إلى مسار النظام المدمج
adb push app-debug.apk /system/priv-app/PixelLightNotify/PixelLightNotify.apk

# 5. تعيين الصلاحيات القياسية لنظام أندرويد (644 للملف و 755 للمجلد)
adb shell "chmod 755 /system/priv-app/PixelLightNotify"
adb shell "chmod 644 /system/priv-app/PixelLightNotify/PixelLightNotify.apk"

# 6. دفع ملف الأذونات التفضيلية Privapp Permissions لمنح صلاحيات النظام الكاملة
adb push privapp-permissions-com.pixel.lightnotify.xml /system/etc/permissions/

# 7. إعادة تشغيل واجهة النظام أو الهاتف لتطبيق التغييرات فوراً
adb reboot`;

  // كود ماجيسك لتركيب التطبيق كنظام دون المساس بقسم النظام (Systemless Magisk/KernelSU)
  const magiskModuleProp = `id=pixel_light_notify_system
name=Pixel 8 System Light Notification
version=v2.5.0
versionCode=250
author=Android Partner
description=تحويل تطبيق إشعارات الفلاش وإضاءة الحواف إلى تطبيق نظام أصلي مدمج في /system/priv-app مع حماية كاملة من إغلاق الخلفية.`;

  // كود خدمة زر الإعدادات السريعة المدمج في النظام (Quick Settings TileService)
  const tileServiceCode = `package com.pixel.lightnotify

import android.graphics.drawable.Icon
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService

/**
 * زر الإعدادات السريعة المدمج في لوحة النظام العلوية لهواتف Pixel (Quick Settings Tile)
 * يتيح للمستخدم تشغيل وإيقاف إشعارات الإضاءة بنقرة واحدة كجزء أصيل من نظام أندرويد
 */
class PixelLightTileService : TileService() {

    override fun onStartListening() {
        super.onStartListening()
        updateTileState()
    }

    override fun onClick() {
        super.onClick()
        val tile = qsTile ?: return
        val isCurrentlyActive = (tile.state == Tile.STATE_ACTIVE)

        // عكس الحالة وحفظها في إعدادات النظام
        val newState = !isCurrentlyActive
        AppPreferences.setServiceGlobalEnabled(this, newState)

        updateTileState()
    }

    private fun updateTileState() {
        val tile = qsTile ?: return
        val isEnabled = AppPreferences.isServiceGlobalEnabled(this)

        tile.state = if (isEnabled) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE
        tile.label = getString(R.string.tile_label_light_notify)
        tile.subtitle = if (isEnabled) "إضاءة الفلاش نشطة" else "متوقف مؤقتاً"
        tile.icon = Icon.createWithResource(
            this,
            if (isEnabled) R.drawable.ic_pixel_flash_on else R.drawable.ic_pixel_flash_off
        )
        tile.updateTile()
    }
}`;

  // ملف أذونات التطبيق المدمج privapp-permissions.xml
  const privAppPermissions = `<?xml version="1.0" encoding="utf-8"?>
<!-- ملف تعريف أذونات النظام الممتازة لتطبيق Pixel Light Notification -->
<permissions>
    <privapp-permissions package="com.pixel.lightnotify">
        <!-- صلاحية منع تجميد التطبيق وإعفائه التلقائي من قيود توفير الطاقة Doze Mode -->
        <permission name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS"/>
        <!-- إمكانية التحكم المباشر بفلاش الكاميرا دون الحاجة لفتح تطبيق الكاميرا -->
        <permission name="android.permission.CAMERA"/>
        <!-- الاستماع الدائم لإشعارات النظام على مدار الساعة -->
        <permission name="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"/>
        <!-- تشغيل الخدمة فور إقلاع الهاتف تلقائياً -->
        <permission name="android.permission.RECEIVE_BOOT_COMPLETED"/>
        <!-- التحكم بالاهتزاز المنسق مع الفلاش -->
        <permission name="android.permission.VIBRATE"/>
        <!-- إمكانية الرسم فوق جميع النوافذ وشاشة القفل AOD -->
        <permission name="android.permission.SYSTEM_ALERT_WINDOW"/>
    </privapp-permissions>
</permissions>`;

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* بطاقة التعريف بدمج التطبيق في النظام */}
      <div className="bg-gradient-to-l from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>تطبيق APK مدمج في نظام أندرويد (System Priv-App)</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    امتيازات النظام 100%
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  اجعل التطبيق جزءاً أصيلاً لا يتجزأ من نظام تشغيل Pixel 8 مع تحكم عتادي مباشر وحصانة كاملة ضد الإغلاق في الخلفية.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono">
                /system/priv-app/
              </span>
            </div>
          </div>

          {/* ميزات التحويل لتطبيق نظام */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-2xl">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">حصانة من الإغلاق</p>
                <p className="text-[11px] text-zinc-400">تجاوز قيود توفير الطاقة Doze Mode بالكامل</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-2xl">
              <Sliders className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">زر في الإعدادات السريعة</p>
                <p className="text-[11px] text-zinc-400">دمج Tile في لوحة تحكم أندرويد العلوية</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-850 p-3.5 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">وصول عتادي مباشر</p>
                <p className="text-[11px] text-zinc-400">تحكم فوري ودقيق في فلاش الكاميرا وشاشة AOD</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* أزرار التنقل بين طرق الدمج في النظام */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-zinc-950 border border-zinc-850 rounded-2xl">
        <button
          onClick={() => setActiveTab('magisk')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'magisk'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>وحدة ماجيسك بدون لمس النظام (Magisk / KernelSU)</span>
        </button>

        <button
          onClick={() => setActiveTab('adb')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'adb'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>التثبيت المباشر عبر أوامر ADB</span>
        </button>

        <button
          onClick={() => setActiveTab('tile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tile'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-blue-400" />
          <span>كود زر النظام (Quick Settings Tile)</span>
        </button>

        <button
          onClick={() => setActiveTab('privapp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'privapp'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-purple-400" />
          <span>ملف الأذونات privapp-permissions.xml</span>
        </button>
      </div>

      {/* محتوى التبويب النشط */}

      {/* 1. خيار ماجيسك */}
      {activeTab === 'magisk' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span>طريقة ماجيسك الأفضل (Systemless Integration)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  تسمح لك هذه الطريقة بدمج التطبيق في النظام الرسمي دون تعديل قسم System الأصلي، مما يحافظ على تحديثات OTA واجتياز اختبارات الأمان.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(magiskModuleProp, 'magisk-prop')}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedScript === 'magisk-prop' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript === 'magisk-prop' ? 'تم النسخ!' : 'نسخ كود module.prop'}</span>
              </button>
            </div>

            {/* هيكل المجلدات لموديل ماجيسك */}
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850 mb-4 font-mono text-xs text-left" dir="ltr">
              <p className="text-zinc-400 mb-2 font-sans text-right font-bold text-xs" dir="rtl">
                📁 هيكل ملف الـ ZIP الخاص بالموديل (قم بضغطه وتفليشه في Magisk / KernelSU / APatch):
              </p>
              <pre className="text-emerald-400 text-xs leading-relaxed">
{`PixelLightNotify_System_Module.zip
│── module.prop
│── system/
│   ├── priv-app/
│   │   └── PixelLightNotify/
│   │       └── PixelLightNotify.apk   <-- (ملف الـ APK المبني من GitHub)
│   └── etc/
│       └── permissions/
│           └── privapp-permissions-com.pixel.lightnotify.xml
└── META-INF/
    └── com/google/android/
        └── update-binary`}
              </pre>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-400">module.prop</span>
                <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400">خصائص الوحدة</span>
              </div>
              <pre className="text-xs font-mono text-zinc-300 overflow-x-auto text-left" dir="ltr">
                {magiskModuleProp}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 2. خيار أوامر ADB */}
      {activeTab === 'adb' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                  <span>أوامر التثبيت عبر ADB Terminal (للمطورين والأجهزة ذات الروت)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  قم بنسخ هذه الأوامر وتشغيلها في موجه الأوامر على حاسوبك لنقل التطبيق فوراً لداخل مجلد النظام المفضل:
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(adbScript, 'adb')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
              >
                {copiedScript === 'adb' ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript === 'adb' ? 'تم نسخ جميع الأوامر!' : 'نسخ أوامر ADB'}</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850 font-mono text-xs text-left overflow-x-auto text-zinc-300 max-h-[380px] leading-relaxed" dir="ltr">
              <pre>{adbScript}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. خيار زر الإعدادات السريعة Quick Settings Tile */}
      {activeTab === 'tile' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  <span>دمج التطبيق في شريط إشعارات أندرويد (Quick Settings Tile)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  كود Kotlin المكتوب خصيصاً بنظام أندرويد لإنشاء زر تفاعلي في لوحة الإعدادات السريعة بجوار الفلاش والـ Wi-Fi.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(tileServiceCode, 'tile-code')}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedScript === 'tile-code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript === 'tile-code' ? 'تم النسخ!' : 'نسخ كود TileService'}</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850 font-mono text-xs text-left overflow-x-auto text-zinc-300 max-h-[380px] leading-relaxed" dir="ltr">
              <pre>{tileServiceCode}</pre>
            </div>
          </div>
        </div>
      )}

      {/* 4. خيار أذونات privapp-permissions.xml */}
      {activeTab === 'privapp' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCode2 className="w-5 h-5 text-purple-400" />
                  <span>ملف التراخيص الرسمية: privapp-permissions-com.pixel.lightnotify.xml</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  يحدد هذا الملف لنظام أندرويد الصلاحيات الخاصة الممنوحة للتطبيق المدمج تلقائياً دون إزعاج المستخدم بطلب أذونات يدوية.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(privAppPermissions, 'privapp-xml')}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {copiedScript === 'privapp-xml' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedScript === 'privapp-xml' ? 'تم النسخ!' : 'نسخ ملف الـ XML'}</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-850 font-mono text-xs text-left overflow-x-auto text-zinc-300 max-h-[380px] leading-relaxed" dir="ltr">
              <pre>{privAppPermissions}</pre>
            </div>
          </div>
        </div>
      )}

      {/* شرح مقارنة بين تثبيت التطبيق العادي وتثبيته المدمج في النظام */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6">
        <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>مقارنة: لماذا نجعله مدمجاً في النظام (System App vs Normal App)؟</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <h4 className="font-bold text-zinc-300 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span>التطبيق العادي (User App في /data/app)</span>
            </h4>
            <ul className="space-y-2 text-zinc-400 list-disc list-inside">
              <li>قد يقوم أندرويد بإيقافه في الخلفية بعد فترات خمول طويلة لتوفير الطاقة.</li>
              <li>يحتاج المستخدم للموافقة يدوياً على استثناء التطبيق من تحسين البطارية.</li>
              <li>يمكن حذفه بسهولة بواسطة أي شخص يستخدم الهاتف.</li>
              <li>قد يتأخر وميض الفلاش أحياناً بأجزاء من الثانية في وضع النوم العميق (Deep Sleep).</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <h4 className="font-bold text-emerald-300 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>التطبيق المدمج في النظام (System Priv-App في /system/priv-app)</span>
            </h4>
            <ul className="space-y-2 text-emerald-400/90 list-disc list-inside">
              <li><strong>حصانة مطلقة:</strong> لا يُغلق أبداً ويستجيب فورياً لكل إشعار حتى في أعمق درجات نوم النظام.</li>
              <li><strong>صلاحيات مسبقة:</strong> لا يحتاج للموافقة المتكررة، الصلاحيات محقونة تلقائياً عبر ملف الـ XML.</li>
              <li><strong>مقاوم للحذف:</strong> يعتبره أندرويد جزءاً أصيلاً من حزمة النظام الرسمية مثل تطبيق الإعدادات والكاميرا.</li>
              <li><strong>تكامل تام:</strong> يظهر خياره في لوحة الإعدادات السريعة (Quick Settings Tile) بضغطة واحدة.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
