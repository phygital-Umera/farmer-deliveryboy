// components/Forms/Input/DatePicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isValid, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isSameDay, isToday, isBefore } from 'date-fns';
import { useController, useFormContext, Control } from 'react-hook-form';

interface DatePickerProps {
  name?: string;
  value?: string;
  onDateChange?: (date: string) => void;
  control?: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
}

const DatePickerBase: React.FC<DatePickerProps> = ({
  name = 'date',
  value = '',
  onDateChange,
  label,
  placeholder = 'Select date',
  required = false,
  className = '',
  error,
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Format value on mount and when value changes
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        if (isValid(date) && !isNaN(date.getTime())) {
          setDisplayValue(format(date, 'dd/MM/yyyy'));
          setSelectedDate(date);
          setCurrentMonth(date);
        } else {
          setDisplayValue('');
        }
      } catch {
        setDisplayValue('');
      }
    } else {
      setDisplayValue('');
      setSelectedDate(null);
    }
  }, [value]);

  // Update popup position when opened or resized/scrolled
  const updatePosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const popupHeight = 310;
      const popupWidth = 280;
      const spaceBelow = window.innerHeight - rect.bottom;
      const showAbove = spaceBelow < popupHeight && rect.top > popupHeight;

      let left = rect.left;
      if (left + popupWidth > window.innerWidth - 10) {
        left = window.innerWidth - popupWidth - 10;
      }
      if (left < 10) left = 10;

      setPopupStyle({
        position: 'fixed',
        top: showAbove ? `${rect.top - popupHeight - 4}px` : `${rect.bottom + 4}px`,
        left: `${left}px`,
        width: `${popupWidth}px`,
        zIndex: 99999,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isInsideWrapper = wrapperRef.current?.contains(event.target as Node);
      const isInsidePortal = portalRef.current?.contains(event.target as Node);

      if (!isInsideWrapper && !isInsidePortal) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setDisplayValue(format(date, 'dd/MM/yyyy'));
    setCurrentMonth(date);
    if (onDateChange) {
      onDateChange(format(date, 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');

    if (raw.length > 0) {
      if (raw.length > 8) raw = raw.slice(0, 8);

      let formatted = '';
      for (let i = 0; i < raw.length; i++) {
        if (i === 2 || i === 4) {
          formatted += '/';
        }
        formatted += raw[i];
      }
      setDisplayValue(formatted);
    } else {
      setDisplayValue('');
    }
  };

  const handleInputBlur = () => {
    // Validate and format on blur
    if (displayValue) {
      const parts = displayValue.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
          const date = new Date(year, month - 1, day);
          if (isValid(date) && !isNaN(date.getTime())) {
            const formatted = format(date, 'dd/MM/yyyy');
            setDisplayValue(formatted);
            setSelectedDate(date);
            if (onDateChange) {
              onDateChange(format(date, 'yyyy-MM-dd'));
            }
            return;
          }
        }
      }
      // Invalid date - clear
      setDisplayValue('');
      setSelectedDate(null);
      if (onDateChange) {
        onDateChange('');
      }
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const raw = displayValue.replace(/\//g, '');
      if (raw.length > 0) {
        const newRaw = raw.slice(0, -1);
        let formatted = '';
        for (let i = 0; i < newRaw.length; i++) {
          if (i === 2 || i === 4) {
            formatted += '/';
          }
          formatted += newRaw[i];
        }
        setDisplayValue(formatted);
      }
      e.preventDefault();
    }
    if (e.key === 'Enter') {
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const toggleCalendar = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsOpen((prev) => !prev);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    const firstDayOfMonth = getDay(start);
    const emptyDays = Array(firstDayOfMonth).fill(null);

    return [...emptyDays, ...days];
  };

  const calendarDays = generateCalendarDays();

  const clearDate = () => {
    setSelectedDate(null);
    setDisplayValue('');
    if (onDateChange) {
      onDateChange('');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-text-charcoal dark:text-white">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={displayValue}
          onChange={handleInputChange}
          onClick={handleInputClick}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1.5 pl-9 pr-8 text-sm text-text-charcoal outline-none transition focus:border-primary-navy active:border-primary-navy dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary-navy ${error ? 'border-red-500' : ''
            } ${className}`}
          maxLength={10}
        />
        <Calendar
          className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-primary-navy"
          onClick={(e) => toggleCalendar(e)}
        />
        <button
          type="button"
          onClick={(e) => toggleCalendar(e)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-slate-400 hover:text-primary-navy"
        >
          ▼
        </button>
      </div>

      {/* Calendar Popup Portalled to Body */}
      {isOpen &&
        createPortal(
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
                <span className="text-xs text-green-600">✓ {format(selectedDate, 'dd/MM/yyyy')}</span>
              )}
            </div>

            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPreviousMonth}
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
                  onClick={() => {
                    const today = new Date();
                    setCurrentMonth(today);
                  }}
                  className="rounded px-1.5 py-0.5 text-xs text-primary-navy hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Today
                </button>
              </div>
              <button
                type="button"
                onClick={goToNextMonth}
                className="rounded p-1 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-slate-500">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
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
                  bgColor = 'bg-orange-100 text-primary-navy hover:bg-orange-200 dark:bg-orange-900/30';
                } else if (isCurrentMonth) {
                  bgColor = 'hover:bg-slate-100 dark:hover:bg-slate-700';
                } else {
                  bgColor = 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700';
                }

                return (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    disabled={isDisabled}
                    className={`rounded py-1.5 text-sm transition-colors ${bgColor} ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
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
                  handleDateSelect(today);
                }}
                className="text-xs text-primary-navy hover:underline"
              >
                Today
              </button>
              <button
                type="button"
                onClick={clearDate}
                className="text-xs text-red-500 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// Controller version for use with react-hook-form
const DatePickerWithController: React.FC<DatePickerProps> = (props) => {
  const { field, fieldState } = useController({
    name: props.name || 'date',
    control: props.control,
  });

  const handleChange = (date: string) => {
    field.onChange(date);
    if (props.onDateChange) {
      props.onDateChange(date);
    }
  };

  return (
    <DatePickerBase
      {...props}
      value={field.value || props.value || ''}
      onDateChange={handleChange}
      error={props.error || fieldState.error?.message}
    />
  );
};

// Main component with form context support
const DatePicker: React.FC<DatePickerProps> = (props) => {
  const formContext = useFormContext();
  const effectiveControl = props.control || formContext?.control;

  if (effectiveControl && props.name && props.value === undefined) {
    return <DatePickerWithController {...props} control={effectiveControl} />;
  }

  return <DatePickerBase {...props} />;
};

export default DatePicker;