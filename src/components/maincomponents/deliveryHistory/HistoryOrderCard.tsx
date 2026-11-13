import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface HistoryOrderCardProps {
  order: any;
  onSelect: () => void;
}

export const HistoryOrderCard: React.FC<HistoryOrderCardProps> = ({
  order,
  onSelect,
}) => {
  const t = useT();

  return (
    <div
      onClick={onSelect}
      className="shadow-2xs cursor-pointer space-y-2.5 rounded-2xl border border-[#e8ece7] bg-white p-4 transition-all hover:border-[#1b5e20]/30 active:scale-[0.99]"
    >
      {/* Top Row: Order ID, Status Badge & Earnings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-headline text-[14px] font-bold text-[#1b1c1c]">
            {order.orderNumber || order.id}
          </span>
          <span className="font-label flex items-center gap-0.5 rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10px] font-bold text-[#1b5e20]">
            <span className="material-symbols-outlined text-[12px]">check</span>
            {t('history.delivered')}
          </span>
        </div>
        <div className="font-headline text-[14px] font-bold text-[#1b5e20]">
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
        <div className="shrink-0 text-right">
          <div className="font-label text-[10px] text-[#717a6d]">
            {order.completedAt || order.placedTime || t('history.justNow')}
          </div>
        </div>
      </div>

      {/* Bottom Row: Produce Items & Rating */}
      <div className="font-label flex items-center justify-between border-t border-[#e0e6e0]/60 pt-1.5 text-[12px] text-[#717a6d]">
        <span>{order.itemsSummary}</span>
        <span className="text-[#1b5e20]">{t('history.onTime')}</span>
      </div>
    </div>
  );
};

export default HistoryOrderCard;
