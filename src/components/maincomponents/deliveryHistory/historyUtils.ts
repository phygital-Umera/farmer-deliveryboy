export const formatCompletedTime = (dateStr?: string | null): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateStr;
  }
};

export const matchesFilter = (
  dateStr?: string | null,
  filter: 'all' | 'today' | 'yesterday' = 'all',
): boolean => {
  if (filter === 'all') return true;
  if (!dateStr) return filter === 'today';
  if (
    filter === 'today' &&
    (dateStr.includes('Today') || dateStr.includes('Just now'))
  )
    return true;
  if (filter === 'yesterday' && dateStr.includes('Yesterday')) return true;

  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const target = new Date();
    if (filter === 'yesterday') {
      target.setDate(target.getDate() - 1);
    }
    return (
      d.getDate() === target.getDate() &&
      d.getMonth() === target.getMonth() &&
      d.getFullYear() === target.getFullYear()
    );
  } catch {
    return true;
  }
};
