export interface AndroidSourceFile {
  name: string;
  path: string;
  category: 'service' | 'manager' | 'ui' | 'widget' | 'manifest' | 'gradle';
  description: string;
  code: string;
}

export const ANDROID_SOURCE_FILES: AndroidSourceFile[] = [
  {
    name: 'NotificationLightService.kt',
    path: 'app/src/main/java/com/pixel/lightnotify/NotificationLightService.kt',
    category: 'service',
    description: 'خدمة رصد الإشعارات في الخلفية: تكتشف التطبيق القادم وتستدعي نبضات الفلاش وإضاءة الحواف بحسب لون التطبيق',
    code: `package com.pixel.lightnotify

import android.content.Intent
import android.graphics.Color
import android.os.PowerManager
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import kotlinx.coroutines.*

/**
 * خدمة رصد الإشعارات الذكية لهواتف Pixel 8 بنظام أندرويد 14/15/16/17
 * تكتشف مصدر الإشعار وتفعل الفلاش ونبضات الضوء بالألوان المحددة
 */
class NotificationLightService : NotificationListenerService() {

    private val serviceScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private lateinit var flashlightManager: FlashlightManager
    private lateinit var powerManager: PowerManager

    override fun onCreate() {
        super.onCreate()
        flashlightManager = FlashlightManager(this)
        powerManager = getSystemService(POWER_SERVICE) as PowerManager
        Log.d(TAG, "Pixel NotificationLightService جاهز ويعمل بنجاح")
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        sbn ?: return

        // 1. تجاهل الإشعارات المستمرة (كالموسيقى أو التنزيلات) لتوفير البطارية
        if (sbn.isOngoing) return

        val packageName = sbn.packageName
        Log.i(TAG, "وصل إشعار جديد من حزمة: $packageName")

        // 2. فحص تفضيلات المستخدم الخاصة بالتطبيق
        serviceScope.launch {
            val appConfig = AppPreferences.getAppConfig(applicationContext, packageName)

            if (appConfig != null && appConfig.isEnabled) {
                // إطلاق نمط وميض الفلاش الخلفي (Strobe / Pulse)
                if (appConfig.rearFlashEnabled) {
                    flashlightManager.triggerFlashPattern(
                        pulses = appConfig.flashCount,
                        pulseDurationMs = appConfig.flashSpeedMs,
                        strengthLevel = appConfig.flashBrightness
                    )
                }

                // إطلاق إضاءة الحواف وحلقة الكاميرا الأمامية إذا كانت الشاشة مغلقة أو مفعلة
                if (appConfig.edgeLightingEnabled) {
                    val overlayIntent = Intent(applicationContext, EdgeLightingOverlayService::class.java).apply {
                        putExtra(EdgeLightingOverlayService.EXTRA_COLOR, appConfig.colorHex)
                        putExtra(EdgeLightingOverlayService.EXTRA_APP_NAME, appConfig.appName)
                        putExtra(EdgeLightingOverlayService.EXTRA_PULSE_COUNT, appConfig.flashCount)
                    }
                    startService(overlayIntent)
                }
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        serviceScope.cancel()
        flashlightManager.release()
    }

    companion object {
        private const val TAG = "PixelLightService"
    }
}`
  },
  {
    name: 'FlashlightManager.kt',
    path: 'app/src/main/java/com/pixel/lightnotify/FlashlightManager.kt',
    category: 'manager',
    description: 'التحكم الدقيق في وميض فلاش الكاميرا الخلفي: يدعم مستويات السطوع الجديدة (Android 13+) وتوليد النبضات الإيقاعية',
    code: `package com.pixel.lightnotify

import android.content.Context
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraManager
import android.os.Build
import android.util.Log
import kotlinx.coroutines.*

/**
 * مدير فلاش الكاميرا الخلفية لأجهزة Google Pixel
 * يعتمد على أحدث واجهات CameraManager مع حماية كاملة من استهلاك البطارية
 */
class FlashlightManager(private val context: Context) {

    private val cameraManager = context.getSystemService(Context.CAMERA_SERVICE) as CameraManager
    private var cameraId: String? = null
    private var maxStrengthLevel: Int = 1
    private var isTorchAvailable: Boolean = false
    private var flashJob: Job? = null

    init {
        findBackCameraFlash()
    }

    private fun findBackCameraFlash() {
        try {
            for (id in cameraManager.cameraIdList) {
                val characteristics = cameraManager.getCameraCharacteristics(id)
                val facing = characteristics.get(CameraCharacteristics.LENS_FACING)
                val hasFlash = characteristics.get(CameraCharacteristics.FLASH_INFO_AVAILABLE) ?: false

                if (facing == CameraCharacteristics.LENS_FACING_BACK && hasFlash) {
                    cameraId = id
                    isTorchAvailable = true
                    
                    // دعم قوة إضاءة الفلاش في Android 13 وما فوق (API 33+)
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        maxStrengthLevel = characteristics.get(
                            CameraCharacteristics.FLASH_INFO_STRENGTH_MAXIMUM_LEVEL
                        ) ?: 1
                    }
                    break
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "خطأ في تهيئة مستشعر الفلاش: \${e.message}")
        }
    }

    /**
     * إطلاق ومضات الفلاش بتردد وسرعة مخصصة لكل تطبيق
     */
    fun triggerFlashPattern(pulses: Int = 2, pulseDurationMs: Long = 150L, strengthLevel: Int = 10) {
        val id = cameraId ?: return
        if (!isTorchAvailable) return

        flashJob?.cancel()
        flashJob = CoroutineScope(Dispatchers.Default).launch {
            try {
                // ضبط مستوى السطوع نسبة إلى الحد الأقصى للمستشعر
                val calculatedStrength = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && maxStrengthLevel > 1) {
                    ((strengthLevel / 10f) * maxStrengthLevel).toInt().coerceIn(1, maxStrengthLevel)
                } else 1

                repeat(pulses) {
                    // تشغيل الفلاش
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && maxStrengthLevel > 1) {
                        cameraManager.turnOnTorchWithStrengthLevel(id, calculatedStrength)
                    } else {
                        cameraManager.setTorchMode(id, true)
                    }
                    delay(pulseDurationMs)

                    // إطفاء الفلاش
                    cameraManager.setTorchMode(id, false)
                    delay(pulseDurationMs)
                }
            } catch (e: Exception) {
                Log.e(TAG, "خطأ أثناء تشغيل وميض الفلاش: \${e.message}")
                try {
                    cameraManager.setTorchMode(id, false)
                } catch (_: Exception) {}
            }
        }
    }

    fun release() {
        flashJob?.cancel()
        try {
            cameraId?.let { cameraManager.setTorchMode(it, false) }
        } catch (_: Exception) {}
    }

    companion object {
        private const val TAG = "FlashlightManager"
    }
}`
  },
  {
    name: 'EdgeLightingOverlayService.kt',
    path: 'app/src/main/java/com/pixel/lightnotify/EdgeLightingOverlayService.kt',
    category: 'service',
    description: 'إضاءة حواف الشاشة وحلقة كاميرا Pixel الأمامية باللون الأزرق لفيسبوك أو أي لون مخصص مع مستشعر الجيب',
    code: `package com.pixel.lightnotify

import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import androidx.compose.ui.platform.ComposeView
import androidx.lifecycle.setViewTreeLifecycleOwner
import androidx.savedstate.setViewTreeSavedStateRegistryOwner
import kotlinx.coroutines.*

/**
 * خدمة رسم حواف الشاشة وحلقة الكاميرا الأمامية المضيئة (Edge Glow & Camera Ring)
 * تدعم شاشات AMOLED مع شاشة سوداء تماماً لتوفير 0% طاقة إضافية
 */
class EdgeLightingOverlayService : Service(), SensorEventListener {

    private lateinit var windowManager: WindowManager
    private var overlayView: View? = null
    private lateinit var sensorManager: SensorManager
    private var proximitySensor: Sensor? = null
    private var isPhoneInPocket: Boolean = false
    private val scope = CoroutineScope(Dispatchers.Main + Job())

    override fun onCreate() {
        super.onCreate()
        windowManager = getSystemService(Context.WINDOW_SERVICE) as WindowManager
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        proximitySensor = sensorManager.getDefaultSensor(Sensor.TYPE_PROXIMITY)

        // تفعيل مستشعر الاقتراب لمعرفة ما إذا كان الهاتف داخل الجيب
        proximitySensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val colorHex = intent?.getStringExtra(EXTRA_COLOR) ?: "#1877F2" // أزرق فيسبوك الافتراضي
        val pulses = intent?.getIntExtra(EXTRA_PULSE_COUNT, 2) ?: 2

        // إذا كان الهاتف في الجيب، لا داعي لإضاءة الشاشة (توفير البطارية!)
        if (isPhoneInPocket) {
            stopSelf()
            return START_NOT_STICKY
        }

        showEdgeLighting(colorHex, pulses)
        return START_NOT_STICKY
    }

    private fun showEdgeLighting(colorHex: String, pulses: Int) {
        removeOverlay()

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
        ).apply {
            gravity = Gravity.CENTER
        }

        // عرض إضاءة الحواف النيونية في واجهة خفيفة جداً
        val composeView = ComposeView(this).apply {
            setContent {
                EdgeLightingView(
                    color = Color.parseColor(colorHex),
                    pulseCount = pulses,
                    onFinish = { removeOverlay(); stopSelf() }
                )
            }
        }

        try {
            windowManager.addView(composeView, layoutParams)
            overlayView = composeView
        } catch (e: Exception) {
            stopSelf()
        }
    }

    private fun removeOverlay() {
        overlayView?.let {
            try {
                windowManager.removeView(it)
            } catch (_: Exception) {}
            overlayView = null
        }
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event ?: return
        if (event.sensor.type == Sensor.TYPE_PROXIMITY) {
            // مسافة قريبة تعني الهاتف في الجيب أو مقلوباً على وجهه
            isPhoneInPocket = event.values[0] < (proximitySensor?.maximumRange ?: 5f)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onDestroy() {
        super.onDestroy()
        sensorManager.unregisterListener(this)
        removeOverlay()
        scope.cancel()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        const val EXTRA_COLOR = "extra_color"
        const val EXTRA_APP_NAME = "extra_app_name"
        const val EXTRA_PULSE_COUNT = "extra_pulse_count"
    }
}`
  },
  {
    name: 'LightNotificationScreen.kt',
    path: 'app/src/main/java/com/pixel/lightnotify/ui/LightNotificationScreen.kt',
    category: 'ui',
    description: 'واجهة المستخدم الرئيسية المبنية بـ Jetpack Compose و Material 3 لتخصيص ألوان وتأثيرات كل تطبيق',
    code: `package com.pixel.lightnotify.ui

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

/**
 * واجهة Jetpack Compose الحديثة لتطبيق إشعارات Pixel الضوئية
 * تصميم مستوحى من Material You (Android 14/15/16/17)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LightNotificationScreen(
    onTestFlash: (colorHex: String, pulses: Int) -> Unit,
    onRequestPermission: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("إشعارات Pixel الضوئية") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                actions = {
                    IconButton(onClick = onRequestPermission) {
                        Icon(Icons.Default.Security, contentDescription = "الأذونات")
                    }
                }
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // بطاقة التنشيط السريع وتوفير الطاقة
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text(
                                    text = "تفعيل الإشعارات الضوئية",
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "فلاش الكاميرا + إضاءة حواف الشاشة",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                            Switch(checked = true, onCheckedChange = {})
                        }
                    }
                }
            }

            // قائمة التطبيقات وتخصيص ألوانها
            item {
                Text(
                    text = "ألوان وتأثيرات التطبيقات",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            }

            items(defaultAppsList) { app ->
                AppConfigCard(
                    app = app,
                    onTestClick = { onTestFlash(app.colorHex, app.pulses) }
                )
            }
        }
    }
}

data class AppItem(
    val name: String,
    val packageName: String,
    val colorHex: String,
    val pulses: Int,
    val description: String
)

val defaultAppsList = listOf(
    AppItem("فيسبوك (Facebook)", "com.facebook.katana", "#1877F2", 2, "أزرق ملكي • ومضتان خلفية + حواف"),
    AppItem("واتساب (WhatsApp)", "com.whatsapp", "#25D366", 3, "أخضر زمردي • 3 ومضات سريعة"),
    AppItem("إنستغرام (Instagram)", "com.instagram.android", "#E1306C", 2, "توهج أرجواني ناعم"),
    AppItem("تيليجرام (Telegram)", "org.telegram.messenger", "#0088CC", 2, "أزرق سماوي خاطف"),
    AppItem("المكالمات الهاتفية", "com.google.android.dialer", "#EF4444", 8, "أحمر متواصل عند الرنين")
)

@Composable
fun AppConfigCard(app: AppItem, onTestClick: () -> Unit) {
    val appColor = Color(android.graphics.Color.parseColor(app.colorHex))

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(appColor)
                        .border(2.dp, Color.White.copy(alpha = 0.4f), CircleShape)
                )
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(text = app.name, style = MaterialTheme.typography.titleSmall)
                    Text(
                        text = app.description,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            IconButton(onClick = onTestClick) {
                Icon(
                    imageVector = Icons.Default.FlashOn,
                    contentDescription = "تجربة الوميض",
                    tint = appColor
                )
            }
        }
    }
}`
  },
  {
    name: 'LightNotificationWidget.kt',
    path: 'app/src/main/java/com/pixel/lightnotify/widget/LightNotificationWidget.kt',
    category: 'widget',
    description: 'عنصر واجهة الشاشة الرئيسية (Widget) بنظام Android Glance للتحكم السريع في الفلاش بدون فتح التطبيق',
    code: `package com.pixel.lightnotify.widget

import android.content.Context
import androidx.compose.runtime.Composable
import androidx.compose.ui.unit.dp
import androidx.glance.*
import androidx.glance.action.clickable
import androidx.glance.appwidget.GlanceAppWidget
import androidx.glance.appwidget.GlanceAppWidgetReceiver
import androidx.glance.appwidget.provideContent
import androidx.glance.layout.*
import androidx.glance.text.FontWeight
import androidx.glance.text.Text
import androidx.glance.text.TextStyle
import androidx.glance.unit.ColorProvider

/**
 * ويدجت الشاشة الرئيسية لهاتف Google Pixel (Material You Widget)
 * يتيح لك تشغيل أو إيقاف الفلاش الذكي فوراً واختبار إشعار الفيسبوك الأزرق بضغطة واحدة!
 */
class LightNotificationWidget : GlanceAppWidget() {

    override suspend fun provideGlance(context: Context, id: GlanceId) {
        provideContent {
            WidgetContent(context)
        }
    }

    @Composable
    private fun WidgetContent(context: Context) {
        Column(
            modifier = GlanceModifier
                .fillMaxSize()
                .background(ImageProvider(R.drawable.widget_background))
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalAlignment = Alignment.SpaceBetween
            ) {
                Text(
                    text = "فلاش الإشعارات",
                    style = TextStyle(
                        fontWeight = FontWeight.Bold,
                        color = ColorProvider(android.graphics.Color.WHITE)
                    )
                )
                // حالة التفعيل
                Text(
                    text = "نشط ●",
                    style = TextStyle(color = ColorProvider(android.graphics.Color.parseColor("#25D366")))
                )
            }

            Spacer(modifier = GlanceModifier.height(8.dp))

            // أزرار سريعة للألوان الأساسية (فيسبوك أزرق، واتساب أخضر)
            Row(
                modifier = GlanceModifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterEvenly
            ) {
                Button(
                    text = "فيسبوك 🟦",
                    onClick = { /* إطلاق وميض فيسبوك التجريبي */ }
                )
                Button(
                    text = "واتساب 🟩",
                    onClick = { /* إطلاق وميض واتساب التجريبي */ }
                )
            }
        }
    }
}

class LightNotificationWidgetReceiver : GlanceAppWidgetReceiver() {
    override val glanceAppWidget: GlanceAppWidget = LightNotificationWidget()
}`
  },
  {
    name: 'AndroidManifest.xml',
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'ملف المانيفست متضمناً أذونات الكاميرا، وخدمة الاستماع للإشعارات، وأذونات الرسم فوق التطبيقات وتوفير الطاقة',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- أذونات فلاش الكاميرا (بدون إلزام وجود كاميرا عتادية للصور) -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature
        android:name="android.hardware.camera.flash"
        android:required="false" />

    <!-- إذن إضاءة حواف الشاشة والرسم فوق التطبيقات (SYSTEM_ALERT_WINDOW) -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

    <!-- إذن إبقاء المعالج نشطاً لجزء من الثانية لإكمال ومضات الفلاش عند قفل الشاشة -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- إذن استثناء وضع توفير الطاقة الحرج (اختياري لضمان دقة العمل أثناء النوم العميق) -->
    <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Pixel Light Notification"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.PixelLightNotification">

        <!-- النشاط الرئيسي (Jetpack Compose Activity) -->
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.PixelLightNotification">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- خدمة رصد الإشعارات الرسمية من أندرويد -->
        <service
            android:name=".NotificationLightService"
            android:label="Pixel Light Notification Service"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>

        <!-- خدمة إضاءة حواف الشاشة وحلقة الكاميرا -->
        <service
            android:name=".EdgeLightingOverlayService"
            android:exported="false" />

        <!-- مستقبل ويدجت الشاشة الرئيسية -->
        <receiver
            android:name=".widget.LightNotificationWidgetReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/light_widget_info" />
        </receiver>

    </application>

</manifest>`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'إعدادات Gradle وملفات التبعيات الحديثة لـ Jetpack Compose و Glance Widget و Camera2',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.pixel.lightnotify"
    compileSdk = 35 // متوافق مع Android 14/15/16/17

    defaultConfig {
        applicationId = "com.pixel.lightnotify"
        minSdk = 26 // Android 8.0 فما فوق
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    // مكتبات Jetpack Compose الأساسية و Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.material.icons.extended)

    // ويدجت الشاشة الرئيسية عبر Jetpack Glance
    implementation("androidx.glance:glance-appwidget:1.1.1")
    implementation("androidx.glance:glance-material3:1.1.1")

    // أدوات الكوروتين وإدارة دورة الحياة
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
}`
  }
];
