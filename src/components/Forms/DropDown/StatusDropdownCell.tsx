import { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import GenericDropdown from './GenericDropDown';

interface Option {
  label: string;
  value: string;
}

interface StatusDropdownCellProps {
  name?: string;
  value?: string;
  options: Option[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const schema = z.object({ field: z.string() });


/*
 * A self-contained dropdown cell for use inside tables.
 * Wraps GenericDropdown with its own useForm/control so it
 * works without any external FormProvider.
 */
const StatusDropdownCell = ({
  name = 'field',
  value = '',
  options,
  placeholder = 'Select',
  onChange,
}: StatusDropdownCellProps) => {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: { field: value },
  });

  const { control, watch } = methods;
  const lastSentValue = useRef(value);

  // Fire onChange when the value changes
  const watched = watch('field');
  
  useEffect(() => {
    if (watched !== lastSentValue.current && onChange) {
      lastSentValue.current = watched;
      onChange(watched);
    }
  }, [watched, onChange]);
  return (
    <FormProvider {...methods}>
      <GenericDropdown
        name="field"
        control={control}
        options={options}
        defaultOption={placeholder}
      />
    </FormProvider>
  );
};

export default StatusDropdownCell;
