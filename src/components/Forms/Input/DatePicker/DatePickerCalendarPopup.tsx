import React from 'react';
import {createPortal} from 'react-dom';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {format, isSameDay, isSameMonth, isToday, isBefore} from 'date-fns';
import {generateCalendarDays} from './datePickerUtils';

interface DatePickerCalendarPopupProps {
  portalRef: React.RefObject<HTMLDivElement>;
  popupStyle: React.CSSProperties;
  selectedDate: Date | null;
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onGoToToday: () => void;
  onSelectDate: (date: Date) => void;
  onClear: () => void;
}

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const DatePickerCalendarPopup: React.FC<
  DatePickerCalendarPopupProps
> = ({
  portalRef,
  popupStyle,
  selectedDate,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onGoToToday,
  onSelectDate,
  onClear,
}) => {
  const calendarDays = generateCalendarDays(currentMonth);

  return createPortal(
    <div
      ref={portalRef}
      style={popupStyle}
      className="rounded-lg border border-stroke bg-white p-3 shadow-2xl dark:border-strokedark dark:bg-boxdark"
    >
      {/* Calendar Header */}
      <div className="mb-3 flex items-center justify-between border-b border-stroke pb-2 dark:border-strokedark">
        <div className="flex gap-2 text-xs">
          <span className="font-medium text-primary-navy">Select Date</span>
        </div>
        {selectedDate && (
          <span className="text-xs text-green-600">
            ✓ {format(selectedDate, 'dd/MM/yyyy')}
          </span>
        )}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            type="button"
            onClick={onGoToToday}
            className="rounded px-1.5 py-0.5 text-xs text-primary-navy hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Today
          </button>
        </div>
        <button
          type="button"
          onClick={onNextMonth}
          className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-slate-500">
        {DAY_NAMES.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="py-1.5" />;
          }

          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isDisabled = isBefore(day, new Date(2000, 0, 1));

          let bgColor = '';
          if (isSelected) {
            bgColor = 'bg-primary-navy text-white hover:bg-primary-navy/90';
          } else if (isTodayDate) {
            bgColor =
              'bg-orange-100 text-primary-navy hover:bg-orange-200 dark:bg-orange-900/30';
          } else if (isCurrentMonth) {
            bgColor = 'hover:bg-slate-100 dark:hover:bg-slate-700';
          } else {
            bgColor =
              'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700';
          }

          return (
            <button
              key={day.toString()}
              type="button"
              onClick={() => onSelectDate(day)}
              disabled={isDisabled}
              className={`rounded py-1.5 text-sm transition-colors ${bgColor} ${
                isDisabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
              }`}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-2 flex justify-between border-t border-stroke pt-2 dark:border-strokedark">
        <button
          type="button"
          onClick={() => {
            const today = new Date();
            onSelectDate(today);
          }}
          className="text-xs text-primary-navy hover:underline"
        >
          Today
        </button>
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-red-500 hover:underline"
        >
          Clear
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default DatePickerCalendarPopup;
