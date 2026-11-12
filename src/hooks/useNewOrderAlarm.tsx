import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetDelivery } from '@/lib/api and mutation/deliveryOrders/useDelivery';
import { setupAlarmUnlock, startAlarm, stopAlarm } from '@/lib/orderAlarm/alarmSound';
import { isNativeApp, stopOrderAlarm } from '@/lib/pushNotifications/orderAlarmPush';
import { translate } from '@/i18n/LanguageContext';

/**
 * Rings an alarm when a NEW order with status ASSIGNED appears in the
 * delivery-boy's order list. Works in the browser (and in the Android app
 * as a fallback when Firebase push is not set up yet).
 *
 * The order list is polled by useGetDelivery (refetchInterval).
 */

const POLL_SEEN_KEY = (userId: string) => `seenAssignedOrders:${userId}`;

const readSeen = (userId: string): Set<string> | null => {
  try {
    const raw = localStorage.getItem(POLL_SEEN_KEY(userId));
    return raw ? new Set(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeSeen = (userId: string, ids: Set<string>) => {
  try {
    // keep the list small
    localStorage.setItem(POLL_SEEN_KEY(userId), JSON.stringify(Array.from(ids).slice(-300)));
  } catch {
    // ignore
  }
};

const extractOrders = (data: any): any[] => {
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.orders)) return data.data.orders;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data)) return data;
  return [];
};

const showBrowserNotification = (count: number, orderId: string, onClick: () => void) => {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(translate('alarm.newOrder'), {
      body: count > 1 ? translate('alarm.newOrders', { n: count }) : translate('alarm.tapToView'),
      tag: `order-${orderId}`,
      requireInteraction: true,
    });
    n.onclick = () => {
      window.focus();
      onClick();
      n.close();
    };
  } catch {
    // Some mobile browsers only allow notifications from a service worker.
  }
};

export const useNewOrderAlarm = (enabled: boolean, userId?: string) => {
  const navigate = useNavigate();
  const { data } = useGetDelivery();
  const [newOrderIds, setNewOrderIds] = useState<string[]>([]);
  const seenRef = useRef<Set<string> | null>(null);

  // Native app with working Firebase push already rings natively; avoid a double alarm.
  const pushActive = isNativeApp() && !!localStorage.getItem('fcmDeviceToken');

  useEffect(() => {
    if (!enabled) return;
    setupAlarmUnlock();

    // Ask once for browser notification permission (needs a user tap in some browsers).
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      const ask = () => {
        Notification.requestPermission().catch(() => {});
        window.removeEventListener('pointerdown', ask, true);
      };
      window.addEventListener('pointerdown', ask, true);
      return () => window.removeEventListener('pointerdown', ask, true);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !userId || !data) return;

    const assignedIds = extractOrders(data)
      .filter((o) => String(o?.status).toUpperCase() === 'ASSIGNED' && o?.id)
      .map((o) => String(o.id));

    if (!seenRef.current) {
      const stored = readSeen(userId);
      if (!stored) {
        // First time on this device: don't ring for orders that were already there.
        seenRef.current = new Set(assignedIds);
        writeSeen(userId, seenRef.current);
        return;
      }
      seenRef.current = stored;
    }

    const fresh = assignedIds.filter((id) => !seenRef.current!.has(id));
    if (fresh.length === 0) return;

    fresh.forEach((id) => seenRef.current!.add(id));
    writeSeen(userId, seenRef.current);

    setNewOrderIds((prev) => Array.from(new Set([...prev, ...fresh])));
    if (!pushActive) {
      startAlarm();
      showBrowserNotification(fresh.length, fresh[0], () => {
        stopAlarm();
        setNewOrderIds([]);
        navigate({ to: '/ordersDetails/$id', params: { id: fresh[0] } });
      });
    }
  }, [data, enabled, userId, pushActive, navigate]);

  // Stop the alarm when logging out / leaving.
  useEffect(() => {
    if (!enabled) {
      stopAlarm();
      setNewOrderIds([]);
    }
  }, [enabled]);

  const dismiss = useCallback(() => {
    stopAlarm();
    stopOrderAlarm(); // native app: cancel the ringing notification too
    setNewOrderIds([]);
  }, []);

  const viewOrder = useCallback(() => {
    const id = newOrderIds[0];
    dismiss();
    if (id) navigate({ to: '/ordersDetails/$id', params: { id } });
  }, [newOrderIds, dismiss, navigate]);

  return { newOrderIds, dismiss, viewOrder };
};
