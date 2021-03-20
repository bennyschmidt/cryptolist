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

  const columns = useMemo(() => {
    const compare = (a, b) => {
      if (a > b) {
        return -1;
      }

      if (b > a) {
        return 1;
      }

       return 0;
    }

    const sortByRank = (a, b) => compare(
      a.original.col1,
      b.original.col1
    );

    const sortByName = (a, b) => compare(
      a.original.col2.props.children[2].props.children,
      b.original.col2.props.children[2].props.children
    );

    const sortByPrice = (a, b) => compare(
      parseFloat(
        `${a.original.col3.replace(/\$|,/gi, '')}`
      ),
      parseFloat(
        `${b.original.col3.replace(/\$|,/gi, '')}`
      )
    );

    const sortByPercent = (a, b) => compare(
      parseFloat(
        `${a.original.col4.props.children.replace(/%|,/gi, '')}`
      ),
      parseFloat(
        `${b.original.col4.props.children.replace(/%|,/gi, '')}`
      )
    );

    const sortByMarketShare = (a, b) => compare(
      parseFloat(a.original.col5.replace(/%|,/gi, '')),
      parseFloat(b.original.col5.replace(/%|,/gi, ''))
    );

    const sortByMarketCap = (a, b) => compare(
      parseInt(
        `${a.original.col6.replace(/\$|,/gi, '')}`,
        10
      ),
      parseInt(
        `${b.original.col6.replace(/\$|,/gi, '')}`,
        10
      )
    );

    const sortByVolume = (a, b) => compare(
      parseFloat(
        `${a.original.col7.replace(/\$|,/gi, '')}`
      ),
      parseFloat(
        `${b.original.col7.replace(/\$|,/gi, '')}`
      )
    );

    const sortBySupply = (a, b) => compare(
      parseInt(
        `${a.original.col8.replace(/[A-Z]| |,/gi, '')}`,
        10
      ),
      parseInt(
        `${b.original.col8.replace(/[A-Z]| |,/gi, '')}`,
        10
      )
    );

    const sortByLastATH = (a, b) => compare(
      parseInt(
        a.original.col9.props.children[0].replace(',', '').replace('< 1', '0'),
        10
      ),
      parseInt(
        b.original.col9.props.children[0].replace(',', '').replace('< 1', '0'),
        10
      )
    );

    return [
      {
        Header: '#',
        accessor: 'col1',
        sortType: sortByRank
      },
      {
        Header: 'Name',
        accessor: 'col2',
        sortType: sortByName
      },
      {
        Header: 'Price',
        accessor: 'col3',
        sortType: sortByPrice
      },
      {
        Header: '24h %',
        accessor: 'col4',
        sortType: sortByPercent
      },
      {
        Header: 'Market Share',
        accessor: 'col5',
        sortType: sortByMarketShare
      },
      {
        Header: 'Market Cap',
        accessor: 'col6',
        sortType: sortByMarketCap
      },
      {
        Header: 'Volume (24h)',
        accessor: 'col7',
        sortType: sortByVolume
      },
      {
        Header: 'Circulating Supply',
        accessor: 'col8',
        sortType: sortBySupply
      },
      {
        Header: 'Last ATH',
        accessor: 'col9',
        sortType: sortByLastATH
      },
    ];
  }, []);

  const table = useTable({ columns, data, autoResetSortBy: false }, useSortBy);

  return table;
};
