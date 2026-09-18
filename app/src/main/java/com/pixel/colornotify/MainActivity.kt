package com.pixel.colornotify

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    PixelTorchNotifyScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PixelTorchNotifyScreen() {
    val context = LocalContext.current
    var isServiceEnabled by remember { mutableStateOf(AppPreferences.isServiceEnabled(context)) }
    var isFlashEnabled by remember { mutableStateOf(AppPreferences.isFlashEnabled(context)) }
    var rhythmCount by remember { mutableStateOf(AppPreferences.getRhythmCount(context)) }
    var isDndAware by remember { mutableStateOf(AppPreferences.isDndAware(context)) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Pixel Torch Notify", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("إشعارات وميض الفلاش الخلفي فقط (Lampe Torche)", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                actions = {
                    FilledTonalButton(
                        onClick = {
                            FlashController(context).triggerPulseSequence(pulses = rhythmCount)
                        },
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(Icons.Default.Bolt, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("تجربة الفلاش", fontSize = 12.sp)
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
            // كارت إذن الإشعارات
            item {
                Card(
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.FlashlightOn, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("صلاحية الوصول للإشعارات", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            "مطلوبة لتمكين الفلاش الخلفي (Lampe Torche) من الوميض فور وصول أي إشعار.",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Button(
                            onClick = {
                                val intent = Intent(Settings.ACTION_NOTIFICATION_LISTENER_SETTINGS)
                                context.startActivity(intent)
                            },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("تفعيل إذن الاستماع للإشعارات", fontSize = 13.sp)
                        }
                    }
                }
            }

            // خيارات التحكم في الفلاش
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
                                Text("الخدمة العامة", fontWeight = FontWeight.Bold)
                                Text("تشغيل مراقبة الإشعارات في الخلفية", fontSize = 12.sp, color = Color.Gray)
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
                            Column(modifier = Modifier.weight(1f)) {
                                Text("وميض الفلاش الخلفي (Lampe Torche)", fontWeight = FontWeight.Bold)
                                Text("إطلاق وميض الفلاش عند وصول أي رسالة أو مكالمة", fontSize = 12.sp, color = Color.Gray)
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
                            Column(modifier = Modifier.weight(1f)) {
                                Text("احترام وضع عدم الإزعاج (Do Not Disturb)", fontWeight = FontWeight.Bold)
                                Text("إيقاف الفلاش تلقائياً عند تفعيل الوضع الصامت/عدم الإزعاج", fontSize = 12.sp, color = Color.Gray)
                            }
                            Switch(
                                checked = isDndAware,
                                onCheckedChange = {
                                    isDndAware = it
                                    AppPreferences.setDndAware(context, it)
                                }
                            )
                        }

                        Divider()

                        Column {
                            Text("عدد نبضات الفلاش لكل إشعار: $rhythmCount", fontWeight = FontWeight.Bold)
                            Slider(
                                value = rhythmCount.toFloat(),
                                onValueChange = {
                                    rhythmCount = it.toInt()
                                    AppPreferences.setRhythmCount(context, rhythmCount)
                                },
                                valueRange = 1f..6f,
                                steps = 4
                            )
                        }
                    }
                }
            }
        }
    }
}
