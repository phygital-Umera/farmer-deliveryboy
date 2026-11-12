import React, { useState } from 'react';
import { useT } from '@/i18n/LanguageContext';

interface SosModalProps {
  onClose: () => void;
}

export const SosModal: React.FC<SosModalProps> = ({ onClose }) => {
  const t = useT();
  const [alertSent, setAlertSent] = useState(false);

  const handleSendAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-red-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">e911_emergency</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                {t('sos.title')}
              </h3>
              <span className="text-[11px] text-gray-500 font-medium">
                {t('sos.subtitle')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {alertSent ? (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl text-center space-y-2">
            <span className="material-symbols-outlined text-4xl text-[#ba1a1a] animate-pulse">
              notifications_active
            </span>
            <h4 className="font-bold text-red-900 text-sm">{t('sos.sentTitle')}</h4>
            <p className="text-xs text-red-700 leading-relaxed">
              {t('sos.sentMsg')}
            </p>
          </div>
        ) : (
          <>
            {/* Quick Alert Button */}
            <button
              type="button"
              onClick={handleSendAlert}
              className="w-full py-2.5 px-3 bg-[#ba1a1a] hover:bg-[#a01616] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>{t('sos.broadcast')}</span>
            </button>

            {/* Assistance Channels */}
            <div className="space-y-2 pt-1 text-xs">
              <a
                href="tel:18004196263"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-700 text-lg">
                    headset_mic
                  </span>
                  <div>
                    <div className="font-bold text-gray-900">{t('sos.hotline')}</div>
                    <div className="text-gray-500 text-[11px]">{t('sos.tollFree')}</div>
                  </div>
                </div>
                <span className="text-[#1b5e20] font-bold">{t('sos.callNow')}</span>
              </a>

              <a
                href="tel:+919811122334"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-blue-700 text-lg">
                    storefront
                  </span>
                  <div>
                    <div className="font-bold text-gray-900">{t('sos.hubManager')}</div>
                    <div className="text-gray-500 text-[11px]">{t('sos.hubAddress')}</div>
                  </div>
                </div>
                <span className="text-[#1b5e20] font-bold">{t('sos.callHub')}</span>
              </a>

              <a
                href="tel:112"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-red-700 text-lg">
                    local_police
                  </span>
                  <div>
                    <div className="font-bold text-gray-900">{t('sos.police')}</div>
                    <div className="text-gray-500 text-[11px]">{t('sos.national')}</div>
                  </div>
                </div>
                <span className="text-red-700 font-bold">{t('sos.dial')}</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
