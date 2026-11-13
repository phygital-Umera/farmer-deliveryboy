import React, {useState} from 'react';
import {Order, ShiftStats} from '../../../types';
import {useDeliveryhistory} from '@/lib/api and mutation/deliveryOrders/useDelivery';
import {useT} from '@/i18n/LanguageContext';
import {
  matchesFilter,
  formatCompletedTime,
  CashReconciliationModal,
  HistoryPerformanceCard,
  HistoryOrderCard,
} from './deliveryHistory';

interface DeliveryHistoryViewProps {
  historyOrders?: Order[];
  shiftStats: ShiftStats;
  onSelectOrderDetails?: (order: Order) => void;
  onSelectOrder?: (order: Order) => void;
}

export const DeliveryHistoryView: React.FC<DeliveryHistoryViewProps> = ({
  historyOrders = [],
  shiftStats,
  onSelectOrderDetails,
  onSelectOrder = onSelectOrderDetails || (() => {}),
}) => {
  const t = useT();
  const [filter, setFilter] = useState<'all' | 'today' | 'yesterday'>('all');
  const [showReconciliationModal, setShowReconciliationModal] = useState(false);
  const [reconciliationSubmitted, setReconciliationSubmitted] = useState(false);

  const {data: deliveryData, isLoading} = useDeliveryhistory();

  // Extract orders from API response (data.orders) or fallback to historyOrders
  const apiOrders =
    (deliveryData as any)?.data?.orders || (deliveryData as any)?.orders || [];
  const rawOrdersList = apiOrders.length > 0 ? apiOrders : historyOrders;

  const normalizedOrders = rawOrdersList.map((item: any) => {
    const shortId = item.orderNo
      ? item.orderNo.length > 12
        ? `#${item.orderNo.slice(0, 8).toUpperCase()}`
        : `#${item.orderNo}`
      : item.orderNumber ||
        (item.id?.length > 12
          ? `#${item.id.slice(0, 8).toUpperCase()}`
          : item.id);

    const addressText =
      typeof item.address === 'string'
        ? item.address
        : item.address && typeof item.address === 'object'
          ? [
              item.address.address || item.address.flatAndBuilding,
              item.address.landmark || item.address.sectorOrArea,
              item.address.pincode,
            ]
              .filter(Boolean)
              .join(', ') ||
            item.address.fullAddress ||
            'Delivery Address'
          : 'Delivery Address';

    const customerName =
      item.customer?.user?.fullname || item.customerName || 'Customer';

    const itemsList = Array.isArray(item.items)
      ? item.items.map((i: any) => ({
          ...i,
          name: i.productName || i.name || 'Produce Item',
          quantityStr:
            i.quantityStr ||
            (i.totalQuantity
              ? `${i.totalQuantity} kg`
              : i.productQuantity
                ? `${i.productQuantity} kg`
                : `${i.productCount || 1} pc`),
        }))
      : [];

    const itemsSummary =
      item.itemsSummary ||
      (itemsList.length > 0
        ? itemsList
            .map(
              (i: any) =>
                `${i.name}${i.quantityStr ? ` (${i.quantityStr})` : ''}`,
            )
            .join(', ')
        : `${item.itemsCount || 1} Items`);

    const completedTime = formatCompletedTime(
      item.completedAt || item.deliveredAt || item.placedTime,
    );
    const paymentType =
      item.paymentType || (item.paymentMethod === 'COD' ? 'COD' : 'COD');
    const total = item.grandTotal ?? item.total ?? 0;
    const codAmount = item.codAmount ?? item.totalCashToCollect ?? total;

    return {
      ...item,
      id: shortId,
      rawId: item.id,
      orderNumber: shortId,
      customerName,
      address: addressText,
      completedAt: completedTime,
      placedTime: completedTime,
      paymentType,
      codAmount,
      total,
      itemsSummary,
      items: itemsList,
      deliveredAt: item.deliveredAt,
      createdAt: item.createdAt,
    };
  });

  const filteredHistory = normalizedOrders.filter((order: any) =>
    matchesFilter(order.deliveredAt || order.createdAt, filter),
  );

  // Calculate summary metrics directly from API response orders
  const todayOrders = normalizedOrders.filter((order: any) =>
    matchesFilter(order.deliveredAt || order.createdAt, 'today'),
  );

  const activeStatsOrders =
    filter === 'all'
      ? normalizedOrders
      : filter === 'yesterday'
        ? normalizedOrders.filter((order: any) =>
            matchesFilter(order.deliveredAt || order.createdAt, 'yesterday'),
          )
        : todayOrders.length > 0
          ? todayOrders
          : normalizedOrders;

  const deliveriesCount = activeStatsOrders.length;

  const todayEarnings = todayOrders.reduce(
    (sum: number, o: any) => sum + (Number(o.total || o.grandTotal) || 0),
    0,
  );

  const displayedEarnings =
    filter === 'yesterday'
      ? activeStatsOrders.reduce(
          (sum: number, o: any) => sum + (Number(o.total || o.grandTotal) || 0),
          0,
        )
      : todayOrders.length > 0
        ? todayEarnings
        : activeStatsOrders.reduce(
            (sum: number, o: any) =>
              sum + (Number(o.total || o.grandTotal) || 0),
            0,
          );

  const codCashInHand = activeStatsOrders.reduce((sum: number, o: any) => {
    const isCod =
      o.paymentType === 'COD' || o.paymentMethod === 'COD' || !o.paymentMethod;
    return isCod ? sum + (Number(o.total || o.grandTotal) || 0) : sum;
  }, 0);

  return (
    <div className="animate-in fade-in flex w-full flex-col pb-28 pt-2 duration-200">
      <div className="space-y-4 px-4">
        {/* Shift Performance Card */}
        <HistoryPerformanceCard
          filter={filter}
          displayedEarnings={displayedEarnings}
          deliveriesCount={deliveriesCount}
          codCashInHand={codCashInHand}
          onOpenReconciliation={() => setShowReconciliationModal(true)}
        />

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'today', 'yesterday'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold capitalize transition-all ${
                filter === tab
                  ? 'shadow-2xs bg-[#1b5e20] text-white'
                  : 'hover:bg-gray-50 border border-[#e0e6e0] bg-white text-[#525e54]'
              }`}
            >
              {tab === 'all'
                ? t('history.filterAll')
                : tab === 'today'
                  ? t('history.filterToday')
                  : t('history.filterYesterday')}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && !rawOrdersList.length && (
          <div className="text-gray-500 flex items-center justify-center gap-2 py-8 text-center text-xs">
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
            {t('history.loading')}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredHistory.length === 0 && (
          <div className="rounded-2xl border border-[#e0e6e0] bg-white p-6 text-center text-[#717a6d]">
            <span className="material-symbols-outlined text-gray-400 mb-1 text-[32px]">
              receipt_long
            </span>
            <p className="font-headline text-xs font-bold text-[#1b1c1c]">
              {t('history.empty')}
            </p>
          </div>
        )}

        {/* Order Cards List */}
        <div className="space-y-3">
          {filteredHistory.map((order: any, index: number) => (
            <HistoryOrderCard
              key={order.id || index}
              order={order}
              onSelect={() => onSelectOrder(order)}
            />
          ))}
        </div>
      </div>

      {/* Cash Reconciliation Modal */}
      <CashReconciliationModal
        isOpen={showReconciliationModal}
        onClose={() => {
          setShowReconciliationModal(false);
          setReconciliationSubmitted(false);
        }}
        reconciliationSubmitted={reconciliationSubmitted}
        onSubmit={() => setReconciliationSubmitted(true)}
        shiftStats={shiftStats}
        codCashInHand={codCashInHand}
      />
    </div>
  );
};

export default DeliveryHistoryView;
