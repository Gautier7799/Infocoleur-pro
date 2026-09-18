package com.pixel.colornotify

import android.content.Intent
import android.graphics.Color as AndroidColor
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
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

data class AppColorTarget(
    val name: String,
    val packageName: String,
    val color: Color
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
    var isScreenFlashEnabled by remember { mutableStateOf(AppPreferences.isScreenFlashEnabled(context)) }
    var isTorchFlashEnabled by remember { mutableStateOf(AppPreferences.isTorchFlashEnabled(context)) }
    var isFullScreenMode by remember { mutableStateOf(AppPreferences.isFullScreenMode(context)) }
    var rhythmCount by remember { mutableStateOf(AppPreferences.getRhythmCount(context)) }
    var isDndAware by remember { mutableStateOf(AppPreferences.isDndAware(context)) }

    val presetApps = remember {
        listOf(
            AppColorTarget("واتساب (WhatsApp)", "com.whatsapp", Color(0xFF25D366)),
            AppColorTarget("تيليجرام (Telegram)", "org.telegram.messenger", Color(0xFF0088CC)),
            AppColorTarget("المكالمات الهاتفية", "com.google.android.dialer", Color(0xFF34A853)),
            AppColorTarget("الرسائل النصية SMS", "com.google.android.apps.messaging", Color(0xFF1A73E8)),
            AppColorTarget("انستجرام (Instagram)", "com.instagram.android", Color(0xFFE1306C)),
            AppColorTarget("جيميل (Gmail)", "com.google.android.gm", Color(0xFFEA4335)),
            AppColorTarget("سناب شات (Snapchat)", "com.snapchat.android", Color(0xFFFFFC00))
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Pixel Color Notify Pro", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("وميض الألوان المخصص لكل تطبيق", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                actions = {
                    FilledTonalButton(
                        onClick = {
                            // تجربة فورية لوميض الشاشة والفلاش
                            if (isScreenFlashEnabled) {
                                ScreenColorFlashService.flash(context, AndroidColor.parseColor("#25D366"), isFullScreenMode, rhythmCount)
                            }
                            if (isTorchFlashEnabled) {
                                FlashController(context).triggerPulseSequence(pulses = rhythmCount)
                            }
                        },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Palette, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("معاينة التجربة", fontSize = 12.sp)
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
            // كارت الصلاحيات
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
                            Text("الأذونات المطلوبة لتلوين الشاشة والفلاش", fontWeight = FontWeight.Bold, fontSize = 14.sp)
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
                                            Uri.parse("package:${context.packageName}")
                                        )
                                        context.startActivity(intent)
                                    }
                                },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            ) {
                                Text("إذن تلوين الشاشة", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            // خيارات وميض الشاشة والألوان
            item {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("وميض الشاشة الملون (Clignotement écran)", fontWeight = FontWeight.Bold)
                                Text("يتلون تلقائياً بلون التطبيق المرسل للإشعار", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isScreenFlashEnabled,
                                onCheckedChange = {
                                    isScreenFlashEnabled = it
                                    AppPreferences.setScreenFlashEnabled(context, it)
                                }
                            )
                        }

                        Divider()

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("نمط الوميض: ${if (isFullScreenMode) "الشاشة كاملة" else "حواف الشاشة المنحنية (Edge Glow)"}", fontWeight = FontWeight.Bold)
                                Text("إطار الحواف يوفر البطارية ومريح جداً للعين", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isFullScreenMode,
                                onCheckedChange = {
                                    isFullScreenMode = it
                                    AppPreferences.setFullScreenMode(context, it)
                                }
                            )
                        }

                        Divider()

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("وميض فلاش الكاميرا الخلفي (Lampe Torche)", fontWeight = FontWeight.Bold)
                                Text("تشغيل الفلاش الخلفي بالتزامن مع وميض اللون", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isTorchFlashEnabled,
                                onCheckedChange = {
                                    isTorchFlashEnabled = it
                                    AppPreferences.setTorchFlashEnabled(context, it)
                                }
                            )
                        }

                        Divider()

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("وضع عدم الإزعاج (Do Not Disturb)", fontWeight = FontWeight.Bold)
                                Text("الصمت التام أثناء وضع النوم أو الاجتماعات", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isDndAware,
                                onCheckedChange = {
                                    isDndAware = it
                                    AppPreferences.setDndAware(context, it)
                                }
                            )
                        }
                    }
                }
            }

            // قائمة استعراض ألوان التطبيقات
            item {
                Text(
                    "ألوان التطبيقات التلقائية (جرب اللون بلمسة واحدة)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            items(presetApps) { app ->
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
                                    .size(26.dp)
                                    .clip(CircleShape)
                                    .background(app.color)
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(app.name, fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                                Text(app.packageName, fontSize = 11.sp, color = Color.Gray)
                            }
                        }

                        FilledTonalButton(
                            onClick = {
                                ScreenColorFlashService.flash(context, app.color.toArgb(), isFullScreenMode, 2)
                                if (isTorchFlashEnabled) {
                                    FlashController(context).triggerPulseSequence(2)
                                }
                            },
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text("تجربة اللون", fontSize = 11.sp)
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(30.dp))
            }
        }
    }
}
