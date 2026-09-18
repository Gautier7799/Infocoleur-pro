package com.pixel.colornotify

import android.content.Context
import android.content.SharedPreferences

/**
 * مدير إعدادات إشعارات الألوان المدمج
 */
object AppPreferences {
    private const val PREFS_NAME = "pixel_color_notify_prefs"
    private const val KEY_SERVICE_ENABLED = "key_service_enabled"
    private const val KEY_SCREEN_FLASH_ENABLED = "key_screen_flash_enabled"
    private const val KEY_TORCH_FLASH_ENABLED = "key_torch_flash_enabled"
    private const val KEY_FULL_SCREEN_MODE = "key_full_screen_mode"
    private const val KEY_RHYTHM_COUNT = "key_rhythm_count"
    private const val KEY_DND_AWARE = "key_dnd_aware"

    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    fun isServiceEnabled(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_SERVICE_ENABLED, true)
    }

    fun setServiceEnabled(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_SERVICE_ENABLED, enabled).apply()
    }

    // تفعيل وميض الشاشة بالألوان (Clignotement de l'écran avec couleurs personnalisées)
    fun isScreenFlashEnabled(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_SCREEN_FLASH_ENABLED, true)
    }

    fun setScreenFlashEnabled(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_SCREEN_FLASH_ENABLED, enabled).apply()
    }

    // تفعيل وميض الفلاش الخلفي (Lampe Torche)
    fun isTorchFlashEnabled(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_TORCH_FLASH_ENABLED, true)
    }

    fun setTorchFlashEnabled(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_TORCH_FLASH_ENABLED, enabled).apply()
    }

    // هل الوميض للشاشة كاملة أم فقط حواف الشاشة المنحنية (Edge Lighting)
    fun isFullScreenMode(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_FULL_SCREEN_MODE, false)
    }

    fun setFullScreenMode(context: Context, full: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_FULL_SCREEN_MODE, full).apply()
    }

    fun getRhythmCount(context: Context): Int {
        return getPrefs(context).getInt(KEY_RHYTHM_COUNT, 2)
    }

    fun setRhythmCount(context: Context, count: Int) {
        getPrefs(context).edit().putInt(KEY_RHYTHM_COUNT, count).apply()
    }

    fun isDndAware(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_DND_AWARE, true)
    }

    fun setDndAware(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_DND_AWARE, enabled).apply()
    }

    // حفظ وتخصيص لون يدوي لتطبيق معين
    fun getAppCustomColor(context: Context, packageName: String): Int? {
        val colorInt = getPrefs(context).getInt("custom_color_$packageName", -1)
        return if (colorInt != -1) colorInt else null
    }

    fun setAppCustomColor(context: Context, packageName: String, colorInt: Int) {
        getPrefs(context).edit().putInt("custom_color_$packageName", colorInt).apply()
    }
}
