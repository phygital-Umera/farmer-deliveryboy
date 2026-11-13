import React from 'react';
import {useT} from '@/i18n/LanguageContext';

interface TaskCustomerCardProps {
  customerName: string;
  customerPhone?: string;
  streetAddress: string;
  landmark?: string;
  pincode?: string;
  copiedPhone: boolean;
  onCopyPhone: () => void;
}

export const TaskCustomerCard: React.FC<TaskCustomerCardProps> = ({
  customerName,
  customerPhone,
  streetAddress,
  landmark,
  pincode,
  copiedPhone,
  onCopyPhone,
}) => {
  const t = useT();

  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-[#e8ece7] bg-white p-2 shadow-sm">
      {/* Top Row: Customer Name on Left, Phone Number on Right */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-headline truncate text-[17px] font-bold tracking-tight text-[#1b1c1c]">
          {customerName}
        </h3>

        {customerPhone && (
          <button
            type="button"
            onClick={onCopyPhone}
            className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#41493e] transition-colors hover:text-[#1b6d24] active:scale-95"
            title="Click to copy phone number"
          >
            <span>{customerPhone}</span>
            <span className="material-symbols-outlined text-[14px] text-[#717a6d]">
              {copiedPhone ? 'check' : 'content_copy'}
            </span>
            {copiedPhone && (
              <span className="ml-0.5 text-[10px] font-bold text-green-700">
                {t('task.copied')}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Address Line */}
      <div className="text-[14px] leading-snug text-[#525e54]">
        {streetAddress}
        {pincode && <span className="text-[#717a6d]">, PIN: {pincode}</span>}
      </div>

      {/* Landmark with Green Flag Icon */}
      {landmark && (
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#1b6d24]">
          <span className="material-symbols-outlined shrink-0 text-[17px] text-[#1b6d24]">
            flag
          </span>
          <span>{landmark}</span>
        </div>
      )}

      {/* Divider */}
      <div className="my-0.5 border-t border-[#e0e6e0]/70" />

      {/* Action Buttons: Call Customer & Quick SMS */}
      {customerPhone && (
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <a
            href={`tel:${customerPhone}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#e8f5e9] px-3 py-2.5 text-[13px] font-bold text-[#1b5e20] transition-all hover:bg-[#d8eed9] active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>{t('task.callCustomer')}</span>
          </a>

          <a
            href={`sms:${customerPhone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#f2f4f2] px-3 py-2.5 text-[13px] font-bold text-[#1b1c1c] transition-all hover:bg-[#e4e7e4] active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">sms</span>
            <span>{t('task.sms')}</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default TaskCustomerCard;
