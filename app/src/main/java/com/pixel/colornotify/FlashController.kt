package com.pixel.colornotify

import android.content.Context
import android.hardware.camera2.CameraAccessException
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * المتحكم العتادي في فلاش الكاميرا الخلفي لهواتف Pixel
 * يدعم مستويات الشدة الضوئية وومضات متتالية وفق الإيقاع المخصص
 */
class FlashController(private val context: Context) {

    private val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private var cameraId: String? = null
    private val scope = CoroutineScope(Dispatchers.Default)

    init {
        findRearCameraWithFlash()
    }

    private fun findRearCameraWithFlash() {
        try {
            for (id in cameraManager.cameraIdList) {
                val characteristics = cameraManager.getCameraCharacteristics(id)
                val facing = characteristics.get(CameraCharacteristics.LENS_FACING)
                val hasFlash = characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) ?: false

                if (facing == CameraCharacteristics.LENS_FACING_BACK && hasFlash) {
                    cameraId = id
                    break
                }
            }
        } catch (e: Exception) {
            Log.e("FlashController", "Error detecting flash hardware: \${e.message}")
        }
    }

    /**
     * إطلاق سلسلة ومضات فلاش محسوبة الإيقاع لتنبيه المستخدم
     */
    fun triggerPulseSequence(pulses: Int = 3, onDurationMs: Long = 80L, offDurationMs: Long = 100L) {
        val id = cameraId ?: return
        scope.launch {
            try {
                for (i in 0 until pulses) {
                    setTorchMode(id, true)
                    delay(onDurationMs)
                    setTorchMode(id, false)
                    if (i < pulses - 1) {
                        delay(offDurationMs)
                    }
                }
            } catch (e: Exception) {
                Log.e("FlashController", "Failed in pulse sequence: \${e.message}")
            } finally {
                setTorchMode(id, false)
            }
        }
    }

    private fun setTorchMode(id: String, enabled: Boolean) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && enabled) {
                // دعم أقصى شدة إضاءة مدعومة في عتاد Pixel
                try {
                    val characteristics = cameraManager.getCameraCharacteristics(id)
                    val maxLevel = characteristics.get(CameraCharacteristics.FLASH_INFO_STRENGTH_MAXIMUM_LEVEL) ?: 1
                    if (maxLevel > 1) {
                        cameraManager.turnOnTorchWithStrengthLevel(id, maxLevel)
                        return
                    }
                } catch (_: Exception) {}
            }
            cameraManager.setTorchMode(id, enabled)
        } catch (e: CameraAccessException) {
            Log.e("FlashController", "CameraAccessException: \${e.message}")
        } catch (e: Exception) {
            Log.e("FlashController", "Torch mode error: \${e.message}")
        }
    }
}
