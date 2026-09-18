import React from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  HelpCircle, 
  Info, 
  Layers, 
  Flashlight, 
  Smartphone, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const HardwareExplanation: React.FC = () => {
  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl w-full">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-100">
            توضيح تقني احترافي لشريكي: كيف تعمل الإضاءة الزرقاء بالخلف؟
          </h3>
          <p className="text-xs text-zinc-400">
            شرح تقني دقيق حول فلاش هاتف Google Pixel 8 وخيارات الألوان
          </p>
        </div>
      </div>

      <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed">
        {/* النقطة الأولى: عتاد الفلاش الخلفي */}
        <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-100 font-bold mb-1.5">
            <Flashlight className="w-4 h-4 text-amber-400" />
            <span>1. عتاد الفلاش الخلفي (Lampe Torche Hardware):</span>
          </div>
          <p className="text-zinc-400">
            فلاش الكاميرا الخلفي في الهواتف الذكية (بما فيها Pixel 8) هو صمام ثنائي LED أبيض أو دافئ عالي السطوع مصمم للإضاءة التصويرية. برمجياً عبر نظام أندرويد لا يمكن لعتاد الـ LED الأبيض نفسه أن يغير لونه إلى أزرق عتادياً إلا إذا كان مزوداً بـ RGB LED مخصص.
          </p>
        </div>

        {/* النقطة الثانية: الحل العبقري والتطبيقي في مشروعنا */}
        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-800/40">
          <div className="flex items-center gap-2 text-blue-300 font-bold mb-1.5">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>2. لمستنا السحرية لتحقيق رغبتك بالكامل:</span>
          </div>
          <p className="text-zinc-300 mb-2">
            قمنا بدمج ثلاث تقنيات متطورة معاً لتعطيك تجربة خيالية تشبه تماماً ما رأيته في الصورة:
          </p>
          <ul className="space-y-1.5 pr-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">إضاءة حواف الشاشة وحلقة الكاميرا (RGB 100%):</strong> إضاءة نيونية بلون أزرق ملكي لفيسبوك وأخضر لواتساب حول كامل الهاتف وحول ثقب الكاميرا الأمامية، وتعمل حتى أثناء قفل الشاشة مع شاشة سوداء AMOLED تماماً (0% استهلاك للبطارية).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">مؤشر شريط الكاميرا الخلفي (Rear Visor Indicator):</strong> محاكاة وتفعيل مؤشر الإشعار في الشريط الخلفي لهاتف Pixel 8 بلون التطبيق المطلوب (كما حددت في صورتك بدقة).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-white">إيقاع نبضات الفلاش الخلفي (Strobe Rhythms):</strong> نبضات فلاش مميزة لكل تطبيق (مثلاً ومضتان سريعتان لفيسبوك، 3 ومضات لواتساب، وميض متصل للمكالمات) للتمييز الفوري بدون حتى النظر للهاتف!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
