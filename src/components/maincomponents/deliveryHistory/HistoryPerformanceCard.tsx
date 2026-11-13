import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface HistoryPerformanceCardProps {
  filter: 'all' | 'today' | 'yesterday';
  displayedEarnings: number;
  deliveriesCount: number;
  codCashInHand: number;
  onOpenReconciliation: () => void;
}

export const HistoryPerformanceCard: React.FC<HistoryPerformanceCardProps> = ({
  filter,
  displayedEarnings,
  deliveriesCount,
  codCashInHand,
  onOpenReconciliation,
}) => {
  const t = useT();

  return (
    <div className="shadow-xs flex flex-col gap-3 rounded-2xl border border-[#e8ece7] bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[20px] text-[#1b6d24]">
            trending_up
          </span>
          <h2 className="text-[17px] font-extrabold tracking-tight text-[#1b1c1c]">
            {t('history.performance')}
          </h2>
        </div>
        <div className="text-right">
          <span className="mr-1 text-[12px] text-[#525e54]">
            {filter === 'yesterday'
              ? t('history.yesterdayEarnings')
              : t('history.todayEarnings')}
          </span>
          <span className="text-[22px] font-black text-[#1b6d24]">
            ₹{displayedEarnings}
          </span>
        </div>
      </div>

      {/* Performance 2-Column Stat Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Deliveries Count */}
        <div className="flex min-w-0 items-center justify-between rounded-xl border border-[#ebe7e6] bg-[#f6f3f2] px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="material-symbols-outlined shrink-0 text-[19px] text-[#1b6d24]">
              local_shipping
            </span>
            <span className="truncate text-[11px] font-bold text-[#41493e]">
              {t('history.deliveries')}
            </span>
          </div>
          <div className="shrink-0 pl-1 text-right leading-none">
            <span className="text-[16px] font-black text-[#1b1c1c]">
              {deliveriesCount}
            </span>
            <span className="mt-0.5 block text-[10px] font-medium text-[#525e54]">
              {t('history.orders')}
            </span>
          </div>
        </div>

        {/* COD Cash in Hand */}
        <div className="flex min-w-0 items-center justify-between rounded-xl border border-[#ebe7e6] bg-[#f6f3f2] px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="material-symbols-outlined shrink-0 text-[19px] text-[#1b6d24]">
              payments
            </span>
            <span className="shrink-0 text-[11px] font-bold text-[#41493e]">
              {t('history.cod')}
            </span>
          </div>
          <div className="shrink-0 pl-1 text-right leading-none">
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
          onClick={onOpenReconciliation}
          className="active:scale-98 flex w-full items-center justify-between rounded-lg border border-[#a0f399] bg-[#a0f399]/40 px-2.5 py-1.5 text-[11px] font-bold text-[#005312] transition-colors hover:bg-[#a0f399]/70"
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="material-symbols-outlined shrink-0 text-[16px]">
              account_balance_wallet
            </span>
            <span className="truncate">{t('history.hubHandover')}</span>
          </div>
          <span className="shrink-0 text-[11px] underline">
            {t('history.reconcile', {amount: codCashInHand.toLocaleString()})}
          </span>
        </button>
      </div>
    </div>
  );
};

export default HistoryPerformanceCard;
