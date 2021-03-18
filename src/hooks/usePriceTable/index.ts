import { useMemo } from 'react';
import { useTable, useSortBy } from 'react-table';

import {
  TableDataName,
  TableDataPriceChange,
  TableDataTimestamp
} from '../../components';

import { usePrices } from '../usePrices';

const dollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

export const usePriceTable = () => {
  const prices = usePrices();

  const data = useMemo(() => {
    if (!prices.length) {
      return [];
    }

    const marketSize = prices
      .map(price => price.marketCap)
      .reduce((a, b): any => (a + b));

    return prices.map(({
      currentPrice,
      marketCapRank,
      image,
      name,
      symbol,
      priceChangePercentage24H,
      marketCap,
      high24H,
      circulatingSupply,
      athDate
    }) => ({
      'col1': marketCapRank,
      'col2': TableDataName({
        src: image,
        text: name,
        subText: symbol.toUpperCase()
      }),
      'col3': dollar.format(currentPrice).replace('.00', ''),
      'col4': TableDataPriceChange(priceChangePercentage24H),
      'col5': `${(marketCap / marketSize * 100).toFixed(2)}%`,
      'col6': dollar.format(marketCap).replace('.00', ''),
      'col7': dollar.format(high24H),
      'col8': (
        `${parseInt(`${circulatingSupply}`, 10).toLocaleString()} ${symbol.toUpperCase()}`
      ),
      'col9': TableDataTimestamp(athDate),
    }));
  }, [prices]);

  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: 'col1',
    },
    {
      Header: 'Name',
      accessor: 'col2',
    },
    {
      Header: 'Price',
      accessor: 'col3',
    },
    {
      Header: '24h %',
      accessor: 'col4',
    },
    {
      Header: 'Market Share',
      accessor: 'col5',
    },
    {
      Header: 'Market Cap',
      accessor: 'col6',
    },
    {
      Header: 'Volume (24h)',
      accessor: 'col7',
    },
    {
      Header: 'Circulating Supply',
      accessor: 'col8',
    },
    {
      Header: 'Last ATH',
      accessor: 'col9',
    },
  ], []);

  const table = useTable({ columns, data }, useSortBy);

  return table;
};
