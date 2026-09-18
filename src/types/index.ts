export type FlashMode = 'strobe' | 'pulse' | 'breathe' | 'continuous';

export interface AppLightConfig {
  id: string;
  name: string;
  packageName: string;
  brandColor: string; // Hex color (e.g. #1877F2 for Facebook)
  flashMode: FlashMode;
  flashCount: number; // Number of pulses (e.g. 2 for Facebook)
  flashSpeedMs: number; // Duration of each flash in ms
  edgeLightingEnabled: boolean;
  rearIndicatorEnabled: boolean;
  cameraRingEnabled: boolean;
  screenFlashEnabled: boolean;
  enabled: boolean;
  customRhythmName?: string;
}

export interface NotificationEvent {
  id: string;
  appName: string;
  packageName: string;
  title: string;
  message: string;
  color: string;
  timestamp: string;
  isTest?: boolean;
}

export interface DeviceSettings {
  deviceModel: 'Pixel 8' | 'Pixel 8 Pro';
  activeView: 'rear' | 'front';
  isScreenOn: boolean;
  isLocked: boolean;
  isPocketMode: boolean;
  batteryLevel: number;
  batterySaverThreshold: number;
  edgeGlowThickness: number; // 2px to 10px
  rearLedBrightness: number; // 1 to 10 (Android 13+ Flash Strength)
  dndBypass: boolean;
  soundEnabled: boolean;
}
