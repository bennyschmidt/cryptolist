import { useState, useEffect } from 'react';

import querystring from 'querystring';
import decamelize from 'decamelize-keys';
import camelcase from 'camelcase-keys';
import fetch from 'axios';

interface IParams {
  vsCurrency: string;
  order: string;
  perPage: number;
  page: number;
  sparkline: boolean;
}

const params: IParams = {
  vsCurrency: 'usd',
  order: 'market_cap_desc',
  perPage: 100,
  page: 1,
  sparkline: false
};

export interface IPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  currentPrice: number;
  marketCap: number,
  marketCapRank: number;
  high24H: number;
  priceChange24H: number;
  priceChangePercentage24H: number;
  circulatingSupply: number;
  totalSupply: number;
  athDate: string;
}

export const usePrices = () => {
  const [prices, setPrices] = useState<IPrice[]>([]);

  useEffect(() => {
    const query = decamelize(params);

    const fetchPrices = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?${querystring.stringify(query)}`
      );

      if (response?.data) {
        const pricesResult = (
          camelcase(response.data, { deep: true })
            .map(({
              id,
              symbol,
              name,
              image,
              currentPrice,
              marketCap,
              marketCapRank,
              high24H,
              priceChange24H,
              priceChangePercentage24H,
              circulatingSupply,
              totalSupply,
              athDate
            }: IPrice) => ({
              id,
              symbol,
              name,
              image,
              currentPrice,
              marketCap,
              marketCapRank,
              high24H,
              priceChange24H,
              priceChangePercentage24H,
              circulatingSupply,
              totalSupply,
              athDate
            })
          )
        );

        if (pricesResult?.length) {
          setPrices(pricesResult);
        }
      }
    };

    const interval = setInterval(fetchPrices, 1000);

    return () => clearInterval(interval);
  }, []);

  return prices;
};
