import React from 'react';

interface ShiftSummaryCardProps {
  ordersCount: number;
  totalCodAmount: number;
  isLive: boolean;
  onViewRoute?: () => void;
  className?: string;
}

export const ShiftSummaryCard: React.FC<ShiftSummaryCardProps> = ({
  ordersCount,
  totalCodAmount,
  isLive,
  onViewRoute,
  className = '',
}) => {
  return (
    <div className={`px-4 pt-2 pb-1 ${className}`}>
      <div 
        onClick={onViewRoute}
        className="bg-[#a0f399] rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-3 border border-[#88d982]/60 cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#1b6d24] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[22px]">route</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline font-bold text-[16px] text-[#217128] truncate tracking-tight">
              {ordersCount} {ordersCount === 1 ? 'Order' : 'Orders'} Assigned
            </span>
         
          </div>
        </div>

        <div className="bg-white text-[#1b6d24] px-2.5 py-1 rounded-full shrink-0 shadow-xs flex items-center gap-1 border border-[#88d982]/40">
          {isLive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#1b6d24] animate-ping" />
          )}
          <span className="font-label text-[10px] font-bold uppercase tracking-wide">
            {isLive ? 'Live Shift' : 'Paused'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummaryCard;
