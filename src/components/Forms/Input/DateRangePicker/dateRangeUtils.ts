import {
  format,
  parse,
  isValid,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';

export const parseRangeDate = (value?: string): Date | null => {
  if (!value) return null;
  try {
    if (typeof value === 'string' && value.includes('-')) {
      const parsed = parse(value.slice(0, 10), 'yyyy-MM-dd', new Date());
      if (isValid(parsed)) return parsed;
    }
    const parsed = new Date(value);
    if (isValid(parsed) && !isNaN(parsed.getTime())) return parsed;
  } catch {
    return null;
  }
  return null;
};

export const formatDisplayRange = (
  from: Date | null,
  to: Date | null,
): string => {
  if (from && to) {
    return `${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}`;
  }
  if (from) {
    return `${format(from, 'dd/MM/yyyy')} - ...`;
  }
  return '';
};

export const calculatePopupPosition = (
  inputEl: HTMLInputElement | null,
): React.CSSProperties => {
  if (!inputEl) return {};

  const rect = inputEl.getBoundingClientRect();
  const popupHeight = 360;
  const popupWidth = 320;
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

export const isDateInRange = (
  date: Date,
  selectedFrom: Date | null,
  selectedTo: Date | null,
): boolean => {
  if (!selectedFrom || !selectedTo) return false;
  return (
    (isAfter(date, selectedFrom) || isEqual(date, selectedFrom)) &&
    (isBefore(date, selectedTo) || isEqual(date, selectedTo))
  );
};
