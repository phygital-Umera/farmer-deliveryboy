// components/Forms/Input/DatePicker.tsx
import React, {useState, useRef, useEffect} from 'react';
import {format, isValid, addMonths, subMonths} from 'date-fns';
import {useController, useFormContext, Control} from 'react-hook-form';
import {
  DatePickerInputField,
  DatePickerCalendarPopup,
  parseDateString,
  formatDisplayDate,
  calculateDatePickerPosition,
  formatDateMask,
} from './DatePicker/index';

export interface DatePickerProps {
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
    const parsed = parseDateString(value);
    if (parsed) {
      setDisplayValue(formatDisplayDate(parsed));
      setSelectedDate(parsed);
      setCurrentMonth(parsed);
    } else {
      setDisplayValue('');
      setSelectedDate(null);
    }
  }, [value]);

  // Update popup position when opened or resized/scrolled
  const updatePosition = () => {
    setPopupStyle(calculateDatePickerPosition(inputRef.current));
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
      const isInsideWrapper = wrapperRef.current?.contains(
        event.target as Node,
      );
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
    setDisplayValue(formatDisplayDate(date));
    setCurrentMonth(date);
    if (onDateChange) {
      onDateChange(format(date, 'yyyy-MM-dd'));
    }
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length > 0) {
      setDisplayValue(formatDateMask(raw));
    } else {
      setDisplayValue('');
    }
  };

  const handleInputBlur = () => {
    if (displayValue) {
      const parts = displayValue.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          const date = new Date(year, month - 1, day);
          if (isValid(date) && !isNaN(date.getTime())) {
            setDisplayValue(formatDisplayDate(date));
            setSelectedDate(date);
            if (onDateChange) {
              onDateChange(format(date, 'yyyy-MM-dd'));
            }
            return;
          }
        }
      }
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
        setDisplayValue(formatDateMask(raw.slice(0, -1)));
      }
      e.preventDefault();
    }
    if (e.key === 'Enter') setIsOpen(true);
    if (e.key === 'Escape') setIsOpen(false);
  };

  const toggleCalendar = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

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
      <DatePickerInputField
        ref={inputRef}
        name={name}
        displayValue={displayValue}
        placeholder={placeholder}
        label={label}
        required={required}
        className={className}
        error={error}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        onToggleCalendar={toggleCalendar}
      />

      {isOpen && (
        <DatePickerCalendarPopup
          portalRef={portalRef}
          popupStyle={popupStyle}
          selectedDate={selectedDate}
          currentMonth={currentMonth}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onGoToToday={goToToday}
          onSelectDate={handleDateSelect}
          onClear={clearDate}
        />
      )}
    </div>
  );
};

// Controller version for use with react-hook-form
const DatePickerWithController: React.FC<DatePickerProps> = (props) => {
  const {field, fieldState} = useController({
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
