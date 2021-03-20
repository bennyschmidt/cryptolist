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
    const sortByRank = (a, b) => {
      const rowA = a.original.col1;
      const rowB = b.original.col1;

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

    const sortByName = (a, b) => {
      const rowA = a.original.col2.props.children[2].props.children;
      const rowB = b.original.col2.props.children[2].props.children;

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

    const sortByPrice = (a, b) => {
      const rowA = parseFloat(
        `${a.original.col3.replace(/\$|,/gi, '')}`
      );

      const rowB = parseFloat(
        `${b.original.col3.replace(/\$|,/gi, '')}`
      );

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

    const sortByPercent = (a, b) => {
      const rowA = parseFloat(
        `${a.original.col4.props.children.replace(/%|,/gi, '')}`
      );

      const rowB = parseFloat(
        `${b.original.col4.props.children.replace(/%|,/gi, '')}`
      );

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

      return 0;
    };

    const sortByMarketShare = (a, b) => {
      const rowA = parseFloat(a.original.col5.replace(/%|,/gi, ''));
      const rowB = parseFloat(b.original.col5.replace(/%|,/gi, ''));

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

      return 0;
    };

    const sortByMarketCap = (a, b) => {
      const rowA = parseInt(
        `${a.original.col6.replace(/\$|,/gi, '')}`,
        10
      );

      const rowB = parseInt(
        `${b.original.col6.replace(/\$|,/gi, '')}`,
        10
      );

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

    const sortByVolume = (a, b) => {
      const rowA = parseFloat(
        `${a.original.col7.replace(/\$|,/gi, '')}`
      );

      const rowB = parseFloat(
        `${b.original.col7.replace(/\$|,/gi, '')}`
      );

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

    const sortBySupply = (a, b) => {
      const rowA = parseInt(
        `${a.original.col8.replace(/[A-Z]| |,/gi, '')}`,
        10
      );

      const rowB = parseInt(
        `${b.original.col8.replace(/[A-Z]| |,/gi, '')}`,
        10
      );

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

    const sortByLastATH = (a, b) => {

      const rowA = parseInt(
        a.original.col9.props.children[0],
        10
      );

      const rowB = parseInt(
        b.original.col9.props.children[0],
        10
      );

      if (rowA > rowB) {
        return -1;
      }

      if (rowB > rowA) {
        return 1;
      }

       return 0;
    };

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
