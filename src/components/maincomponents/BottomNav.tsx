import React from 'react';
import { ActiveTab } from '../../../types';
import { useT } from '@/i18n/LanguageContext';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeOrdersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeOrdersCount = 0,
}) => {
  const t = useT();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#fcf9f8]/95 backdrop-blur-xl border-t border-[#e5e2e1] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] pb-safe">
      <div className="max-w-md mx-auto flex justify-around items-center h-14 px-2">
        {/* Active Orders Tab */}
        <button
          type="button"
          onClick={() => onTabChange('active')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-colors relative active:scale-95 ${activeTab === 'active'
            ? 'text-[#1b5e20] font-bold'
            : 'text-[#41493e] hover:text-[#1b1c1c]'
            }`}
          aria-label="Active Orders"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[21px]">
              two_wheeler
            </span>
            {activeOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#1b6d24] text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-2xs">
                {activeOrdersCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">{t('nav.active')}</span>
        </button>

        {/* History Tab */}
        <button
          type="button"
          onClick={() => onTabChange('history')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-0.5 transition-colors relative active:scale-95 ${activeTab === 'history'
            ? 'text-[#1b5e20] font-bold'
            : 'text-[#41493e] hover:text-[#1b1c1c]'
            }`}
          aria-label="Delivery History"
        >
          <span className="material-symbols-outlined text-[21px]">
            history
          </span>
          <span className="text-[11px] tracking-tight">{t('nav.history')}</span>
        </button>
      </div>
    </nav>
  );
};
