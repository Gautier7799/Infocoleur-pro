package com.pixel.colornotify

import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification

/**
 * خدمة التنبيه بواسطة وميض الفلاش الخلفي فقط (Lampe Torche)
 * بدون أي إضاءة للشاشة مطلقاً
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

        // التحقق من تفعيل الخدمة العامة
        if (!AppPreferences.isServiceEnabled(this)) return

        // تجاهل إشعارات التطبيق الذاتية والإشعارات المستمرة (كالموسيقى وحالة الشحن)
        if (sbn.packageName == packageName || sbn.isOngoing) return

        // التحقق من وضع عدم الإزعاج Do Not Disturb
        if (AppPreferences.isDndAware(this)) {
            val notifManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            if (notifManager.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_NONE ||
                notifManager.currentInterruptionFilter == NotificationManager.INTERRUPTION_FILTER_ALARMS) {
                return
            }
        }

        // إطلاق وميض فلاش الكاميرا الخلفي فقط (Lampe Torche)
        triggerTorchAlert()
    }

    private fun triggerTorchAlert() {
        if (!AppPreferences.isFlashEnabled(this)) return

        val pulses = AppPreferences.getRhythmCount(this)
        flashController.triggerPulseSequence(pulses = pulses)

        // اهتزاز لمسي خفيف مع الفلاش
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(longArrayOf(0, 40, 60, 40), -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(80)
            }
        } catch (_: Exception) {}
    }
}
