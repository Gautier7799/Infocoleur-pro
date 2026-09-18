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
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.view.animation.AlphaAnimation
import android.view.animation.Animation
import android.widget.FrameLayout

/**
 * خدمة إضاءة الحواف الملونة (Ambient Color Edge Lighting)
 * ترسم وهجاً لونياً نابضاً حول إطار شاشة Pixel بلون التطبيق المرسل للإشعار
 */
class EdgeLightingOverlayService : Service() {

    private var windowManager: WindowManager? = null
    private var overlayView: FrameLayout? = null
    private val handler = Handler(Looper.getMainLooper())

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val color = intent?.getIntExtra(EXTRA_COLOR, Color.parseColor("#25D366")) ?: Color.parseColor("#25D366")
        showEdgeGlow(color)
        return START_NOT_STICKY
    }

    private fun showEdgeGlow(colorInt: Int) {
        if (!Settings.canDrawOverlays(this)) {
            stopSelf()
            return
        }

        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager

        // إزالة أي نافذة سابقة إذا كانت معروضة
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
        val borderView = View(this)

        // تصميم إطار الحواف الملون المتوهج مع تدرج شفاف نحو المركز
        val strokeWidth = (resources.displayMetrics.density * 6).toInt()
        val cornerRadius = resources.displayMetrics.density * 32

        val drawable = GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            setStroke(strokeWidth, colorInt)
            cornerRadius = cornerRadius
            setColor(Color.TRANSPARENT)
        }

        borderView.background = drawable
        frame.addView(
            borderView,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )

        // حركة وميض نابضة لطيفة (Pulse Animation)
        val pulseAnim = AlphaAnimation(0.2f, 1.0f).apply {
            duration = 450
            repeatMode = Animation.REVERSE
            repeatCount = 5
        }
        borderView.startAnimation(pulseAnim)

        overlayView = frame
        try {
            windowManager?.addView(overlayView, layoutParams)
        } catch (e: Exception) {
            stopSelf()
            return
        }

        // الإغلاق التلقائي بعد 3.2 ثانية لتوفير البطارية تماماً
        handler.postDelayed({
            removeCurrentOverlay()
            stopSelf()
        }, 3200)
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

        fun start(context: Context, colorInt: Int) {
            val intent = Intent(context, EdgeLightingOverlayService::class.java).apply {
                putExtra(EXTRA_COLOR, colorInt)
            }
            context.startService(intent)
        }
    }
}
