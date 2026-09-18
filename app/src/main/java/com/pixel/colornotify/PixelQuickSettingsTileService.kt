package com.pixel.colornotify

import android.graphics.drawable.Icon
import android.service.quicksettings.Tile
import android.service.quicksettings.TileService

/**
 * زر الإعدادات السريعة المدمج في لوحة إشعارات أندرويد العلوية (Quick Settings Tile)
 * يتيح التحكم السريع المباشر في تشغيل أو إيقاف إشعارات الإضاءة والألوان بنقرة واحدة
 */
class PixelQuickSettingsTileService : TileService() {

    override fun onStartListening() {
        super.onStartListening()
        updateTileState()
    }

    override fun onClick() {
        super.onClick()
        val tile = qsTile ?: return
        val isActive = (tile.state == Tile.STATE_ACTIVE)

        val newState = !isActive
        AppPreferences.setServiceEnabled(this, newState)
        updateTileState()
    }

    private fun updateTileState() {
        val tile = qsTile ?: return
        val isEnabled = AppPreferences.isServiceEnabled(this)

        tile.state = if (isEnabled) Tile.STATE_ACTIVE else Tile.STATE_INACTIVE
        tile.label = getString(R.string.tile_name)
        tile.subtitle = if (isEnabled) getString(R.string.tile_active_subtitle) else getString(R.string.tile_inactive_subtitle)
        tile.icon = Icon.createWithResource(this, R.drawable.ic_flash_tile)
        tile.updateTile()
    }
}
