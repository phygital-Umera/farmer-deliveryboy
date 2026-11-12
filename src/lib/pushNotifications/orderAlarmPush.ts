import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { api } from '@/utils/axios';
import { getLanguage, onLanguageChange } from '@/i18n/LanguageContext';

/**
 * Native (Android) push setup for the "new order assigned" alarm.
 *
 * The loud repeating alarm itself is played natively by
 * android/.../OrderAlarmMessagingService.java, so it works even when the app
 * is closed. This file only registers the device token with the backend and
 * reacts to pushes while the app is open.
 */

export const ORDER_ASSIGNED = 'ORDER_ASSIGNED';
const DEVICE_TOKEN_KEY = 'fcmDeviceToken';

export const isNativeApp = () => Capacitor.isNativePlatform();

const saveTokenToBackend = async (token: string) => {
  await api.post('/delivery/device-token', {
    token,
    platform: Capacitor.getPlatform(),
    language: getLanguage(), // 'en' | 'mr' | 'hi' — lets the backend localise the alarm text
  });
  localStorage.setItem(DEVICE_TOKEN_KEY, token);
};

/** Ask for permission, register with FCM and send the token to the backend. */
export const registerForOrderAlarms = async (): Promise<boolean> => {
  if (!isNativeApp()) return false;

  let perm = await PushNotifications.checkPermissions();
  if (perm.receive === 'prompt' || perm.receive === 'prompt-with-rationale') {
    perm = await PushNotifications.requestPermissions();
  }
  if (perm.receive !== 'granted') return false;

  await PushNotifications.register();
  return true;
};

/** Tell the backend to stop sending pushes to this phone (call on logout). */
export const unregisterDeviceToken = async () => {
  if (!isNativeApp()) return;
  const token = localStorage.getItem(DEVICE_TOKEN_KEY);
  localStorage.removeItem(DEVICE_TOKEN_KEY);
  if (token) {
    try {
      await api.delete('/delivery/device-token', { data: { token } });
    } catch {
      // best effort
    }
  }
  try {
    await PushNotifications.unregister();
  } catch {
    // ignore
  }
};

/** Silence any ringing order alarm (cancels our notifications). */
export const stopOrderAlarm = async () => {
  if (!isNativeApp()) return;
  try {
    await PushNotifications.removeAllDeliveredNotifications();
  } catch {
    // ignore
  }
};

type Handlers = {
  onOrderAssigned: (orderId?: string) => void;
  onOrderTapped: (orderId?: string) => void;
};

/** Attach listeners. Returns a cleanup function. */
export const addOrderAlarmListeners = ({ onOrderAssigned, onOrderTapped }: Handlers) => {
  if (!isNativeApp()) return () => {};

  const subs = [
    PushNotifications.addListener('registration', ({ value }) => {
      saveTokenToBackend(value).catch((err) =>
        console.error('Failed to save push token', err),
      );
    }),
    PushNotifications.addListener('registrationError', (err) => {
      console.error('Push registration error', err);
    }),
    // App is open: native side is already ringing; refresh the order list.
    PushNotifications.addListener('pushNotificationReceived', (n) => {
      if (n.data?.type === ORDER_ASSIGNED) onOrderAssigned(n.data?.orderId);
    }),
    // User tapped the alarm notification.
    PushNotifications.addListener('pushNotificationActionPerformed', (a) => {
      const data = a.notification?.data;
      if (data?.type === ORDER_ASSIGNED) onOrderTapped(data?.orderId);
    }),
  ];

  // When the rider changes language, update it on the backend too.
  const offLanguage = onLanguageChange(() => {
    const token = localStorage.getItem(DEVICE_TOKEN_KEY);
    if (token) {
      saveTokenToBackend(token).catch((err) =>
        console.error('Failed to update push language', err),
      );
    }
  });

  return () => {
    offLanguage();
    subs.forEach((p) => p.then((s) => s.remove()));
  };
};
