import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { App as CapApp } from '@capacitor/app';
import {
  addOrderAlarmListeners,
  isNativeApp,
  registerForOrderAlarms,
  stopOrderAlarm,
} from '@/lib/pushNotifications/orderAlarmPush';

/**
 * Mount once inside the logged-in layout. Registers this phone for
 * "new order assigned" alarm pushes and reacts to them.
 */
export const useOrderAlarmPush = (enabled: boolean) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled || !isNativeApp()) return;

    const refreshOrders = () =>
      queryClient.invalidateQueries({ queryKey: ['delivery'] });

    const removeListeners = addOrderAlarmListeners({
      // App open: refreshing the list makes useNewOrderAlarm show the red
      // banner (with "Stop alarm", which also silences the native alarm).
      onOrderAssigned: () => {
        refreshOrders();
      },
      onOrderTapped: (orderId) => {
        stopOrderAlarm();
        refreshOrders();
        if (orderId) {
          navigate({ to: '/ordersDetails/$id', params: { id: orderId } });
        } else {
          navigate({ to: '/homepage' });
        }
      },
    });

    // Refresh orders whenever the app comes back to the foreground.
    const resumeSub = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) refreshOrders();
    });

    registerForOrderAlarms().catch((err) =>
      console.error('Push registration failed', err),
    );

    return () => {
      removeListeners();
      resumeSub.then((s) => s.remove());
    };
  }, [enabled, navigate, queryClient]);
};
