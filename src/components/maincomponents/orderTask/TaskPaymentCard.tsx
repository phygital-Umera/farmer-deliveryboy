import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface TaskPaymentCardProps {
  grandTotal: number;
  showQr: boolean;
  onDeliverUpi: () => void;
}

export const TaskPaymentCard: React.FC<TaskPaymentCardProps> = ({
  grandTotal,
  showQr,
  onDeliverUpi,
}) => {
  const t = useT();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#c8e6c9] bg-gradient-to-r from-[#e8f5e9] to-[#f1f8e9] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="shadow-2xs flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1b5e20]">
            <span className="material-symbols-outlined text-[19px]">
              payments
            </span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#1b5e20]">
              {t('task.cod')}
            </div>
            <div className="text-[11px] font-semibold text-[#525e54]">
              {t('task.collectFromCustomer')}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] font-bold uppercase text-[#525e54]">
            {t('task.grandTotal')}
          </div>
          <div className="text-[24px] font-black leading-none text-[#1b5e20]">
            ₹{grandTotal}
          </div>
        </div>
      </div>

      {showQr && (
        <div className="border-gray-200 animate-in fade-in flex flex-col items-center space-y-2 rounded-xl border bg-white p-3">
          <div className="bg-gray-50 flex h-36 w-36 items-center justify-center rounded-lg p-2">
            <svg
              className="text-gray-900 h-full w-full"
              fill="currentColor"
              viewBox="0 0 100 100"
            >
              <path d="M5 5h30v30H5V5zm6 6v18h18V11H11zm54-6h30v30H65V5zm6 6v18h18V11H71zM5 65h30v30H5V65zm6 6v18h18V71H11zm54 0h6v6h-6v-6zm12 0h6v6h-6v-6zm12 0h6v6h-6v-6zm-24 12h6v6h-6v-6zm12 0h12v6H77v-6zm-36-36h6v6h-6v-6zm12 0h6v6h-6v-6zm12 0h6v6h-6v-6zm-24 12h18v6H41v-6zm24 0h6v6h-6v-6zm-18 12h6v18h-6V65zm12 0h6v6h-6v-6zm6 6h6v6h-6v-6zm-6 6h18v6H59v-6z" />
              <rect fill="currentColor" height="10" width="10" x="15" y="15" />
              <rect fill="currentColor" height="10" width="10" x="75" y="15" />
              <rect fill="currentColor" height="10" width="10" x="15" y="75" />
            </svg>
          </div>
          <div className="text-center text-xs font-bold text-[#1b1c1c]">
            {t('task.upiScan', {amount: grandTotal})}
          </div>
          <button
            type="button"
            onClick={onDeliverUpi}
            className="shadow-xs w-full rounded-lg bg-[#1b5e20] py-2 text-xs font-bold text-white active:scale-95"
          >
            {t('task.paidUpi', {amount: grandTotal})}
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskPaymentCard;
