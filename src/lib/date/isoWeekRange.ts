export function getIsoWeekRange(date: Date) {
  const monday = new Date(date);
  const day = monday.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  monday.setUTCDate(monday.getUTCDate() + diffToMonday);
  monday.setUTCHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  return {
    weekStart: monday.toISOString().split('T')[0],
    weekEnd: sunday.toISOString().split('T')[0],
  };
}
