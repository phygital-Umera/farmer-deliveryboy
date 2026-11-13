import {
  format,
  isValid,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from 'date-fns';

export const parseDateString = (value?: string): Date | null => {
  if (!value) return null;
  try {
    const date = new Date(value);
    if (isValid(date) && !isNaN(date.getTime())) {
      return date;
    }
  } catch {
    return null;
  }
  return null;
};

export const formatDisplayDate = (date: Date | null): string => {
  if (!date || !isValid(date)) return '';
  return format(date, 'dd/MM/yyyy');
};

export const calculateDatePickerPosition = (
  inputEl: HTMLInputElement | null,
): React.CSSProperties => {
  if (!inputEl) return {};

  const rect = inputEl.getBoundingClientRect();
  const popupHeight = 310;
  const popupWidth = 280;
  const spaceBelow = window.innerHeight - rect.bottom;
  const showAbove = spaceBelow < popupHeight && rect.top > popupHeight;

  let left = rect.left;
  if (left + popupWidth > window.innerWidth - 10) {
    left = window.innerWidth - popupWidth - 10;
  }
  if (left < 10) left = 10;

  return {
    position: 'fixed',
    top: showAbove ? `${rect.top - popupHeight - 4}px` : `${rect.bottom + 4}px`,
    left: `${left}px`,
    width: `${popupWidth}px`,
    zIndex: 99999,
  };
};

export const generateCalendarDays = (currentMonth: Date): (Date | null)[] => {
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({start, end});

  const firstDayOfMonth = getDay(start);
  const emptyDays = Array(firstDayOfMonth).fill(null);

  return [...emptyDays, ...days];
};

export const formatDateMask = (rawDigits: string): string => {
  const clean = rawDigits.slice(0, 8);
  let formatted = '';
  for (let i = 0; i < clean.length; i++) {
    if (i === 2 || i === 4) {
      formatted += '/';
    }
    formatted += clean[i];
  }
  return formatted;
};
