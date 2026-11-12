// utils/dateTimeUtils.ts

/**
 * Format date to DD/MM/YYYY
 */
export const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Format date to MM/DD/YYYY (US format)
 */
export const formatDateUS = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
};

/**
 * Format date to DD MMM YYYY (e.g., 25 Dec 2024)
 */
export const formatDateShort = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Format time to 12-hour format with AM/PM
 */
export const formatTime = (timeValue: string | null | undefined): string => {
  if (!timeValue) return '-';

  // If it's already in format like "11:00 AM" or "11:00 PM"
  if (timeValue.includes('AM') || timeValue.includes('PM')) {
    return timeValue;
  }

  // If it's a time string like "11:00:00" or "11:00"
  if (timeValue.match(/^\d{1,2}:\d{2}/)) {
    const parts = timeValue.split(':');
    let hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // Try to parse as ISO date string
  try {
    const date = new Date(timeValue);
    if (!Number.isNaN(date.getTime())) {
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    }
  } catch (e) {
    console.error('Error parsing time:', timeValue);
  }

  return timeValue; // Return as is if can't parse
};

/**
 * Format time to 24-hour format
 */
export const formatTime24 = (timeValue: string | null | undefined): string => {
  if (!timeValue) return '-';

  if (timeValue.match(/^\d{1,2}:\d{2}/)) {
    const parts = timeValue.split(':');
    let hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  try {
    const date = new Date(timeValue);
    if (!Number.isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  } catch (e) {
    console.error('Error parsing time:', timeValue);
  }

  return timeValue;
};

/**
 * Format date range
 */
export const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  separator: string = ' - '
): string => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  if (start === '-' && end === '-') return '-';
  if (start === '-') return end;
  if (end === '-') return start;
  
  return `${start}${separator}${end}`;
};

/**
 * Format time range
 */
export const formatTimeRange = (
  startTime: string | null | undefined,
  endTime: string | null | undefined,
  separator: string = ' - '
): string => {
  const start = formatTime(startTime);
  const end = formatTime(endTime);
  
  if (start === '-' && end === '-') return '-';
  if (start === '-') return end;
  if (end === '-') return start;
  
  return `${start}${separator}${end}`;
};

/**
 * Format date and time together
 */
export const formatDateTime = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const formattedDate = formatDate(isoString);
  const formattedTime = formatTime(isoString);
  
  return `${formattedDate} ${formattedTime}`;
};

/**
 * Get day names from teaching days object
 */
export const getTeachingDaysLabel = (
  teachingDays: Record<string, boolean> | string | null | undefined
): string => {
  if (!teachingDays || typeof teachingDays !== 'object') {
    return String(teachingDays || '-');
  }

  const validDays = new Set([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  const dayMap: Record<string, string> = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
  };

  const selectedDays = Object.entries(teachingDays)
    .filter(([key, value]) => validDays.has(key.toLowerCase()) && value)
    .map(([key]) => dayMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1));

  return selectedDays.length > 0 ? selectedDays.join(', ') : '-';
};

/**
 * Get full day names from teaching days object
 */
export const getTeachingDaysFullLabel = (
  teachingDays: Record<string, boolean> | string | null | undefined
): string => {
  if (!teachingDays || typeof teachingDays !== 'object') {
    return String(teachingDays || '-');
  }

  const validDays = new Set([
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

  const dayMap: Record<string, string> = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
  };

  const selectedDays = Object.entries(teachingDays)
    .filter(([key, value]) => validDays.has(key.toLowerCase()) && value)
    .map(([key]) => dayMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1));

  return selectedDays.length > 0 ? selectedDays.join(', ') : '-';
};

/**
 * Check if a date is today
 */
export const isToday = (isoString: string | null | undefined): boolean => {
  if (!isoString) return false;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return false;
  
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is in the past
 */
export const isPastDate = (isoString: string | null | undefined): boolean => {
  if (!isoString) return false;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if a date is in the future
 */
export const isFutureDate = (isoString: string | null | undefined): boolean => {
  if (!isoString) return false;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 days")
 */
export const getRelativeTime = (isoString: string | null | undefined): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};