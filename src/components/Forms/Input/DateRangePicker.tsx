// components/Forms/Input/DateRangePicker.tsx
import React, {useState, useRef, useEffect} from 'react';
import {format, isBefore, addMonths, subMonths} from 'date-fns';
import {useController, useFormContext, Control} from 'react-hook-form';
import {
  DateRangeInputField,
  DateRangeCalendarPopup,
  parseRangeDate,
  formatDisplayRange,
  calculatePopupPosition,
} from './DateRangePicker/index';

export interface DateRangePickerProps {
  name: string;
  fromValue?: string;
  toValue?: string;
  onChange?: (range: {from: string; to: string}) => void;
  control?: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  fromLabel?: string;
  toLabel?: string;
}

const DateRangePickerBase: React.FC<DateRangePickerProps> = ({
  name,
  fromValue = '',
  toValue = '',
  onChange,
  label,
  placeholder = 'From - To',
  required = false,
  className = '',
  error,
  fromLabel = 'From',
  toLabel = 'To',
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<Date | null>(null);
  const [selectedTo, setSelectedTo] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [selectingFrom, setSelectingFrom] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Format display value when dates change
  useEffect(() => {
    const from = parseRangeDate(fromValue);
    const to = parseRangeDate(toValue);

    if (from && to) {
      setDisplayValue(formatDisplayRange(from, to));
      setSelectedFrom(from);
      setSelectedTo(to);
      setCurrentMonth(from);
    } else if (from) {
      setDisplayValue(formatDisplayRange(from, null));
      setSelectedFrom(from);
      setCurrentMonth(from);
    } else {
      setDisplayValue('');
      setSelectedFrom(null);
      setSelectedTo(null);
    }
  }, [fromValue, toValue]);

  // Update popup position when opened or resized/scrolled
  const updatePosition = () => {
    setPopupStyle(calculatePopupPosition(inputRef.current));
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
    if (selectingFrom) {
      setSelectedFrom(date);
      setSelectingFrom(false);
      if (selectedTo && isBefore(selectedTo, date)) {
        setSelectedTo(null);
      }
    } else {
      if (selectedFrom && isBefore(date, selectedFrom)) {
        setSelectedFrom(date);
        setSelectedTo(selectedFrom);
      } else {
        setSelectedTo(date);
        setSelectingFrom(true);
        if (selectedFrom && date) {
          const fromStr = format(selectedFrom, 'yyyy-MM-dd');
          const toStr = format(date, 'yyyy-MM-dd');
          setDisplayValue(formatDisplayRange(selectedFrom, date));
          if (onChange) {
            onChange({from: fromStr, to: toStr});
          }
          setTimeout(() => setIsOpen(false), 300);
        }
      }
    }
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSelectingFrom(!selectedFrom);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleQuickSelect = (from: Date, to: Date) => {
    setSelectedFrom(from);
    setSelectedTo(to);
    setSelectingFrom(true);
    const fromStr = format(from, 'yyyy-MM-dd');
    const toStr = format(to, 'yyyy-MM-dd');
    setDisplayValue(formatDisplayRange(from, to));
    if (onChange) {
      onChange({from: fromStr, to: toStr});
    }
    setTimeout(() => setIsOpen(false), 300);
  };

  const clearRange = () => {
    setSelectedFrom(null);
    setSelectedTo(null);
    setDisplayValue('');
    setSelectingFrom(true);
    if (onChange) {
      onChange({from: '', to: ''});
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <DateRangeInputField
        ref={inputRef}
        name={name}
        displayValue={displayValue}
        placeholder={placeholder}
        label={label}
        required={required}
        className={className}
        error={error}
        onInputClick={handleInputClick}
        onKeyDown={handleInputKeyDown}
        onToggleCalendar={toggleCalendar}
      />

      {isOpen && (
        <DateRangeCalendarPopup
          portalRef={portalRef}
          popupStyle={popupStyle}
          selectingFrom={selectingFrom}
          fromLabel={fromLabel}
          toLabel={toLabel}
          selectedFrom={selectedFrom}
          selectedTo={selectedTo}
          currentMonth={currentMonth}
          onPrevMonth={goToPreviousMonth}
          onNextMonth={goToNextMonth}
          onGoToToday={goToToday}
          onSelectDate={handleDateSelect}
          onQuickSelect={handleQuickSelect}
          onClear={clearRange}
        />
      )}
    </div>
  );
};

const DateRangePickerWithController: React.FC<DateRangePickerProps> = (
  props,
) => {
  const {field, fieldState} = useController({
    name: props.name,
    control: props.control,
  });

  const handleChange = (range: {from: string; to: string}) => {
    field.onChange(range);
    if (props.onChange) {
      props.onChange(range);
    }
  };

  return (
    <DateRangePickerBase
      {...props}
      fromValue={field.value?.from || props.fromValue || ''}
      toValue={field.value?.to || props.toValue || ''}
      onChange={handleChange}
      error={props.error || fieldState.error?.message}
    />
  );
};

const DateRangePicker: React.FC<DateRangePickerProps> = (props) => {
  const formContext = useFormContext();
  const effectiveControl = props.control || formContext?.control;

  if (
    effectiveControl &&
    props.name &&
    props.fromValue === undefined &&
    props.toValue === undefined
  ) {
    return (
      <DateRangePickerWithController {...props} control={effectiveControl} />
    );
  }

  return <DateRangePickerBase {...props} />;
};

export default DateRangePicker;
