import React, { useState } from 'react';
import { Order, ShiftStats } from '../../../types';
import { useDeliveryhistory } from '@/lib/api and mutation/deliveryOrders/useDelivery';
import { useT } from '@/i18n/LanguageContext';

interface DeliveryHistoryViewProps {
  historyOrders?: Order[];
  shiftStats: ShiftStats;
  onSelectOrderDetails?: (order: Order) => void;
  onSelectOrder?: (order: Order) => void;
}

const formatCompletedTime = (dateStr?: string | null) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch {
    return dateStr;
  }
};

const matchesFilter = (dateStr?: string | null, filter: 'all' | 'today' | 'yesterday' = 'all') => {
  if (filter === 'all') return true;
  if (!dateStr) return filter === 'today';
  if (filter === 'today' && (dateStr.includes('Today') || dateStr.includes('Just now'))) return true;
  if (filter === 'yesterday' && dateStr.includes('Yesterday')) return true;

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const target = new Date();
    if (filter === 'yesterday') {
      target.setDate(target.getDate() - 1);
    }
    return (
      d.getDate() === target.getDate() &&
      d.getMonth() === target.getMonth() &&
      d.getFullYear() === target.getFullYear()
    );
  } catch {
    return true;
  }
};

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

  const { data: deliveryData, isLoading } = useDeliveryhistory();

  // Extract orders from API response (data.orders) or fallback to historyOrders
  const apiOrders = (deliveryData as any)?.data?.orders || (deliveryData as any)?.orders || [];
  const rawOrdersList = apiOrders.length > 0 ? apiOrders : historyOrders;

  const normalizedOrders = rawOrdersList.map((item: any) => {
    const shortId = item.orderNo
      ? item.orderNo.length > 12
        ? `#${item.orderNo.slice(0, 8).toUpperCase()}`
        : `#${item.orderNo}`
      : item.orderNumber || (item.id?.length > 12 ? `#${item.id.slice(0, 8).toUpperCase()}` : item.id);

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
              .join(', ') || item.address.fullAddress || 'Delivery Address'
          : 'Delivery Address';

    const customerName =
      item.customer?.user?.fullname ||
      item.customerName ||
      'Customer';

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
        ? itemsList.map((i: any) => `${i.name}${i.quantityStr ? ` (${i.quantityStr})` : ''}`).join(', ')
        : `${item.itemsCount || 1} Items`);

    const completedTime = formatCompletedTime(item.completedAt || item.deliveredAt || item.placedTime);
    const paymentType = item.paymentType || (item.paymentMethod === 'COD' ? 'COD' : 'COD');
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
    matchesFilter(order.deliveredAt || order.createdAt, filter)
  );

  // Calculate summary metrics directly from API response orders
  const todayOrders = normalizedOrders.filter((order: any) =>
    matchesFilter(order.deliveredAt || order.createdAt, 'today')
  );

  const activeStatsOrders =
    filter === 'all'
      ? normalizedOrders
      : filter === 'yesterday'
        ? normalizedOrders.filter((order: any) => matchesFilter(order.deliveredAt || order.createdAt, 'yesterday'))
        : todayOrders.length > 0
          ? todayOrders
          : normalizedOrders;

  const deliveriesCount = activeStatsOrders.length;

  const todayEarnings = todayOrders.reduce(
    (sum: number, o: any) => sum + (Number(o.total || o.grandTotal) || 0),
    0
  );

  const displayedEarnings =
    filter === 'yesterday'
      ? activeStatsOrders.reduce((sum: number, o: any) => sum + (Number(o.total || o.grandTotal) || 0), 0)
      : todayOrders.length > 0
        ? todayEarnings
        : activeStatsOrders.reduce((sum: number, o: any) => sum + (Number(o.total || o.grandTotal) || 0), 0);

  const codCashInHand = activeStatsOrders.reduce((sum: number, o: any) => {
    const isCod = o.paymentType === 'COD' || o.paymentMethod === 'COD' || !o.paymentMethod;
    return isCod ? sum + (Number(o.total || o.grandTotal) || 0) : sum;
  }, 0);

  return (
    <div className="flex flex-col w-full pb-28 pt-2 animate-in fade-in duration-200">
      <div className="px-4 space-y-4">
        {/* Shift Performance Card */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#e8ece7] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[#1b6d24] text-[20px]">
                trending_up
              </span>
              <h2 className="text-[17px] font-extrabold text-[#1b1c1c] tracking-tight">
                {t('history.performance')}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[12px] text-[#525e54] mr-1">
                {filter === 'yesterday' ? t('history.yesterdayEarnings') : t('history.todayEarnings')}
              </span>
              <span className="text-[22px] font-black text-[#1b6d24]">
                ₹{displayedEarnings}
              </span>
            </div>
          </div>

          {/* Performance 2-Column Stat Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Deliveries Count */}
            <div className="bg-[#f6f3f2] rounded-xl px-2.5 py-2 flex items-center justify-between border border-[#ebe7e6] min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[#1b6d24] text-[19px] shrink-0">
                  local_shipping
                </span>
                <span className="text-[11px] font-bold text-[#41493e] truncate">
                  {t('history.deliveries')}
                </span>
              </div>
              <div className="text-right leading-none shrink-0 pl-1">
                <span className="text-[16px] font-black text-[#1b1c1c]">
                  {deliveriesCount}
                </span>
                <span className="text-[10px] font-medium text-[#525e54] block mt-0.5">
                  {t('history.orders')}
                </span>
              </div>
            </div>

            {/* COD Cash in Hand */}
            <div className="bg-[#f6f3f2] rounded-xl px-2.5 py-2 flex items-center justify-between border border-[#ebe7e6] min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[#1b6d24] text-[19px] shrink-0">
                  payments
                </span>
                <span className="text-[11px] font-bold text-[#41493e] shrink-0">
                  {t('history.cod')}
                </span>
              </div>
              <div className="text-right leading-none shrink-0 pl-1">
                <span className="text-[15px] font-black text-[#1b1c1c]">
                  ₹{codCashInHand.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub Cash Settlement Pill */}
          <div className="pt-0.5">
            <button
              type="button"
              onClick={() => setShowReconciliationModal(true)}
              className="w-full py-1.5 px-2.5 rounded-lg bg-[#a0f399]/40 hover:bg-[#a0f399]/70 text-[#005312] text-[11px] font-bold flex items-center justify-between transition-colors border border-[#a0f399] active:scale-98"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[16px] shrink-0">account_balance_wallet</span>
                <span className="truncate">{t('history.hubHandover')}</span>
              </div>
              <span className="underline shrink-0 text-[11px]">{t('history.reconcile', { amount: codCashInHand.toLocaleString() })}</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'today', 'yesterday'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-[#1b5e20] text-white shadow-2xs'
                  : 'bg-white text-[#525e54] border border-[#e0e6e0] hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? t('history.filterAll') : tab === 'today' ? t('history.filterToday') : t('history.filterYesterday')}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && !rawOrdersList.length && (
          <div className="py-8 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            {t('history.loading')}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredHistory.length === 0 && (
          <div className="bg-white rounded-2xl p-6 border border-[#e0e6e0] text-center text-[#717a6d]">
            <span className="material-symbols-outlined text-[32px] text-gray-400 mb-1">
              receipt_long
            </span>
            <p className="font-headline font-bold text-xs text-[#1b1c1c]">{t('history.empty')}</p>
          </div>
        )}

        {/* Deliveries History List */}
        <div className="space-y-3">
          {filteredHistory.map((order: any) => (
            <div
              key={order.rawId || order.id}
              // onClick={() => onSelectOrder(order)}
              className="bg-white rounded-2xl p-3.5 border border-[#e0e6e0] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col gap-2"
            >
              {/* Top Row: Order ID, Delivered Badge, Earnings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* <span className="font-label text-[13px] font-bold text-[#1b1c1c]">
                    {order.id}
                  </span> */}
                  <span className="bg-[#e8f5e9] text-[#1b5e20] px-2 py-0.5 rounded-full font-label text-[10px] font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">check</span>
                    {t('history.delivered')}
                  </span>
                </div>
                <div className="font-headline font-bold text-[14px] text-[#1b5e20]">
                  +₹{order.total}
                </div>
              </div>

              {/* Middle Row: Customer Name, Address & Completed Timestamp */}
              <div className="flex items-start justify-between text-[14px]">
                <div>
                  <div className="font-headline font-bold text-[#1b1c1c]">
                    {order.customerName}
                  </div>
                  <div className="font-headline text-[12px] text-[#717a6d]">
                    {order.address}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-label text-[10px] text-[#717a6d]">
                    {order.completedAt || order.placedTime || t('history.justNow')}
                  </div>
                  {/* {order.paymentType === 'COD' && (
                    <div className="font-label text-[10px] font-bold text-[#ba1a1a]">
                      COD ₹{order.total} Collected
                    </div>
                  )} */}
                </div>
              </div>

              {/* Bottom Row: Produce Items & Rating */}
              <div className="flex items-center justify-between border-t border-[#e0e6e0]/60 pt-1.5 font-label text-[12px] text-[#717a6d]">
                <span>{order.itemsSummary}</span>
                  <span className='text-[#1b5e20]'>{t('history.onTime')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cash Reconciliation Modal */}
      {showReconciliationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1b6d24] text-2xl">
                  account_balance
                </span>
                <h3 className="font-bold text-gray-900 text-base">
                  {t('history.reconTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowReconciliationModal(false);
                  setReconciliationSubmitted(false);
                }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {reconciliationSubmitted ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#1b6d24] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h4 className="font-bold text-gray-900 text-base">
                  {t('history.tokenGenerated')}
                </h4>
                <p className="text-xs text-gray-600">
                  {t('history.tokenMsg', { amount: codCashInHand.toLocaleString() })}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReconciliationModal(false);
                    setReconciliationSubmitted(false);
                  }}
                  className="w-full mt-2 py-2 bg-[#1b5e20] hover:bg-[#144818] text-white rounded-lg text-xs font-bold"
                >
                  {t('common.done')}
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#f6f3f2] rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('history.mandiHub')}</span>
                    <span className="font-bold text-gray-800">{shiftStats?.hubName || 'Main Hub'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('history.riderName')}</span>
                    <span className="font-bold text-gray-800">
                      {shiftStats?.riderName || 'Delivery Partner'} ({shiftStats?.riderId || 'DLV-01'})
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-bold text-sm">
                    <span>{t('history.totalDeposit')}</span>
                    <span className="text-[#1b6d24] text-base">
                      ₹{codCashInHand.toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {t('history.verifyCash')}
                </p>

                <button
                  type="button"
                  onClick={() => setReconciliationSubmitted(true)}
                  className="w-full py-2 bg-[#1b5e20] hover:bg-[#144818] text-white font-bold rounded-lg text-xs shadow-sm active:scale-95"
                >
                  {t('history.generateToken')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
