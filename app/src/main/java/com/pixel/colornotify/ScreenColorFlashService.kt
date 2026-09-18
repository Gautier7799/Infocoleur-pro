package com.pixel.colornotify

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.view.View
import android.view.WindowManager
import android.view.animation.AlphaAnimation
import android.view.animation.Animation
import android.widget.FrameLayout

/**
 * خدمة وميض الشاشة الذكي بالألوان المخصصة (Dynamic Color Screen Flash)
 * تحاكي وتتجاوز ميزة "Clignotement de l'écran" الرسمية في Pixel:
 * تدعم وضعين:
 * 1. وميض الشاشة الكاملة باللون (Full Screen Color Flash)
 * 2. وميض حواف الشاشة الأنيقة بتدرج لوني حول الإطار (Ambient Edge Glow)
 */
class ScreenColorFlashService : Service() {

    private var windowManager: WindowManager? = null
    private var overlayView: FrameLayout? = null
    private val handler = Handler(Looper.getMainLooper())

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val colorInt = intent?.getIntExtra(EXTRA_COLOR, Color.parseColor("#4285F4")) ?: Color.parseColor("#4285F4")
        val isFullScreen = intent?.getBooleanExtra(EXTRA_FULL_SCREEN, false) ?: false
        val pulseCount = intent?.getIntExtra(EXTRA_PULSES, 2) ?: 2

        triggerScreenFlash(colorInt, isFullScreen, pulseCount)
        return START_NOT_STICKY
    }

    private fun triggerScreenFlash(colorInt: Int, isFullScreen: Boolean, pulseCount: Int) {
        if (!Settings.canDrawOverlays(this)) {
            stopSelf()
            return
        }

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        removeCurrentOverlay()

        val layoutParams = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
            else
                WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED,
            PixelFormat.TRANSLUCENT
        )

        val frame = FrameLayout(this)
        val flashView = View(this)

        if (isFullScreen) {
            // وميض الشاشة بالكامل بلون شفاف أنيق بنسبة 35% يحافظ على وضوح المحتوى
            val semiTransparentColor = Color.argb(
                90,
                Color.red(colorInt),
                Color.green(colorInt),
                Color.blue(colorInt)
            )
            flashView.setBackgroundColor(semiTransparentColor)
        } else {
            // وميض إطار وحواف الشاشة المنحنية (Pixel Curved Edge Lighting)
            val strokeWidth = (resources.displayMetrics.density * 8).toInt()
            val cornerRadius = resources.displayMetrics.density * 36

            val drawable = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                setStroke(strokeWidth, colorInt)
                this.cornerRadius = cornerRadius
                setColor(Color.TRANSPARENT)
            }
            flashView.background = drawable
        }

        frame.addView(
            flashView,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )

        // حركة وميض نابضة مريحة للعين (Smooth Pulse Animation)
        val animDuration = 350L
        val pulseAnim = AlphaAnimation(0.05f, 1.0f).apply {
            duration = animDuration
            repeatMode = Animation.REVERSE
            repeatCount = (pulseCount * 2) - 1
        }
        flashView.startAnimation(pulseAnim)

        overlayView = frame
        try {
            windowManager?.addView(overlayView, layoutParams)
        } catch (e: Exception) {
            stopSelf()
            return
        }

        // الإغلاق التلقائي الفوري لتوفير البطارية بعد انتهاء الوميض
        val totalDuration = animDuration * (pulseCount * 2) + 200L
        handler.postDelayed({
            removeCurrentOverlay()
            stopSelf()
        }, totalDuration)
    }

    private fun removeCurrentOverlay() {
        try {
            if (overlayView != null && overlayView?.isAttachedToWindow == true) {
                windowManager?.removeView(overlayView)
            }
        } catch (_: Exception) {}
        overlayView = null
    }

    override fun onDestroy() {
        super.onDestroy()
        removeCurrentOverlay()
    }

    companion object {
        const val EXTRA_COLOR = "extra_color"
        const val EXTRA_FULL_SCREEN = "extra_full_screen"
        const val EXTRA_PULSES = "extra_pulses"

        fun flash(context: Context, colorInt: Int, isFullScreen: Boolean = false, pulses: Int = 2) {
            val intent = Intent(context, ScreenColorFlashService::class.java).apply {
                putExtra(EXTRA_COLOR, colorInt)
                putExtra(EXTRA_FULL_SCREEN, isFullScreen)
                putExtra(EXTRA_PULSES, pulses)
            }
            context.startService(intent)
        }
    }
}
