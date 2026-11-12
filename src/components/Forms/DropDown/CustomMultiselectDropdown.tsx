import React, {useState, useRef, useEffect} from 'react';
import {useController, useFormContext} from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface CustomMultiselectDropdownProps {
  name: string;
  label?: string;
  options: Option[];
  defaultOption?: string[];
  className?: string;
  placeholder?: string;
}

const CustomMultiselectDropdown: React.FC<CustomMultiselectDropdownProps> = ({
  name,
  label,
  options,
  defaultOption = [],
  className = '',
  placeholder = 'Select options...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {control} = useFormContext();

  const {field} = useController({
    name,
    control,
    defaultValue: defaultOption,
  });

  const selectedValues = field.value || [];

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Separate selected and unselected options
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
  );

  const unselectedOptions = filteredOptions.filter(
    (option) => !selectedValues.includes(option.value),
  );

  const toggleOption = (optionValue: string) => {
    const newValue = selectedValues.includes(optionValue)
      ? selectedValues.filter((val: string) => val !== optionValue)
      : [...selectedValues, optionValue];

    field.onChange(newValue);
  };

  const removeSelectedOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = selectedValues.filter(
      (val: string) => val !== optionValue,
    );
    field.onChange(newValue);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.onChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="text-text-charcoal dark:text-gray-300 mb-2 block text-sm font-medium">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <div
        className="border-gray-300 dark:border-text-charcoal dark:bg-text-charcoal hover:border-text-charcoal dark:hover:border-text-charcoal min-h-[42px] cursor-pointer rounded-lg border bg-pure-white p-2 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2">
          {selectedOptions.length === 0 ? (
            <span className="text-text-charcoal dark:text-text-charcoal py-1 text-sm">
              {placeholder}
            </span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-md border border-accent-teal/30 bg-accent-teal/10 px-2 py-1 text-sm text-primary-navy dark:border-primary-navy dark:bg-primary-navy dark:text-blue-200"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => removeSelectedOption(option.value, e)}
                  className="flex h-4 w-4 items-center justify-center text-xs font-bold hover:text-primary-navy focus:outline-none dark:hover:text-accent-teal"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
        {selectedOptions.length > 0 && (
          <div className="border-bg-light-mint dark:border-text-charcoal mt-2 flex items-center justify-between border-t pt-2">
            <span className="text-text-charcoal dark:text-text-charcoal text-xs">
              {selectedOptions.length} selected
            </span>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-red-500 hover:text-red-700 focus:outline-none dark:text-red-400 dark:hover:text-red-300"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="dark:bg-text-charcoal border-gray-300 dark:border-text-charcoal absolute z-50 mt-1 flex max-h-80 w-full flex-col overflow-hidden rounded-lg border bg-pure-white shadow-lg">
          {/* Search Input */}
          <div className="border-bg-light-mint dark:border-text-charcoal border-b p-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-gray-300 dark:border-text-charcoal dark:bg-text-charcoal text-text-charcoal placeholder-text-charcoal dark:placeholder-text-charcoal w-full rounded-md border bg-pure-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-teal dark:text-pure-white"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {/* Options Container */}
          <div className="flex-1 overflow-auto">
            {/* Selected Options - AT THE TOP */}
            {selectedOptions.length > 0 && (
              <div className="border-bg-light-mint dark:border-text-charcoal border-b">
                <div className="bg-bg-light-mint dark:bg-text-charcoal sticky top-0 px-3 py-2">
                  <span className="text-text-charcoal dark:text-gray-300 text-xs font-semibold uppercase tracking-wide">
                    Selected ({selectedOptions.length})
                  </span>
                </div>
                {selectedOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex cursor-pointer items-center border-b border-bg-light-mint px-4 py-3 last:border-b-0 hover:bg-bg-light-mint dark:border-blue-900/50 dark:hover:bg-blue-900"
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className="mr-3 flex h-5 w-5 items-center justify-center rounded border-2 border-accent-teal bg-accent-teal">
                      <svg
                        className="h-3 w-3 text-pure-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-text-charcoal flex-1 text-sm font-medium dark:text-pure-white">
                      {option.label}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedOption(option.value, e);
                      }}
                      className="text-text-charcoal p-1 hover:text-red-500 focus:outline-none dark:hover:text-red-400"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Available Options */}
            <div>
              {unselectedOptions.length > 0 && (
                <div className="bg-bg-light-mint dark:bg-text-charcoal border-bg-light-mint dark:border-text-charcoal sticky top-0 border-b px-3 py-2">
                  <span className="text-text-charcoal dark:text-gray-300 text-xs font-semibold uppercase tracking-wide">
                    Available ({unselectedOptions.length})
                  </span>
                </div>
              )}
              {unselectedOptions.length > 0 ? (
                unselectedOptions.map((option) => (
                  <div
                    key={option.value}
                    className="hover:bg-bg-light-mint dark:hover:bg-text-charcoal border-bg-light-mint dark:border-text-charcoal flex cursor-pointer items-center border-b px-4 py-3 last:border-b-0"
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className="border-gray-300 dark:border-text-charcoal mr-3 h-5 w-5 rounded border-2" />
                    <span className="text-text-charcoal dark:text-gray-300 flex-1 text-sm">
                      {option.label}
                    </span>
                  </div>
                ))
              ) : searchTerm ? (
                <div className="px-4 py-8 text-center">
                  <div className="text-text-charcoal dark:text-text-charcoal mb-2">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-text-charcoal dark:text-text-charcoal text-sm">
                    No results found for "
                    <span className="font-medium">{searchTerm}</span>"
                  </p>
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <div className="text-text-charcoal dark:text-text-charcoal mb-2">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <p className="text-text-charcoal dark:text-text-charcoal text-sm">
                    No options available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-bg-light-mint dark:border-text-charcoal bg-bg-light-mint dark:bg-text-charcoal border-t p-3">
            <div className="text-text-charcoal dark:text-text-charcoal flex items-center justify-between text-xs">
              <span>
                {selectedOptions.length} of {options.length} selected
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-medium text-primary-navy hover:text-primary-navy dark:text-accent-teal dark:hover:text-blue-300"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomMultiselectDropdown;

