import React from 'react';
import {useT} from '@/i18n/LanguageContext';
import {ShiftStats} from '../../../types';

interface CashReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reconciliationSubmitted: boolean;
  onSubmit: () => void;
  shiftStats?: ShiftStats;
  codCashInHand: number;
}

export const CashReconciliationModal: React.FC<
  CashReconciliationModalProps
> = ({
  isOpen,
  onClose,
  reconciliationSubmitted,
  onSubmit,
  shiftStats,
  codCashInHand,
}) => {
  const t = useT();

  if (!isOpen) return null;

  return (
    <div className="backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#1b6d24]">
              account_balance
            </span>
            <h3 className="text-gray-900 text-base font-bold">
              {t('history.reconTitle')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-100 text-gray-500 hover:bg-gray-200 flex h-8 w-8 items-center justify-center rounded-full"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {reconciliationSubmitted ? (
          <div className="space-y-2 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-[#1b6d24]">
              <span className="material-symbols-outlined text-3xl">
                verified
              </span>
            </div>
            <h4 className="text-gray-900 text-base font-bold">
              {t('history.tokenGenerated')}
            </h4>
            <p className="text-gray-600 text-xs">
              {t('history.tokenMsg', {amount: codCashInHand.toLocaleString()})}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-lg bg-[#1b5e20] py-2 text-xs font-bold text-white hover:bg-[#144818]"
            >
              {t('common.done')}
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-2 rounded-xl bg-[#f6f3f2] p-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">{t('history.mandiHub')}</span>
                <span className="text-gray-800 font-bold">
                  {shiftStats?.hubName || 'Main Hub'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t('history.riderName')}</span>
                <span className="text-gray-800 font-bold">
                  {shiftStats?.riderName || 'Delivery Partner'} (
                  {shiftStats?.riderId || 'DLV-01'})
                </span>
              </div>
              <div className="border-gray-200 flex justify-between border-t pt-2 text-sm font-bold">
                <span>{t('history.totalDeposit')}</span>
                <span className="text-base text-[#1b6d24]">
                  ₹{codCashInHand.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-[11px] leading-relaxed">
              {t('history.verifyCash')}
            </p>

            <button
              type="button"
              onClick={onSubmit}
              className="w-full rounded-lg bg-[#1b5e20] py-2 text-xs font-bold text-white shadow-sm hover:bg-[#144818] active:scale-95"
            >
              {t('history.generateToken')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CashReconciliationModal;
