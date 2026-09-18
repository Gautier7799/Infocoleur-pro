package com.pixel.colornotify

import android.content.Context
import android.content.SharedPreferences

/**
 * مدير إعدادات التطبيق المدمج مع نظام أندرويد
 * يتيح حفظ واسترجاع تفضيلات الألوان، سرعة الوميض، ونمط إضاءة الحواف
 */
object AppPreferences {
    private const val PREFS_NAME = "pixel_color_notify_prefs"
    private const val KEY_SERVICE_ENABLED = "key_service_enabled"
    private const val KEY_FLASH_ENABLED = "key_flash_enabled"
    private const val KEY_EDGE_LIGHT_ENABLED = "key_edge_light_enabled"
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

    fun isFlashEnabled(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_FLASH_ENABLED, true)
    }

    fun setFlashEnabled(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_FLASH_ENABLED, enabled).apply()
    }

    fun isEdgeLightEnabled(context: Context): Boolean {
        return getPrefs(context).getBoolean(KEY_EDGE_LIGHT_ENABLED, true)
    }

    fun setEdgeLightEnabled(context: Context, enabled: Boolean) {
        getPrefs(context).edit().putBoolean(KEY_EDGE_LIGHT_ENABLED, enabled).apply()
    }

    fun getRhythmCount(context: Context): Int {
        return getPrefs(context).getInt(KEY_RHYTHM_COUNT, 3)
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

    // استرجاع اللون المخصص لتطبيق معين أو اللون الافتراضي المحسوب
    fun getAppCustomColor(context: Context, packageName: String): Int? {
        val colorInt = getPrefs(context).getInt("color_$packageName", -1)
        return if (colorInt != -1) colorInt else null
    }

    fun setAppCustomColor(context: Context, packageName: String, colorInt: Int) {
        getPrefs(context).edit().putInt("color_$packageName", colorInt).apply()
    }
}
