/**
 * NovaEstate Mobile - Expo Push Notifications Infrastructure
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure default notification handler behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  /**
   * Register device for Expo Push Notifications
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        console.log('[NotificationService] Web platform push notification stub active.');
        return 'web-push-token-mock';
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('[NotificationService] Push notification permissions not granted');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      console.log('[NotificationService] Registered Expo Push Token:', tokenData.data);
      return tokenData.data;
    } catch (err) {
      console.warn('[NotificationService] Error registering push notifications:', err);
      return null;
    }
  }

  /**
   * Schedule a local notification (e.g. Lead Alert, Open House Reminder, Follow-up)
   */
  static async scheduleLocalNotification(title: string, body: string, data?: Record<string, any>, delaySeconds = 1): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
      },
      trigger: delaySeconds <= 0 ? null : {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
      },
    });
  }

  /**
   * Trigger instant Lead Alert push notification
   */
  static async triggerLeadAlertNotification(clientName: string, propertyAddress: string) {
    return await this.scheduleLocalNotification(
      '🔥 NEW HOT WEBSITE LEAD!',
      `${clientName} requested showing for ${propertyAddress}. Tap to contact lead immediately!`,
      { type: 'LEAD_ALERT', clientName, propertyAddress }
    );
  }
}
