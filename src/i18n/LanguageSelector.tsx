import { useState } from 'react';
import { Language, LANGUAGES } from './translations';
import { translate } from './LanguageContext';

interface LanguageSelectorProps {
  mode: 'onboarding' | 'settings';
  current: Language;
  onSelect: (lang: Language) => void;
  onClose: () => void;
}

/**
 * Language picker shown right after login (onboarding) and from
 * Settings → Language. Choosing a language applies it immediately so the
 * rider can see the app text change; "Continue" closes the picker.
 */
const LanguageSelector = ({ mode, current, onSelect, onClose }: LanguageSelectorProps) => {
  const [selected, setSelected] = useState<Language>(current);
  const isOnboarding = mode === 'onboarding';

  const choose = (lang: Language) => {
    setSelected(lang);
    onSelect(lang);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-end justify-center sm:items-center ${
        isOnboarding ? 'bg-[#fcf9f8]' : 'bg-black/60 backdrop-blur-xs p-4'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-picker-title"
    >
      <div
        className={`w-full max-w-sm bg-white p-5 space-y-4 animate-in fade-in duration-150 ${
          isOnboarding
            ? 'h-full sm:h-auto flex flex-col justify-center sm:rounded-3xl sm:shadow-xl'
            : 'rounded-3xl shadow-2xl'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-full bg-[#e8f5e9] text-[#1b5e20] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </div>
            <div>
              <h3 id="language-picker-title" className="font-extrabold text-lg text-[#1b1c1c] leading-tight">
                {translate('lang.title')}
              </h3>
              <p className="text-xs text-[#525e54] mt-0.5">{translate('lang.subtitle')}</p>
            </div>
          </div>
          {!isOnboarding && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 shrink-0"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5" role="radiogroup">
          {LANGUAGES.map((lang) => {
            const active = selected === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => choose(lang.code)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all active:scale-[0.99] ${
                  active
                    ? 'border-[#1b5e20] bg-[#f1f8f1]'
                    : 'border-[#e0e6e0] bg-white hover:bg-[#fcf9f8]'
                }`}
              >
                <div>
                  <div className="text-[18px] font-bold text-[#1b1c1c] leading-tight">{lang.label}</div>
                  {lang.label !== lang.english && (
                    <div className="text-xs text-[#717a6d] mt-0.5">{lang.english}</div>
                  )}
                </div>
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    active ? 'border-[#1b5e20] bg-[#1b5e20] text-white' : 'border-[#cfd8d0]'
                  }`}
                >
                  {active && <span className="material-symbols-outlined text-[16px]">check</span>}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#00450d] hover:bg-[#1b5e20] text-white text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          {translate('lang.continue')}
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
