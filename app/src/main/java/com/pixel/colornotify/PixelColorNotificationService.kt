package com.pixel.colornotify

import android.app.NotificationManager
import android.content.Context
import android.graphics.Color
import android.os.Build
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log

/**
 * محرك استماع إشعارات أندرويد واستخراج الألوان بنمط هواتف Pixel الرائدة
 * يكتشف ورود الإشعار، يستخرج لونه المميز، ويطلق وميض الفلاش وإضاءة الحواف
 */
class PixelColorNotificationService : NotificationListenerService() {

    private lateinit var flashController: FlashController
    private var vibrator: Vibrator? = null
    private var powerManager: PowerManager? = null

    override fun onCreate() {
        super.onCreate()
        flashController = FlashController(this)
        powerManager = getSystemService(Context.POWER_SERVICE) as PowerManager

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

        // التحقق من تفعيل الخدمة العامة
        if (!AppPreferences.isServiceEnabled(this)) return

        // تجاهل إشعارات التطبيق الذاتية وإشعارات النظام المستمرة (كحالة الشحن وسماع الموسيقى)
        if (sbn.packageName == packageName || sbn.isOngoing) return

        // التحقق من وضع عدم الإزعاج Do Not Disturb
        if (AppPreferences.isDndAware(this)) {
            val notifManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            if (notifManager.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE ||
                notifManager.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_ALARMS) {
                return
            }
        }

        val targetColor = resolveNotificationColor(sbn)
        triggerColorAlert(targetColor)
    }

    /**
     * استخراج لون التطبيق ديناميكياً بأولويات دقيقة:
     * 1. اللون المحفوظ يدوياً من المستخدم لهذا التطبيق
     * 2. لون الإشعار المحدد من مطور التطبيق (sbn.notification.color)
     * 3. ألوان التطبيقات الشائعة الافتراضية
     */
    private fun resolveNotificationColor(sbn: StatusBarNotification): Int {
        val pkg = sbn.packageName

        // 1. فحص هل حدد المستخدم لوناً خاصاً لهذا التطبيق في الإعدادات
        val userCustomColor = AppPreferences.getAppCustomColor(this, pkg)
        if (userCustomColor != null) return userCustomColor

        // 2. فحص لون الإشعار المرفق من النظام (Material You Accent)
        val notifColor = sbn.notification.color
        if (notifColor != 0 && notifColor != Color.BLACK && notifColor != Color.WHITE) {
            return notifColor
        }

        // 3. ألوان افتراضية للتطبيقات الشائعة
        return when {
            pkg.contains("whatsapp", ignoreCase = true) -> Color.parseColor("#25D366")
            pkg.contains("telegram", ignoreCase = true) -> Color.parseColor("#0088CC")
            pkg.contains("dialer", ignoreCase = true) || pkg.contains("phone", ignoreCase = true) -> Color.parseColor("#34A853")
            pkg.contains("messaging", ignoreCase = true) || pkg.contains("mms", ignoreCase = true) -> Color.parseColor("#4285F4")
            pkg.contains("instagram", ignoreCase = true) -> Color.parseColor("#E1306C")
            pkg.contains("snapchat", ignoreCase = true) -> Color.parseColor("#FFFC00")
            pkg.contains("mail", ignoreCase = true) || pkg.contains("gmail", ignoreCase = true) -> Color.parseColor("#EA4335")
            pkg.contains("twitter", ignoreCase = true) || pkg.contains("x.android", ignoreCase = true) -> Color.parseColor("#1DA1F2")
            else -> Color.parseColor("#4285F4") // لون Google الأزرق الافتراضي
        }
    }

    private fun triggerColorAlert(colorInt: Int) {
        val pulses = AppPreferences.getRhythmCount(this)

        // إطلاق وميض الفلاش الخلفي
        if (AppPreferences.isFlashEnabled(this)) {
            flashController.triggerPulseSequence(pulses = pulses)
        }

        // إطلاق إضاءة الحواف الملونة حول الشاشة
        if (AppPreferences.isEdgeLightEnabled(this)) {
            EdgeLightingOverlayService.start(this, colorInt)
        }

        // اهتزاز لمسي خفيف متزامن (Haptic Pulse)
        triggerHaptic()
    }

    private fun triggerHaptic() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 50, 70, 50), -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(100)
            }
        } catch (_: Exception) {}
    }
}
