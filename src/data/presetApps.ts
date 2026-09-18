import { AppLightConfig } from '../types';

export const PRESET_APPS: AppLightConfig[] = [
  {
    id: 'facebook',
    name: 'فيسبوك (Facebook)',
    packageName: 'com.facebook.katana',
    brandColor: '#1877F2', // الأزرق الملكي الخاص بفيسبوك
    flashMode: 'pulse',
    flashCount: 2,
    flashSpeedMs: 180,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: 'نبضتان زرقاوان متتاليتان'
  },
  {
    id: 'whatsapp',
    name: 'واتساب (WhatsApp)',
    packageName: 'com.whatsapp',
    brandColor: '#25D366', // الأخضر الزمردي
    flashMode: 'pulse',
    flashCount: 3,
    flashSpeedMs: 150,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: '3 ومضات خضراء سريعة'
  },
  {
    id: 'instagram',
    name: 'إنستغرام (Instagram)',
    packageName: 'com.instagram.android',
    brandColor: '#E1306C', // الوردي والأرجواني
    flashMode: 'breathe',
    flashCount: 2,
    flashSpeedMs: 300,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: 'توهج أرجواني ناعم'
  },
  {
    id: 'telegram',
    name: 'تيليجرام (Telegram)',
    packageName: 'org.telegram.messenger',
    brandColor: '#0088CC', // الأزرق الفيروزي السماوي
    flashMode: 'strobe',
    flashCount: 2,
    flashSpeedMs: 120,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: 'وميض سماوي خاطف'
  },
  {
    id: 'calls',
    name: 'المكالمات الهاتفية (Calls)',
    packageName: 'com.google.android.dialer',
    brandColor: '#EF4444', // الأحمر المنبه
    flashMode: 'continuous',
    flashCount: 8,
    flashSpeedMs: 250,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: 'تنبيه مكالمة مستمر'
  },
  {
    id: 'snapchat',
    name: 'سناب شات (Snapchat)',
    packageName: 'com.snapchat.android',
    brandColor: '#FFFC00', // الأصفر المضيء
    flashMode: 'pulse',
    flashCount: 2,
    flashSpeedMs: 140,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: 'ومضتان أصفر فاقع'
  },
  {
    id: 'gmail',
    name: 'بريد جيميل (Gmail)',
    packageName: 'com.google.android.gm',
    brandColor: '#EA4335', // الأحمر الكلاسيكي لجيميل
    flashMode: 'pulse',
    flashCount: 1,
    flashSpeedMs: 220,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: false,
    enabled: true,
    customRhythmName: 'ومضة فردية مركزة'
  },
  {
    id: 'tiktok',
    name: 'تيك توك (TikTok)',
    packageName: 'com.zhiliaoapp.musically',
    brandColor: '#00F2FE', // النيون الفيروزي
    flashMode: 'strobe',
    flashCount: 3,
    flashSpeedMs: 100,
    edgeLightingEnabled: true,
    rearIndicatorEnabled: true,
    cameraRingEnabled: true,
    screenFlashEnabled: true,
    enabled: true,
    customRhythmName: 'إيقاع نيون خاطف'
  }
];
