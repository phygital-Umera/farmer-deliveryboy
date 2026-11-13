import React, {forwardRef} from 'react';
import {Calendar} from 'lucide-react';

interface DatePickerInputFieldProps {
  name: string;
  displayValue: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onToggleCalendar: (e?: React.MouseEvent) => void;
}

export const DatePickerInputField = forwardRef<
  HTMLInputElement,
  DatePickerInputFieldProps
>(
  (
    {
      name,
      displayValue,
      placeholder = 'Select date',
      label,
      required = false,
      className = '',
      error,
      onChange,
      onClick,
      onFocus,
      onBlur,
      onKeyDown,
      onToggleCalendar,
    },
    ref,
  ) => {
    return (
      <>
        {label && (
          <label className="mb-2 block text-sm font-medium text-text-charcoal dark:text-white">
            {label}
            {required && <span className="ml-1 text-red-600">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="text"
            name={name}
            value={displayValue}
            onChange={onChange}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1.5 pl-9 pr-8 text-sm text-text-charcoal outline-none transition focus:border-primary-navy active:border-primary-navy dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary-navy ${
              error ? 'border-red-500' : ''
            } ${className}`}
            maxLength={10}
          />
          <Calendar
            className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-primary-navy"
            onClick={(e) => onToggleCalendar(e)}
          />
          <button
            type="button"
            onClick={(e) => onToggleCalendar(e)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-slate-400 hover:text-primary-navy"
          >
            ▼
          </button>
        </div>
      </>
    );
  },
);

DatePickerInputField.displayName = 'DatePickerInputField';

export default DatePickerInputField;
