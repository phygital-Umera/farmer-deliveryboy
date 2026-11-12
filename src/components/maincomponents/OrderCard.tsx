import React from 'react';
import { Order } from '../../../types';
import { useT } from '@/i18n/LanguageContext';

interface OrderCardProps {
  order: Order | any;
  onSelectOrder: (order: Order | any) => void;
  onNavigateOrder: (order: Order | any) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onSelectOrder,
  onNavigateOrder,
}) => {
  const t = useT();
  // Determine avatar icon and badge styling based on order status & payment
  const isPickup = order.status === 'pickup' || order.status === 'ready_for_pickup';
  const isOnTheWay = order.status === 'on_the_way' || order.status === 'ASSIGNED';
  const isScheduled = order.status === 'scheduled';

  const getStatusLabel = () => {
    switch (order.status) {
      case 'pickup':
      case 'ready_for_pickup':
        return t('card.pickup');
      case 'on_the_way':
      case 'ASSIGNED':
        return t('card.onTheWay');
      case 'scheduled':
        return t('card.scheduled');
      default:
        return order.status
          ? t(`status.${String(order.status).toUpperCase()}`, undefined, order.statusBadge || order.status)
          : order.statusBadge || t('card.active');
    }
  };

  const getStatusColor = () => {
    if (isPickup || isOnTheWay) return 'text-[#1b6d24]';
    return 'text-[#41493e]';
  };

  const orderIdDisplay = order.orderNumber || order.orderNo || order.id || '#ORD';
  const isCOD = (order.paymentType || order.paymentMethod) === 'COD';
  const codAmount = order.codAmount ?? order.totalCashToCollect ?? order.grandTotal ?? 0;
  const addressText = typeof order.address === 'string'
    ? order.address
    : [order.address?.flatAndBuilding, order.address?.sectorOrArea || order.address?.landmark]
        .filter(Boolean)
        .join(', ') || order.address?.fullAddress || 'Delivery Address';
  const distanceText = order.distance || order.distanceStr || '2.8 km';

  return (
    <div
      onClick={() => onSelectOrder(order)}
      className="bg-white rounded-md p-2 shadow-sm hover:shadow-md transition-all duration-200 border border-[#e0e6e0] flex flex-col    cursor-pointer active:scale-[0.99]"
    >
      {/* Top Header: ID, Status, Payment Tag */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`font-label text-[11px] font-bold uppercase tracking-wide ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>

        {isCOD ? (
          <span className="bg-[#ffdad6] text-[#93000a] px-2  rounded-full font-label text-[11px] font-bold flex items-center gap-1 shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[13px]">payments</span>
            {t('card.collect', { amount: codAmount })}
          </span>
        ) : (
          <span
            className={`px-2 py-0.5 rounded-full font-label text-[11px] font-semibold flex items-center gap-1 shrink-0 ${
              isScheduled
                ? 'bg-[#f0eded] text-[#41493e]'
                : 'bg-[#a0f399] text-[#217128]'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            {t('card.prepaid')}
          </span>
        )}
      </div>

      {/* Middle Row: Customer Avatar, Name, Distance, Address & Action Button */}
      <div className="flex items-center justify-between gap-2 ">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Avatar Icon */}
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${
              isPickup
                ? 'bg-[#acf4a4] text-[#002203]'
                : isOnTheWay
                ? 'bg-[#88d982] text-[#002204]'
                : 'bg-[#f0eded] text-[#41493e]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isPickup
                ? 'person_pin_circle'
                : isOnTheWay
                ? 'location_on'
                : 'schedule'}
            </span>
          </div>

          {/* Customer Details */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-headline font-bold text-[14px] text-[#1b1c1c] truncate">
                {order.customerName}
              </span>
             
            </div>
            <span className="font-headline text-[12px] text-[#41493e] truncate">
              {addressText}
            </span>
          </div>
        </div>

        {/* Action Button: View Details */}
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onNavigateOrder(order)}
            type="button"
            className="bg-[#1b6d24] text-white px-3 py-0.5 rounded-md flex items-center  font-label text-[12px] font-bold shadow-xs hover:bg-[#144818] active:scale-95 transition-all"
          >
            <span>{t('card.delivery')}</span>
            <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Bottom Summary Bar: Produce items preview */}
      <div className="flex items-center justify-between text-[#41493e] font-label text-[11px] border-t border-[#e0e6e0]/60  mt-0.5">
        <span className="flex items-center gap-0.5 font-medium">
          {isScheduled ? (
            <span className="material-symbols-outlined text-[14px] text-[#717a6d]">
              shopping_bag
            </span>
          ) : (
            <span className="material-symbols-outlined text-[14px] text-[#1b6d24]">
              eco
            </span>
          )}
          <span>{t('card.items', { n: order.itemsCount })}</span>
        </span>

        <span
          className={`truncate max-w-[210px] text-right ${
            isScheduled
              ? 'text-[#1b6d24] font-semibold'
              : 'text-[#41493e]/90'
          }`}
        >
          {isScheduled ? t('card.ready') : order.itemsSummary}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
