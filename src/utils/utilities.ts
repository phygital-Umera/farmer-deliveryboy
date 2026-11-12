export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '';

  let date = new Date(dateString);

  // Fallback parsing for dd-mm-yyyy or dd/mm/yyyy strings if Date constructor fails
  if (isNaN(date.getTime()) && typeof dateString === 'string') {
    const parts = dateString.split(/[-/]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        // yyyy-mm-dd
        date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      } else {
        // dd-mm-yyyy
        let yearNum = parseInt(parts[2]);
        if (yearNum < 100) yearNum += 2000;
        date = new Date(yearNum, parseInt(parts[1]) - 1, parseInt(parts[0]));
      }
    }
  }

  if (isNaN(date.getTime())) return String(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
};

export const getYearAndMonth = (timestamp: string) => {
  // Convert the timestamp to a Date object
  const date = new Date(timestamp);

  // Extract the month and year
  const month = date.getMonth() + 1; // Ensure two digits for the month
  const year = date.getUTCFullYear();

  // Concatenate and return the year and month
  console.log(`${year}-${month}`);
  return `${year}-${month}`;
};

export const sum = (value1: string, value2: string) => {
  const largeValue = Math.max(parseInt(value1), parseInt(value2));
  const smallValue = Math.min(parseInt(value1), parseInt(value2));

  return largeValue - smallValue;
};

export const incrementUntilTarget = (start: number, target: number) => {
  let currentValue = start;
  const resultArray = [];

  while (currentValue <= target) {
    resultArray.push(currentValue);
    currentValue++;
  }

  return resultArray;
};
