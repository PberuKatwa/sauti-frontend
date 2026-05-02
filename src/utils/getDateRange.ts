export function getMonthDateRange(): { startDate: string; endDate: string } {
  const now = new Date();

  // First day of current month
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);

  // Add 1 day before the start of the month
  startDate.setDate(startDate.getDate() - 1);

  // Last day of current month
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Add 1 day after the end of the month
  endDate.setDate(endDate.getDate() + 1);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}
