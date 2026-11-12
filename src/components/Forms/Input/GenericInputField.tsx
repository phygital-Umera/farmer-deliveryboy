import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface InputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  validation?: RegisterOptions;
  disabled?: boolean;
  defaultValue?: string;
  required?: boolean;
  maxLength?: number;
  helperText?: string;
  error?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  value?: string | number;
}

const GenericInputField: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  validation,
  disabled = false,
  defaultValue,
  required = false,
  maxLength,
  helperText,
  error,
  onBlur,
  readOnly = false,
  value,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  const {
    onChange,
    onBlur: rhfOnBlur,
    ref,
    ...registerProps
  } = register(name, validation);

  // Check if field is read-only or disabled
  const isReadOnly = readOnly || disabled;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        disabled={isReadOnly}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        readOnly={readOnly}
        className={`w-full rounded border-[1.5px] border-stroke text-sm text-black outline-none transition dark:border-form-strokedark dark:text-white ${isReadOnly
            ? 'border-0 bg-transparent font-medium text-slate-700 dark:text-slate-300 cursor-default px-3 py-1.5'
            : 'bg-transparent px-3 py-1.5 focus:border-primary active:border-primary dark:bg-form-input dark:focus:border-primary hover:border-stroke'
          }`}
        {...registerProps}
        onChange={(e) => {
          onChange(e);

          if (type === 'number') {
            setValue(name, Number(e.target.value), {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
        }}
        onBlur={(e) => {
          rhfOnBlur(e);
          onBlur?.(e);
        }}
      />

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}

      {!error && errors[name] && (
        <p className="mt-1 text-sm text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default GenericInputField;