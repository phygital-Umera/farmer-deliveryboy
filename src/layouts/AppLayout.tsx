import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuthContext } from '@/context/AuthContext';
import { BottomNav } from '@/components/maincomponents/BottomNav';
import { DeliveryTabProvider, useDeliveryTab } from '@/context/DeliveryTabContext';
import { ActiveTab } from '@/types';
import { useGetDelivery } from '@/lib/api and mutation/deliveryOrders/useDelivery';
import { useOrderAlarmPush } from '@/hooks/useOrderAlarmPush';
import { useNewOrderAlarm } from '@/hooks/useNewOrderAlarm';
import { NewOrderAlarmBanner } from '@/components/maincomponents/NewOrderAlarmBanner';

const AppLayoutContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthContext();
  const { activeTab, setActiveTab, activeOrdersCount } = useDeliveryTab();
  const { data: deliveryOrdersData } = useGetDelivery();
  useOrderAlarmPush(isAuthenticated);
  const newOrderAlarm = useNewOrderAlarm(isAuthenticated, user?.id ? String(user.id) : undefined);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthenticated) {
      navigate({ to: '/signin' });
    }
  }, [isAuthenticated, navigate]);

  // Active orders count from API if available
  const apiOrders = (deliveryOrdersData as any)?.data?.orders || (deliveryOrdersData as any)?.orders || [];
  const activeApiCount = apiOrders.filter((o: any) => o.status !== 'DELIVERED').length;
  const countToDisplay = activeApiCount > 0 ? activeApiCount : activeOrdersCount;

  // Check if current route is order details
  const isOrderDetailsPage = location.pathname.includes('/ordersDetails');
  const currentTab: ActiveTab = isOrderDetailsPage ? 'active' : (activeTab === 'task' ? 'active' : activeTab);

  // Don't show sticky bottom nav on sign in / auth pages
  const isAuthPage =
    location.pathname === '/' ||
    location.pathname.includes('/signin') ||
    location.pathname.includes('/register');

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (location.pathname !== '/homepage') {
      navigate({ to: '/homepage' });
    }
  };

  if (!isAuthenticated && !localStorage.getItem('token')) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fcf9f8]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1b6d24] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] font-sans flex flex-col justify-between">
      {/* Main Page Content */}
      <main className={`flex-1 w-full ${!isAuthPage ? 'pb-16' : ''}`}>
        <Outlet />
      </main>

      {/* New-order alarm (web + app fallback) */}
      {isAuthenticated && (
        <NewOrderAlarmBanner
          count={newOrderAlarm.newOrderIds.length}
          onView={newOrderAlarm.viewOrder}
          onStop={newOrderAlarm.dismiss}
        />
      )}

      {/* Sticky Bottom Navigation Bar */}
      {!isAuthPage && (
        <BottomNav
          activeTab={currentTab}
          onTabChange={handleTabChange}
          activeOrdersCount={countToDisplay}
        />
      )}
    </div>
  );
};

export const AppLayout = () => {
  return (
    <DeliveryTabProvider>
      <AppLayoutContent />
    </DeliveryTabProvider>
  );
};

export default AppLayout;
