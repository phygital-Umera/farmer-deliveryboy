import { useState, useEffect } from 'react';
import { ActiveTab, Order, ShiftStats } from '@/types';
import {
  INITIAL_ACTIVE_ORDERS,
  INITIAL_HISTORY_ORDERS,
  INITIAL_SHIFT_STATS,
} from '@/data/mockOrders';
import { Header } from '@/components/maincomponents/Header';
import { ActiveOrdersView } from '@/components/maincomponents/ActiveOrdersView';
import { DeliveryHistoryView } from '@/components/maincomponents/DeliveryHistoryView';
import { NavigationModal } from '@/components/maincomponents/NavigationModal';
import { SosModal } from '@/components/maincomponents/SosModal';
import { OrderDetailModal } from '@/components/maincomponents/OrderDetailModal';
import { useDeliveryTab } from '@/context/DeliveryTabContext';

export default function DeliveryApp() {
  const { activeTab, setActiveTab, setActiveOrdersCount } = useDeliveryTab();
  const [activeOrders, setActiveOrders] = useState<Order[]>(INITIAL_ACTIVE_ORDERS);
  const [historyOrders, setHistoryOrders] = useState<Order[]>(INITIAL_HISTORY_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('asm-9410');
  const [shiftStats, setShiftStats] = useState<ShiftStats>(INITIAL_SHIFT_STATS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [navigatingOrder, setNavigatingOrder] = useState<Order | null>(null);
  const [showSosModal, setShowSosModal] = useState(false);
  const [inspectingOrder, setInspectingOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (activeTab === 'task') {
      setActiveTab('active');
    }
  }, [activeTab, setActiveTab]);

  // Currently selected active order for the Task tab
  const currentTaskOrder =
    activeOrders.find((o) => o.id === selectedOrderId) || activeOrders[0] || null;

  // Select an order to work on
  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
  };

  // Mark delivery complete
  const handleCompleteDelivery = (orderId: string, collectedViaUpi: boolean) => {
    const targetOrder = activeOrders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const completedOrder: Order = {
      ...targetOrder,
      status: 'delivered',
      statusBadge: 'Delivered',
      paymentStatus: 'COLLECTED',
      paymentModeLabel: collectedViaUpi
        ? `Paid UPI (₹${targetOrder.totalCashToCollect})`
        : targetOrder.paymentMethod === 'COD'
          ? `Paid Cash (₹${targetOrder.totalCashToCollect})`
          : targetOrder.paymentModeLabel,
      deliveredAt: 'Just now',
      deliveryDurationMinutes: 14,
    };

    // Update history and active orders
    setHistoryOrders((prev) => [completedOrder, ...prev]);
    const remainingOrders = activeOrders.filter((o) => o.id !== orderId);
    setActiveOrders(remainingOrders);

    // Update shift statistics
    setShiftStats((prev) => {
      const addedCash =
        targetOrder.paymentMethod === 'COD' && !collectedViaUpi
          ? targetOrder.totalCashToCollect
          : 0;
      return {
        ...prev,
        todayEarnings: prev.todayEarnings + targetOrder.tripEarnings,
        totalDeliveriesToday: prev.totalDeliveriesToday + 1,
        codCashInHand: prev.codCashInHand + addedCash,
        distanceCoveredKm: Number((prev.distanceCoveredKm + targetOrder.distanceKm).toFixed(1)),
      };
    });

    if (remainingOrders.length > 0) {
      setSelectedOrderId(remainingOrders[0].id);
    }
  };

  // Report delivery issue
  const handleReportIssue = (orderId: string, reason: string) => {
    setActiveOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
            ...o,
            status: 'issue_reported',
            statusBadge: 'Support Escalated',
            issueReason: reason,
          }
          : o
      )
    );
  };

  // Toggle On Duty / Off Duty
  const handleToggleDuty = () => {
    setShiftStats((prev) => ({
      ...prev,
      isOnDuty: !prev.isOnDuty,
    }));
  };

  // Refresh data from Mandi Hub
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1b1c1c] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        shiftStats={shiftStats}
        onToggleDuty={handleToggleDuty}
        onOpenSos={() => setShowSosModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto pt-14">
        {activeTab !== 'history' ? (
          <ActiveOrdersView
            orders={activeOrders}
            onSelectOrder={handleSelectOrder}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
          />
        ) : (
          <DeliveryHistoryView
            historyOrders={historyOrders}
            shiftStats={shiftStats}
            onSelectOrder={(ord) => setInspectingOrder(ord)}
            onSelectOrderDetails={(ord) => setInspectingOrder(ord)}
          />
        )}
      </main>

      {/* Turn-by-Turn GPS Navigation Overlay */}
      {navigatingOrder && (
        <NavigationModal
          order={navigatingOrder}
          onClose={() => setNavigatingOrder(null)}
          onArrived={() => {
            setNavigatingOrder(null);
            setSelectedOrderId(navigatingOrder.id);
            setActiveTab('active');
          }}
        />
      )}

      {/* SOS Emergency Modal */}
      {showSosModal && <SosModal onClose={() => setShowSosModal(false)} />}

      {/* History Order Details Modal */}
      {inspectingOrder && (
        <OrderDetailModal
          order={inspectingOrder}
          onClose={() => setInspectingOrder(null)}
        />
      )}
    </div>
  );
}
