package com.pixel.colornotify

import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * محرك استماع الإشعارات الذكي (Pixel Smart Color Notification Engine)
 * يستخرج لون التطبيق ديناميكياً ويطلق:
 * 1. وميض الشاشة باللون الحقيقي للتطبيق (أخضر واتساب، أزرق تيليجرام، إلخ)
 * 2. وميض فلاش الكاميرا الخلفي (Lampe Torche) بتزامن دقيق
 */
class PixelColorNotificationService : NotificationListenerService() {

    private lateinit var flashController: FlashController
    private var vibrator: Vibrator? = null

    override fun onCreate() {
        super.onCreate()
        flashController = FlashController(this)

        vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        // التحقق من تفعيل الخدمة
        if (!AppPreferences.isServiceEnabled(this)) return

        // تجاهل إشعارات التطبيق الذاتية والإشعارات المستمرة (كالموسيقى والتنزيل)
        if (sbn.packageName == packageName || sbn.isOngoing) return

        // التحقق من وضع عدم الإزعاج Do Not Disturb
        if (AppPreferences.isDndAware(this)) {
            val notifManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            if (notifManager.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE ||
                notifManager.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_ALARMS) {
                return
            }
        }

        val appColor = resolveAppColor(sbn)
        triggerSmartNotification(appColor)
    }

    /**
     * استخراج وتحديد اللون الدقيق لكل تطبيق:
     */
    private fun resolveAppColor(sbn: StatusBarNotification): Int {
        val pkg = sbn.packageName

        // 1. فحص إذا كان المستخدم خصص لوناً يدوياً
        val customColor = AppPreferences.getAppCustomColor(this, pkg)
        if (customColor != null) return customColor

        // 2. فحص لون Material You المرفق من التطبيق
        val notifColor = sbn.notification.color
        if (notifColor != 0 && notifColor != Color.BLACK && notifColor != Color.WHITE) {
            return notifColor
        }

        // 3. ألوان التطبيقات الرسمية بدقة متناهية
        return when {
            pkg.contains("whatsapp", ignoreCase = true) -> Color.parseColor("#25D366") // أخضر واتساب
            pkg.contains("telegram", ignoreCase = true) -> Color.parseColor("#0088CC") // أزرق تيليجرام
            pkg.contains("dialer", ignoreCase = true) || pkg.contains("phone", ignoreCase = true) -> Color.parseColor("#34A853") // أخضر المكالمات
            pkg.contains("messaging", ignoreCase = true) || pkg.contains("mms", ignoreCase = true) -> Color.parseColor("#1A73E8") // أزرق الرسائل SMS
            pkg.contains("instagram", ignoreCase = true) -> Color.parseColor("#E1306C") // وردي/أحمر انستجرام
            pkg.contains("snapchat", ignoreCase = true) -> Color.parseColor("#FFFC00") // أصفر سناب شات
            pkg.contains("mail", ignoreCase = true) || pkg.contains("gmail", ignoreCase = true) -> Color.parseColor("#EA4335") // أحمر جيميل
            pkg.contains("twitter", ignoreCase = true) || pkg.contains("x.android", ignoreCase = true) -> Color.parseColor("#1DA1F2") // أزرق تويتر
            pkg.contains("facebook", ignoreCase = true) -> Color.parseColor("#1877F2") // أزرق فيسبوك
            pkg.contains("tiktok", ignoreCase = true) -> Color.parseColor("#00F2FE") // أزرق تيك توك
            pkg.contains("youtube", ignoreCase = true) -> Color.parseColor("#FF0000") // أحمر يوتيوب
            else -> Color.parseColor("#4285F4") // أزرق Google Pixel القياسي
        }
    }

    private fun triggerSmartNotification(colorInt: Int) {
        val pulses = AppPreferences.getRhythmCount(this)

        // 1. وميض الشاشة باللون المخصص للتطبيق (Clignotement d'écran dynamique)
        if (AppPreferences.isScreenFlashEnabled(this)) {
            val isFullScreen = AppPreferences.isFullScreenMode(this)
            ScreenColorFlashService.flash(this, colorInt, isFullScreen, pulses)
        }

        // 2. وميض فلاش الكاميرا الخلفي (Lampe Torche)
        if (AppPreferences.isTorchFlashEnabled(this)) {
            flashController.triggerPulseSequence(pulses = pulses)
        }

        // اهتزاز ناعم مع الوميض
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 40, 50, 40), -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(70)
            }
        } catch (_: Exception) {}
    }
}
