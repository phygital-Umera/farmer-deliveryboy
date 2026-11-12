// components/Forms/Input/DateRangePicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, parse, isValid, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameMonth, isSameDay, isToday, isAfter, isBefore, isEqual } from 'date-fns';
import { useController, useFormContext, Control } from 'react-hook-form';

interface DateRangePickerProps {
    name: string;
    fromValue?: string;
    toValue?: string;
    onChange?: (range: { from: string; to: string }) => void;
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
        if (fromValue && toValue) {
            try {
                let from: Date | null = null;
                let to: Date | null = null;

                if (typeof fromValue === 'string' && fromValue.includes('-')) {
                    const parsed = parse(fromValue.slice(0, 10), 'yyyy-MM-dd', new Date());
                    if (isValid(parsed)) from = parsed;
                }
                if (!from) {
                    const parsed = new Date(fromValue);
                    if (isValid(parsed) && !isNaN(parsed.getTime())) from = parsed;
                }

                if (typeof toValue === 'string' && toValue.includes('-')) {
                    const parsed = parse(toValue.slice(0, 10), 'yyyy-MM-dd', new Date());
                    if (isValid(parsed)) to = parsed;
                }
                if (!to) {
                    const parsed = new Date(toValue);
                    if (isValid(parsed) && !isNaN(parsed.getTime())) to = parsed;
                }

                if (from && to) {
                    setDisplayValue(`${format(from, 'dd/MM/yyyy')} - ${format(to, 'dd/MM/yyyy')}`);
                    setSelectedFrom(from);
                    setSelectedTo(to);
                    setCurrentMonth(from);
                } else {
                    setDisplayValue('');
                }
            } catch {
                setDisplayValue('');
            }
        } else if (fromValue) {
            try {
                let from: Date | null = null;
                if (typeof fromValue === 'string' && fromValue.includes('-')) {
                    const parsed = parse(fromValue.slice(0, 10), 'yyyy-MM-dd', new Date());
                    if (isValid(parsed)) from = parsed;
                }
                if (!from) {
                    const parsed = new Date(fromValue);
                    if (isValid(parsed) && !isNaN(parsed.getTime())) from = parsed;
                }
                if (from) {
                    setDisplayValue(`${format(from, 'dd/MM/yyyy')} - ...`);
                    setSelectedFrom(from);
                    setCurrentMonth(from);
                }
            } catch {
                setDisplayValue('');
            }
        } else {
            setDisplayValue('');
            setSelectedFrom(null);
            setSelectedTo(null);
        }
    }, [fromValue, toValue]);

    // Update popup position when opened or resized/scrolled
    const updatePosition = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            const popupHeight = 360;
            const popupWidth = 320;
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
        if (selectingFrom) {
            setSelectedFrom(date);
            setSelectingFrom(false);
            // If to date is before from date, clear it
            if (selectedTo && isBefore(selectedTo, date)) {
                setSelectedTo(null);
            }
        } else {
            // If selected date is before from date, swap
            if (selectedFrom && isBefore(date, selectedFrom)) {
                setSelectedFrom(date);
                setSelectedTo(selectedFrom);
            } else {
                setSelectedTo(date);
                setSelectingFrom(true);
                // Close the picker after both dates are selected
                if (selectedFrom && date) {
                    const fromStr = format(selectedFrom, 'yyyy-MM-dd');
                    const toStr = format(date, 'yyyy-MM-dd');
                    setDisplayValue(`${format(selectedFrom, 'dd/MM/yyyy')} - ${format(date, 'dd/MM/yyyy')}`);
                    if (onChange) {
                        onChange({ from: fromStr, to: toStr });
                    }
                    setTimeout(() => setIsOpen(false), 300);
                }
            }
        }
    };

    const handleInputClick = () => {
        setIsOpen(true);
        if (selectedFrom) {
            setSelectingFrom(false);
        } else {
            setSelectingFrom(true);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
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

    const isDateInRange = (date: Date) => {
        if (!selectedFrom || !selectedTo) return false;
        return (isAfter(date, selectedFrom) || isEqual(date, selectedFrom)) &&
            (isBefore(date, selectedTo) || isEqual(date, selectedTo));
    };

    const clearRange = () => {
        setSelectedFrom(null);
        setSelectedTo(null);
        setDisplayValue('');
        setSelectingFrom(true);
        if (onChange) {
            onChange({ from: '', to: '' });
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
                    onClick={handleInputClick}
                    onKeyDown={handleInputKeyDown}
                    readOnly
                    placeholder={placeholder}
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent px-3 py-1.5 pl-9 pr-8 text-sm text-text-charcoal outline-none transition focus:border-primary-navy active:border-primary-navy dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary-navy ${error ? 'border-red-500' : ''
                        } ${className}`}
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
                        {/* Selection Mode Indicator */}
                        <div className="mb-3 flex items-center justify-between border-b border-stroke pb-2 dark:border-strokedark">
                            <div className="flex gap-2 text-xs">
                                <span className={`font-medium ${selectingFrom ? 'text-primary-navy' : 'text-slate-400'}`}>
                                    {fromLabel}
                                </span>
                                <span className="text-slate-400">→</span>
                                <span className={`font-medium ${!selectingFrom ? 'text-primary-navy' : 'text-slate-400'}`}>
                                    {toLabel}
                                </span>
                            </div>
                            <div className="flex gap-2 text-xs">
                                {selectedFrom && (
                                    <span className="text-green-600">✓ From: {format(selectedFrom, 'dd/MM')}</span>
                                )}
                                {selectedTo && (
                                    <span className="text-blue-600">✓ To: {format(selectedTo, 'dd/MM')}</span>
                                )}
                            </div>
                        </div>

                        {/* Calendar Header */}
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
                                    onClick={goToToday}
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

                                const isSelected = selectedFrom && isSameDay(day, selectedFrom) ||
                                    selectedTo && isSameDay(day, selectedTo);
                                const isInRange = isDateInRange(day) && !isSelected;
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isTodayDate = isToday(day);
                                const isDisabled = isBefore(day, new Date(2000, 0, 1));

                                let bgColor = '';
                                if (isSelected) {
                                    bgColor = 'bg-primary-navy text-white hover:bg-primary-navy/90';
                                } else if (isInRange) {
                                    bgColor = 'bg-primary-navy/20 text-primary-navy hover:bg-primary-navy/30';
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
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const today = new Date();
                                        const weekAgo = new Date(today);
                                        weekAgo.setDate(today.getDate() - 7);
                                        setSelectedFrom(weekAgo);
                                        setSelectedTo(today);
                                        setSelectingFrom(true);
                                        const fromStr = format(weekAgo, 'yyyy-MM-dd');
                                        const toStr = format(today, 'yyyy-MM-dd');
                                        setDisplayValue(`${format(weekAgo, 'dd/MM/yyyy')} - ${format(today, 'dd/MM/yyyy')}`);
                                        if (onChange) {
                                            onChange({ from: fromStr, to: toStr });
                                        }
                                        setTimeout(() => setIsOpen(false), 300);
                                    }}
                                    className="text-xs text-primary-navy hover:underline"
                                >
                                    Last 7 days
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const today = new Date();
                                        const monthAgo = new Date(today);
                                        monthAgo.setDate(today.getDate() - 30);
                                        setSelectedFrom(monthAgo);
                                        setSelectedTo(today);
                                        setSelectingFrom(true);
                                        const fromStr = format(monthAgo, 'yyyy-MM-dd');
                                        const toStr = format(today, 'yyyy-MM-dd');
                                        setDisplayValue(`${format(monthAgo, 'dd/MM/yyyy')} - ${format(today, 'dd/MM/yyyy')}`);
                                        if (onChange) {
                                            onChange({ from: fromStr, to: toStr });
                                        }
                                        setTimeout(() => setIsOpen(false), 300);
                                    }}
                                    className="text-xs text-primary-navy hover:underline"
                                >
                                    Last 30 days
                                </button>
                            </div>
                            <button
                                type="button"
                                onClick={clearRange}
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

const DateRangePickerWithController: React.FC<DateRangePickerProps> = (props) => {
    const { field, fieldState } = useController({
        name: props.name,
        control: props.control,
    });

    const handleChange = (range: { from: string; to: string }) => {
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

    if (effectiveControl && props.name && props.fromValue === undefined && props.toValue === undefined) {
        return <DateRangePickerWithController {...props} control={effectiveControl} />;
    }

    return <DateRangePickerBase {...props} />;
};

export default DateRangePicker;