import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DICTIONARIES, Language, LANGUAGES, TranslationKey } from './translations';
import LanguageSelector from './LanguageSelector';

const STORAGE_KEY = 'appLanguage';
type Vars = Record<string, string | number>;

const readStoredLanguage = (): Language => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v && LANGUAGES.some((l) => l.code === v)) return v as Language;
  } catch {
    // ignore
  }
  return 'en';
};

// Module-level copy so non-React code (react-query hooks, toasts) can translate too.
let currentLanguage: Language = readStoredLanguage();
const changeListeners = new Set<(lang: Language) => void>();

export const getLanguage = () => currentLanguage;

/** Subscribe to language changes outside React. Returns an unsubscribe function. */
export const onLanguageChange = (fn: (lang: Language) => void) => {
  changeListeners.add(fn);
  return () => {
    changeListeners.delete(fn);
  };
};

/** Translate outside React components. Falls back to English, then to `fallback`, then to the key. */
export const translate = (key: TranslationKey | string, vars?: Vars, fallback?: string): string => {
  const dict = DICTIONARIES[currentLanguage] as Record<string, string>;
  let text = dict[key] ?? (DICTIONARIES.en as Record<string, string>)[key] ?? fallback ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.split(`{${k}}`).join(String(v));
    }
  }
  return text;
};

type PickerMode = 'onboarding' | 'settings';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translate;
  /** Show the language picker. 'onboarding' = after login (no close button). */
  openLanguagePicker: (mode?: PickerMode) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(currentLanguage);
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);

  const setLanguage = useCallback((lang: Language) => {
    currentLanguage = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
    setLanguageState(lang);
    changeListeners.forEach((fn) => fn(lang));
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // `t` changes identity with the language so components re-render with new text.
  const t = useCallback<typeof translate>(
    (key, vars, fallback) => translate(key, vars, fallback),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      openLanguagePicker: (mode: PickerMode = 'settings') => setPickerMode(mode),
    }),
    [language, setLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
      {pickerMode && (
        <LanguageSelector
          mode={pickerMode}
          current={language}
          onSelect={setLanguage}
          onClose={() => setPickerMode(null)}
        />
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
};

/** Shortcut: const t = useT(); t('nav.active') */
export const useT = () => useLanguage().t;
