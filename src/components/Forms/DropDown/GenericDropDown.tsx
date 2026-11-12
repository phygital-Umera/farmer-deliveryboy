import React, { useState } from 'react';
import { Controller, Control } from 'react-hook-form';
import { DownIcon } from '../../../icons';

interface Option {
  value: string;
  label: string;
}

interface GenericDropdownProps {
  name: string;
  label?: string;
  options: Option[];
  defaultOption?: string;
  control: Control<any>;
  disabled?: boolean;
  required?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

const GenericDropdown: React.FC<GenericDropdownProps> = ({
  name,
  label,
  options,
  defaultOption = '',
  control,
  disabled = false,
  required = false,
  placeholder = 'Select an option',
}) => {
  const [isOptionSelected, setIsOptionSelected] = useState<boolean>(!!defaultOption);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, name }, fieldState: { error } }) => (
        <div className="w-full">
          {label && (
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              {label}
              {required && <span className="ml-1 text-red-600">*</span>}
            </label>
          )}

          <div className="relative">
            <select
              name={name}
              value={value || ''}
              onChange={(e) => {
                setIsOptionSelected(true);
                onChange(e.target.value);
              }}
              onBlur={onBlur}
              disabled={disabled}
              className={`w-full appearance-none rounded border-[1.5px] border-stroke bg-transparent px-3 py-1.5 pr-8 text-sm text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary dark:disabled:bg-black ${error ? 'border-red-500' : ''
                }`}
            >
              <option value="" disabled>
                {placeholder || defaultOption || `Select ${label}`}
              </option>
              {options?.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-black dark:text-white"
                >
                  {option.label}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <DownIcon />
            </span>
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default GenericDropdown;