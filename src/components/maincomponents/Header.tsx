import React, { useState } from 'react';
import { ActiveTab, ShiftStats } from '../../../types';
import { useAuthContext } from '@/context/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import ClickOutside from '@/components/ClickOutside';
import toast from 'react-hot-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import { LANGUAGES } from '@/i18n/translations';

interface HeaderProps {
  activeTab: ActiveTab;
  shiftStats: ShiftStats;
  onToggleDuty: () => void;
  onOpenSos: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  shiftStats,
  onToggleDuty,
  onOpenSos,
  onOpenProfile,
}) => {
  const [showDutyConfirm, setShowDutyConfirm] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuthContext();
  const { t, language, openLanguagePicker } = useLanguage();
  const currentLanguageLabel = LANGUAGES.find((l) => l.code === language)?.label;
  const getSubTitle = () => {
    switch (activeTab) {
      case 'active':
        return t('header.activeOrders');
      case 'task':
        return t('header.taskNav');
      case 'history':
        return t('header.history');
      default:
        return t('header.activeOrders');
    }
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-md border-b border-[#e5e2e1] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-md mx-auto h-14 px-3.5 flex items-center justify-between gap-2">
          {/* Rider Brand & Subtitle */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#1b6d24] text-[20px]">
                  sports_motorsports
                </span>
                <span className="font-bold text-[16px] text-[#1b1c1c] tracking-tight">
                  {user?.fullname}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-[#41493e] tracking-tight truncate">
                {getSubTitle()}
              </span>
            </div>
          </div>

          {/* Action Buttons: Duty Status, SOS Support, Profile */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* On Duty Status Pill */}
            <button
              type="button"
              onClick={() => setShowDutyConfirm(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all active:scale-95 text-[10px] font-bold tracking-wider uppercase ${shiftStats.isOnDuty
                  ? 'bg-[#a0f399] text-[#005312] hover:bg-[#8ee887]'
                  : 'bg-[#eae7e7] text-[#41493e]'
                }`}
              title="Click to toggle Shift Duty"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${shiftStats.isOnDuty ? 'bg-[#1b6d24] animate-pulse' : 'bg-gray-400'
                  }`}
              />
              <span>{shiftStats.isOnDuty ? t('header.onDuty') : t('header.offDuty')}</span>
            </button>

            {/* Emergency SOS Support Button */}
            <button
              type="button"
              onClick={onOpenSos}
              aria-label="Emergency Support Desk"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ffc9c3] transition-colors active:scale-95 shadow-2xs"
              title="Mandi Emergency SOS"
            >
              <span className="material-symbols-outlined text-[17px]">
                support_agent
              </span>
            </button>

            {/* Profile Avatar & Collapsible Logout Popup */}
            <ClickOutside
              onClick={() => setShowProfilePopup(false)}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setShowProfilePopup((prev) => !prev)}
                aria-label="Rider Profile"
                className="w-8 h-8 rounded-full bg-[#00450d] text-white flex items-center justify-center shadow-2xs active:scale-95 hover:bg-[#1b5e20] transition-colors"
                title="Profile & Options"
              >
                <span className="material-symbols-outlined text-[17px]">
                  person
                </span>
              </button>

              {/* Small Collapsible Popup */}
              {showProfilePopup && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#e5e2e1] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2.5 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-[#717a6d]">
                    {t('settings.title')}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfilePopup(false);
                      openLanguagePicker('settings');
                    }}
                    className="w-full flex items-center justify-between gap-1.5 px-2.5 py-2 text-xs font-bold text-[#1b1c1c] hover:bg-[#f1f8f1] rounded-lg transition-colors active:scale-95 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#1b6d24]">
                        translate
                      </span>
                      <span>{t('lang.menu')}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-[#1b6d24]">{currentLanguageLabel}</span>
                  </button>
                  <div className="my-1 border-t border-[#eeeae9]" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfilePopup(false);
                      logout();
                      toast.success(t('header.loggedOut'));
                      navigate({ to: '/' } as any);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/50 rounded-lg transition-colors active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      logout
                    </span>
                    <span>{t('header.logout')}</span>
                  </button>
                </div>
              )}
            </ClickOutside>
          </div>
        </div>
      </header>

      {/* Duty Status Confirmation Modal */}
      {showDutyConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-150">
            <div
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3 ${shiftStats.isOnDuty ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {shiftStats.isOnDuty ? 'power_settings_new' : 'electric_moped'}
              </span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              {shiftStats.isOnDuty ? t('header.goOffDutyQ') : t('header.goOnDutyQ')}
            </h3>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              {shiftStats.isOnDuty
                ? t('header.offDutyMsg')
                : t('header.onDutyMsg')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowDutyConfirm(false)}
                className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 active:scale-95"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={() => {
                  onToggleDuty();
                  setShowDutyConfirm(false);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 ${shiftStats.isOnDuty
                    ? 'bg-amber-600 hover:bg-amber-700'
                    : 'bg-[#1b5e20] hover:bg-[#144818]'
                  }`}
              >
                {shiftStats.isOnDuty ? t('header.confirmOffDuty') : t('header.goOnDuty')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
