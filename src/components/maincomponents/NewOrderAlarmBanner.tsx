import React from 'react';
import { useT } from '@/i18n/LanguageContext';

interface NewOrderAlarmBannerProps {
  count: number;
  onView: () => void;
  onStop: () => void;
}

/** Red ringing banner shown at the top while a new-order alarm is active. */
export const NewOrderAlarmBanner: React.FC<NewOrderAlarmBannerProps> = ({ count, onView, onStop }) => {
  const t = useT();
  if (count === 0) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[55] flex justify-center p-3" role="alert" aria-live="assertive">
      <div className="w-full max-w-md rounded-2xl bg-[#ba1a1a] text-white shadow-2xl p-3.5 animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[30px] animate-bounce">notifications_active</span>
          <div className="flex-1 min-w-0">
            <div className="font-extrabold text-[15px] leading-tight">{t('alarm.newOrder')}</div>
            <div className="text-[12px] text-white/85">
              {count > 1 ? t('alarm.newOrders', { n: count }) : t('alarm.tapToView')}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            type="button"
            onClick={onStop}
            className="py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold active:scale-95 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">volume_off</span>
            {t('alarm.stop')}
          </button>
          <button
            type="button"
            onClick={onView}
            className="py-2.5 rounded-xl bg-white text-[#ba1a1a] text-xs font-extrabold active:scale-95 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            {t('alarm.view')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewOrderAlarmBanner;
