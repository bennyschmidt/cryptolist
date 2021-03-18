import './styles.css';

export const TableDataTimestamp = (date: string) => {
  const today = new Date();
  const lastATH = new Date(date);
  const daysAgo = (today.getTime() - lastATH.getTime()) / (1000 * 3600 * 24) << 0;
  const isToday = daysAgo < 1;
  const isDaysPlural = !isToday && daysAgo !== 1;

  return (
    <span className="timestamp">
      {isToday ? '< 1' : daysAgo.toLocaleString()} day{isDaysPlural ? 's' : ''} ago
    </span>
  );
};
