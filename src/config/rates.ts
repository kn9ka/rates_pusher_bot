import { City } from '../models/City';

interface UsdtRates {
  usdtToCash: {
    [key: string]: number;
  };
  cashToUsdt: {
    [key: string]: number;
  };
  zellePercent: number;
}

interface CashTransfer {
  from: string;
  to: string;
  minAmount: number;
  percent: number;
}

type CityRates = {
  [key in City]: UsdtRates & {
    cashTransfers: CashTransfer[];
  };
};

export const cityRates: CityRates = {
  [City.LOS_ANGELES]: {
    usdtToCash: {
      '10000': 1.0,
      '5000': 2.0,
      '1500': 2.5,
      '500': 3.5,
      '100': 6.0,
    },
    cashToUsdt: {
      '10000': 3.0,
      '5000': 3.5,
      '1500': 4.0,
      '500': 4.5,
      '100': 6.0,
    },
    zellePercent: 2,
    cashTransfers: [
      {
        from: 'Лос-Анджелес',
        to: 'Москва',
        minAmount: 5000,
        percent: 3,
      },
      {
        from: 'Москва',
        to: 'Лос-Анджелес',
        minAmount: 5000,
        percent: 3,
      },
    ],
  },
  [City.MIAMI]: {
    usdtToCash: {
      '10000': 1.0,
      '5000': 2.0,
      '1500': 2.5,
      '500': 3.5,
      '100': 5.0,
    },
    cashToUsdt: {
      '10000': 2.5,
      '5000': 3.0,
      '1500': 3.5,
      '500': 4.5,
      '100': 5.0,
    },
    zellePercent: 2,
    cashTransfers: [
      {
        from: 'Майами',
        to: 'Москва',
        minAmount: 5000,
        percent: 4,
      },
      {
        from: 'Москва',
        to: 'Майами',
        minAmount: 5000,
        percent: 4,
      },
    ],
  },
  [City.NEW_YORK]: {
    usdtToCash: {
      '10000': 1.0,
      '5000': 2.0,
      '1500': 2.5,
      '500': 3.5,
      '100': 6.0,
    },
    cashToUsdt: {
      '10000': 6.0,
      '5000': 6.5,
      '1500': 7.0,
      '500': 8.0,
      '100': 13.0,
    },
    zellePercent: 2,
    cashTransfers: [
      {
        from: 'Нью-Йорк',
        to: 'Москва',
        minAmount: 5000,
        percent: 5,
      },
      {
        from: 'Москва',
        to: 'Нью-Йорк',
        minAmount: 5000,
        percent: 5,
      },
    ],
  },
  [City.CHICAGO]: {
    usdtToCash: {
      '10000': 0.0,
      '5000': 1.0,
      '1500': 1.5,
      '500': 3.5,
      '100': 4.0,
    },
    cashToUsdt: {
      '10000': 4.0,
      '5000': 4.5,
      '1500': 5.0,
      '500': 6.0,
      '100': 6.5,
    },
    zellePercent: 2,
    cashTransfers: [
      {
        from: 'Чикаго',
        to: 'Москва',
        minAmount: 5000,
        percent: 4,
      },
      {
        from: 'Москва',
        to: 'Чикаго',
        minAmount: 5000,
        percent: 1.5,
      },
    ],
  },
  [City.ORANGE_COUNTY]: {
    usdtToCash: {
      '10000': 1.0,
      '5000': 2.0,
      '1500': 2.5,
      '500': 3.5,
      '100': 6.0,
    },
    cashToUsdt: {
      '10000': 3,
      '5000': 3.5,
      '1500': 4.0,
      '500': 4.5,
      '100': 6.0,
    },
    zellePercent: 2,
    cashTransfers: [
      {
        from: 'Орандж Каунти',
        to: 'Москва',
        minAmount: 5000,
        percent: 3,
      },
      {
        from: 'Москва',
        to: 'Орандж Каунти',
        minAmount: 5000,
        percent: 3,
      },
    ],
  },
};
