import './styles.css';

export const TableDataPriceChange = (change: number) => {
  const className = `price ${change < 0 ? 'negative' : ''}`;
  const text = `${change.toFixed(2)}%`

  return <span className={className}>{text}</span>;
};
