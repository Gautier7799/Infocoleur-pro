package com.pixel.colornotify

import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.graphics.Color as AndroidColor
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.PowerManager
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
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
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class AppColorItem(
    val name: String,
    val packageName: String,
    val defaultColor: Color
)

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    PixelColorNotifyScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PixelColorNotifyScreen() {
    val context = LocalContext.current
    var isServiceEnabled by remember { mutableStateOf(AppPreferences.isServiceEnabled(context)) }
    var isFlashEnabled by remember { mutableStateOf(AppPreferences.isFlashEnabled(context)) }
    var isEdgeLightEnabled by remember { mutableStateOf(AppPreferences.isEdgeLightEnabled(context)) }
    var rhythmCount by remember { mutableStateOf(AppPreferences.getRhythmCount(context)) }

    val sampleApps = remember {
        listOf(
            AppColorItem("WhatsApp", "com.whatsapp", Color(0xFF25D366)),
            AppColorItem("Telegram", "org.telegram.messenger", Color(0xFF0088CC)),
            AppColorItem("الهاتف والمكالمات", "com.google.android.dialer", Color(0xFF34A853)),
            AppColorItem("الرسائل النصية SMS", "com.google.android.apps.messaging", Color(0xFF4285F4)),
            AppColorItem("Instagram", "com.instagram.android", Color(0xFFE1306C)),
            AppColorItem("Gmail البريد الإلكتروني", "com.google.android.gm", Color(0xFFEA4335)),
            AppColorItem("Snapchat", "com.snapchat.android", Color(0xFFFFFC00))
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Pixel Color Notify", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("إشعارات الألوان المدمجة في النظام", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                actions = {
                    FilledTonalButton(
                        onClick = {
                            // تجربة فورية لإشعارات الألوان والفلاش
                            if (isFlashEnabled) {
                                FlashController(context).triggerPulseSequence(pulses = rhythmCount)
                            }
                            if (isEdgeLightEnabled) {
                                EdgeLightingOverlayService.start(context, AndroidColor.parseColor("#25D366"))
                            }
                        },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Bolt, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("تجربة وميض", fontSize = 12.sp)
                    }
                }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // كارت التحقق من الأذونات الأساسية
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Security, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("صلاحيات الوصول للنظام", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedButton(
                                onClick = {
                                    val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                                    context.startActivity(intent)
                                },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("إذن الإشعارات", fontSize = 11.sp)
                            }
                            OutlinedButton(
                                onClick = {
                                    if (!Settings.canDrawOverlays(context)) {
                                        val intent = Intent(
                                            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                                            Uri.parse("package:\${context.packageName}")
                                        )
                                        context.startActivity(intent)
                                    }
                                },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("إذن ظهور الحواف", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            // خيارات التحكم الرئيسية
            item {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("تشغيل الخدمة العامة", fontWeight = FontWeight.Bold)
                                Text("تفعيل استجابة الهاتف لجميع الإشعارات", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isServiceEnabled,
                                onCheckedChange = {
                                    isServiceEnabled = it
                                    AppPreferences.setServiceEnabled(context, it)
                                }
                            )
                        }

                        Divider()

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("وميض فلاش الكاميرا الخلفي", fontWeight = FontWeight.Bold)
                                Text("نبضات ضوئية عند وصول رسالة", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isFlashEnabled,
                                onCheckedChange = {
                                    isFlashEnabled = it
                                    AppPreferences.setFlashEnabled(context, it)
                                }
                            )
                        }

                        Divider()

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("إضاءة الحواف بالألوان", fontWeight = FontWeight.Bold)
                                Text("توهج إطار الشاشة بلون التطبيق المرسل", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isEdgeLightEnabled,
                                onCheckedChange = {
                                    isEdgeLightEnabled = it
                                    AppPreferences.setEdgeLightEnabled(context, it)
                                }
                            )
                        }
                    }
                }
            }

            // قائمة تخصيص الألوان لكل تطبيق
            item {
                Text(
                    "ألوان الإشعارات المخصصة للتطبيقات",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(sampleApps) { app ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(CircleShape)
                                    .background(app.defaultColor)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(app.name, fontWeight = FontWeight.Medium, fontSize = 14.sp)
                                Text(app.packageName, fontSize = 11.sp, color = Color.Gray)
                            }
                        }

                        TextButton(
                            onClick = {
                                // تجربة فورية للون هذا التطبيق
                                EdgeLightingOverlayService.start(context, app.defaultColor.toArgb())
                                if (isFlashEnabled) {
                                    FlashController(context).triggerPulseSequence(2)
                                }
                            }
                        ) {
                            Text("معاينة اللون", fontSize = 12.sp)
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}
