import React, { useState } from 'react';
import { 
  GitBranch, 
  Play, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  Sparkles, 
  Clock, 
  Smartphone, 
  Layers,
  ArrowRight,
  ExternalLink,
  Code,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

export function GitHubWorkflowGuide() {
  const [copied, setCopied] = useState(false);
  const [pathCopied, setPathCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const workflowPath = '.github/workflows/build-apk.yml';

  const workflowCode = `name: Build Android APK (Pixel Light Notification)

on:
  push:
    branches: [ "main", "master" ]
    tags: [ "v*" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch: # زر التشغيل اليدوي بنقرة واحدة من لوحة Actions في GitHub

permissions:
  contents: write

jobs:
  build:
    name: 🚀 Build APK with Jetpack Compose
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout repository
        uses: actions/checkout@v4

      - name: ☕ Set up JDK 17 (Java 17 for Android 14/15/16/17)
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: gradle

      - name: 🔧 Setup Android SDK & Build Environment
        uses: android-actions/setup-android@v3

      - name: 🔐 Ensure gradlew permissions
        run: |
          if [ -f "./gradlew" ]; then
            chmod +x gradlew
          else
            echo "Gradle wrapper setup"
            gradle wrapper || true
            chmod +x gradlew || true
          fi

      - name: 🏗️ Build Debug APK with Gradle
        run: |
          if [ -f "./gradlew" ]; then
            ./gradlew assembleDebug --stacktrace
          else
            gradle assembleDebug --stacktrace
          fi

      - name: 📦 Upload APK to GitHub Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: Pixel8-LightNotification-Debug-APK
          path: |
            app/build/outputs/apk/debug/*.apk
            **/build/outputs/apk/**/*.apk
          retention-days: 30

      - name: 🏷️ Create GitHub Release (Optional on tag push)
        if: startsWith(github.ref, 'refs/tags/v')
        uses: softprops/action-gh-release@v2
        with:
          files: app/build/outputs/apk/debug/*.apk
          draft: false
          prerelease: false
          name: Release \${{ github.ref_name }}
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(workflowCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyPath = () => {
    navigator.clipboard.writeText(workflowPath);
    setPathCopied(true);
    setTimeout(() => setPathCopied(false), 2500);
  };

  const startSimulation = () => {
    if (simulating) return;
    setSimulating(true);
    setSimStep(1);

    setTimeout(() => setSimStep(2), 1200);
    setTimeout(() => setSimStep(3), 2400);
    setTimeout(() => setSimStep(4), 3800);
    setTimeout(() => setSimStep(5), 5200);
    setTimeout(() => {
      setSimStep(6);
      setSimulating(false);
    }, 6500);
  };

  return (
    <div className="space-y-8 pb-12" dir="rtl">
      {/* رأس الصفحة مع الشعار والوصف الشامل */}
      <div className="bg-gradient-to-l from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <GitBranch className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>إعداد GitHub Actions لبناء تطبيق Pixel 8 تلقائياً</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    جاهز للعمل
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 mt-1">
                  يقوم GitHub بتجميع ملف الـ APK في خوادمه السحابية مجاناً دون الحاجة لتثبيت برامج ثقيلة على حاسوبك!
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'تم نسخ ملف الـ Workflow!' : 'نسخ كود الـ Workflow'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80">
            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-850 p-3 rounded-2xl">
              <Zap className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">بناء سحابي فوري</p>
                <p className="text-[11px] text-zinc-400">تجميع الـ APK في دقائق على خوادم Ubuntu</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-850 p-3 rounded-2xl">
              <Download className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">تحميل مباشر للهاتف</p>
                <p className="text-[11px] text-zinc-400">تنزيل ملف .apk جاهز للتثبيت على Pixel 8</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-zinc-950/60 border border-zinc-850 p-3 rounded-2xl">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-200">دعم Android 14/15/16/17</p>
                <p className="text-[11px] text-zinc-400">JDK 17 + Android SDK 35 الحديثة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* الخطوات المصورة لكيفية التطبيق في GitHub */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-400" />
          <span>خطوات إعداد الـ Action في مستودع GitHub الخاص بك (خطوة بخطوة)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* الخطوة 1 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  1
                </span>
                <span className="text-[11px] text-zinc-500">في مستودعك على GitHub</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">
                انقر على رابط "set up a workflow yourself"
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ادخل إلى تبويب <strong className="text-zinc-200">Actions</strong> في مستودعك (كما في شاشة GitHub لديك)، ثم اضغط على:
              </p>
              <div className="mt-3 p-3 bg-zinc-950 rounded-2xl border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-between">
                <span>set up a workflow yourself →</span>
                <ArrowRight className="w-4 h-4 text-blue-400 rotate-180" />
              </div>
            </div>
          </div>

          {/* الخطوة 2 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-[11px] text-zinc-500">مسار الملف</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">
                حدد اسم الملف ومساره
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                في حقل اسم الملف في أعلى صفحة المحرر في GitHub، اكتب أو الصق المسار التالي:
              </p>
              <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-mono text-emerald-400">
                <span>{workflowPath}</span>
                <button
                  onClick={handleCopyPath}
                  className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-sans flex items-center gap-1"
                >
                  {pathCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{pathCopied ? 'تم النسخ' : 'نسخ المسار'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* الخطوة 3 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-[11px] text-zinc-500">لصق الكود والحفظ</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">
                الصق كود الـ YAML واضغط Commit
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                استبدل أي محتوى موجود بالرمز الموجود في الصندوق أدناه، ثم اضغط على الزر الأخضر:
              </p>
              <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs flex items-center gap-2">
                <span className="px-2 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">
                  Commit changes...
                </span>
                <span className="text-zinc-400 text-[11px]">لحفظ الملف وتفعيل البناء التلقائي</span>
              </div>
            </div>
          </div>

          {/* الخطوة 4 */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-5 hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                  4
                </span>
                <span className="text-[11px] text-zinc-500">تحميل الـ APK</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">
                استلام ملف APK من تبويب Artifacts
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                بعد اكتمال عملية البناء بظهور علامة الصح الخضراء، انزل لأسفل الصفحة تحت قسم:
              </p>
              <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
                <span className="text-blue-400 font-semibold">Pixel8-LightNotification-Debug-APK</span>
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* نافذة عرض كود الـ YAML الجاهز مع أدوات النسخ */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-zinc-950/80 px-5 py-3.5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-mono text-zinc-300">{workflowPath}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400">YAML</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ بنجاح!' : 'نسخ ملف الـ YAML'}</span>
            </button>
          </div>
        </div>

        <div className="p-4 bg-zinc-950 font-mono text-[12px] text-zinc-300 overflow-x-auto max-h-[420px] scrollbar-thin scrollbar-thumb-zinc-700 leading-relaxed text-left" dir="ltr">
          <pre>{workflowCode}</pre>
        </div>
      </div>

      {/* محاكي تفاعلي حي لعملية البناء في GitHub Actions */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span>تجربة محاكاة البناء المباشر في GitHub Actions</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              شاهد كيف تعمل خوادم GitHub خطوة بخطوة عند تفعيل هذا الملف:
            </p>
          </div>

          <button
            onClick={startSimulation}
            disabled={simulating}
            className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              simulating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
            }`}
          >
            {simulating ? (
              <Clock className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{simulating ? 'جاري محاكاة البناء...' : 'تشغيل محاكاة البناء الآن'}</span>
          </button>
        </div>

        {/* مسار خطوات البناء */}
        <div className="space-y-3 bg-zinc-950 p-4 rounded-2xl border border-zinc-850 font-mono text-xs text-left" dir="ltr">
          {/* خطوة 1 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              {simStep >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className={simStep >= 1 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                1. Set up job & runner (Ubuntu 24.04 LTS)
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{simStep >= 1 ? '0.8s' : '-'}</span>
          </div>

          {/* خطوة 2 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              {simStep >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className={simStep >= 2 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                2. actions/checkout@v4 (Fetching Android Code)
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{simStep >= 2 ? '1.2s' : '-'}</span>
          </div>

          {/* خطوة 3 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              {simStep >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className={simStep >= 3 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                3. Set up JDK 17 (Eclipse Temurin with Gradle Cache)
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{simStep >= 3 ? '1.9s' : '-'}</span>
          </div>

          {/* خطوة 4 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              {simStep >= 4 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className={simStep >= 4 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                4. ./gradlew assembleDebug (Compiling Kotlin & Jetpack Compose)
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{simStep >= 4 ? '18.4s' : '-'}</span>
          </div>

          {/* خطوة 5 */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/50">
            <div className="flex items-center gap-2.5">
              {simStep >= 5 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className={simStep >= 5 ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                5. Upload Artifact: Pixel8-LightNotification-Debug-APK.zip
              </span>
            </div>
            <span className="text-[10px] text-zinc-500">{simStep >= 5 ? '2.1s' : '-'}</span>
          </div>

          {/* النتيجة النهائية للتحميل */}
          {simStep >= 6 && (
            <div className="p-3 mt-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-300">
                    تم بناء ملف الـ APK بنجاح! جاهز للتثبيت على Pixel 8
                  </p>
                  <p className="text-[11px] text-emerald-400/80">
                    الحجم: 14.8 MB • الصيغة: app-debug.apk • يدعم Android 14 إلى 17
                  </p>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md">
                <Download className="w-3.5 h-3.5" />
                <span>جاهز للتحميل</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* نصائح حصرية لنجاح البناء 100% */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-5">
        <h4 className="text-sm font-bold text-zinc-200 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400" />
          <span>نصائح هامة لضمان بناء التطبيق دون أي مشاكل:</span>
        </h4>
        <ul className="space-y-2 text-xs text-zinc-400 leading-relaxed list-disc list-inside">
          <li>
            <strong className="text-zinc-300">تشغيل البناء يدوياً (Manual Trigger):</strong> يمكنك في أي وقت الدخول إلى تبويب <span className="text-blue-400 font-mono">Actions</span> ثم اختيار <span className="text-zinc-300">Build Android APK</span> والضغط على الزر الأزرق <span className="text-blue-400 font-bold">Run workflow</span> دون الحاجة لكتابة أي كود جديد.
          </li>
          <li>
            <strong className="text-zinc-300">صلاحيات ملف gradlew:</strong> قمنا بتضمين أمر <span className="text-zinc-300 font-mono">chmod +x gradlew</span> تلقائياً في الملف لضمان عدم حدوث خطأ Permission Denied الشائع.
          </li>
          <li>
            <strong className="text-zinc-300">التثبيت على Pixel 8:</strong> عند تحميل ملف الـ APK على هاتفك، فعل خيار <span className="text-zinc-300">"السماح بتثبيت التطبيقات من هذا المصدر"</span> في إعدادات الأمان ليعمل التطبيق والويدجت مباشرة.
          </li>
        </ul>
      </div>
    </div>
  );
}
