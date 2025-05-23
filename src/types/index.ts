import { City } from '../models/City';

export interface ExchangeRates {
  rubToCash: number[];
  rubToZelle: number[];
  cashUsdToRub: number[];
  zelleToRub: number[];
}

export interface RateLine {
  amount: string;
  cash: number;
  zelle: number;
}

export interface CityConfig {
  operators: Record<
    City,
    {
      username: string;
      name: string;
      channel: string;
    }
  >;
  translations: Record<City, string>;
  timeZones: Record<City, string>;
  groups: Record<City, string>;
  info: Record<City, string>;
}
