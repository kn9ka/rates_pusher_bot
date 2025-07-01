import ky from 'ky';
import { config } from 'dotenv';
import { Currency } from '../models/Currency.js';
import {
  CalcResponse,
  CityResponse,
  Direction,
  GetCalcParams,
} from './exchange.types.js';
import { City } from '../models/City.js';

config();

// Константы
const API_ACTION = 1;
const AMOUNTS_LIST = {
  USD: [100, 500, 1500, 5000, 10000],
  RUB: [10000, 50000, 150000, 500000, 1000000],
} as const;

// Валидация переменных окружения
const apiLogin = process.env.API_LOGIN;
const apiKey = process.env.API_KEY;
const baseUrl = process.env.BASE_URL;

if (!apiLogin || !apiKey || !baseUrl) {
  throw new Error('Отсутствуют необходимые переменные окружения');
}

const queryHeaders = { 'API-LOGIN': apiLogin, 'API-KEY': apiKey };

export class ExchangeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExchangeError';
  }
}

export const getDirection = async (
  currencyIn: Currency,
  currencyOut: Currency
): Promise<string | null> => {
  try {
    const url = `${baseUrl}/get_directions`;

    const response = await ky
      .post(url, {
        headers: queryHeaders,
        timeout: 100000,
      })
      .json<{ data: Direction[] }>();

    const direction = response.data.find(
      (dir) =>
        dir.currency_get_id === currencyIn &&
        dir.currency_give_id === currencyOut
    );

    return direction?.direction_id || null;
  } catch (error) {
    console.error(error);
    throw new ExchangeError('Не удалось получить направление обмена');
  }
};

export const getCalc = async ({
  directionId,
  amount,
  city,
}: GetCalcParams): Promise<number> => {
  try {
    const url = `${baseUrl}/get_calc`;
    const formData = new FormData();

    formData.append('direction_id', directionId);
    formData.append('calc_amount', amount.toString());
    formData.append('calc_action', API_ACTION.toString());
    formData.append('cd', `city=${city}`);

    const response = await ky
      .post(url, {
        headers: queryHeaders,
        body: formData,
        timeout: 100000,
      })
      .json<CalcResponse>();

    return response.data.course_give > response.data.course_get
      ? response.data.course_give
      : response.data.course_get;
  } catch (error) {
    console.error(error);
    throw new ExchangeError('Не удалось получить расчет курса');
  }
};

export const getChosenCityName = async (city: string): Promise<string> => {
  try {
    const url = `${baseUrl}/get_direction`;

    const formData = new FormData();
    formData.append('direction_id', '1331');

    const response = await ky
      .post(url, {
        headers: queryHeaders,
        body: formData,
        timeout: 100000,
      })
      .json<CityResponse>();
    return response.data.dir_fields.city.options[city] || 'Не выбран';
  } catch (error) {
    console.error(error);
    throw new ExchangeError('Не удалось получить название города');
  }
};

export const getExchangeRateForCurrencyPair = async (
  currencyIn: Currency,
  currencyOut: Currency,
  city: string,
  amount: number
): Promise<number | null> => {
  try {
    const directionId = await getDirection(currencyIn, currencyOut);

    if (!directionId) return null;

    return await getCalc({ directionId, amount, city });
  } catch (error) {
    console.error(error);
    throw new ExchangeError('Не удалось получить курс обмена');
  }
};

export const getAllExchangeRates = async (
  currencyIn: Currency,
  currencyOut: Currency,
  city: string
): Promise<number[] | null> => {
  if (city === City.ORANGE_COUNTY) {
    city = City.LOS_ANGELES;
  }

  try {
    const amounts =
      currencyOut === Currency.WIRERUB ? AMOUNTS_LIST.RUB : AMOUNTS_LIST.USD;

    const ratePromises = amounts.map((amount) =>
      getExchangeRateForCurrencyPair(currencyIn, currencyOut, city, amount)
    );

    const rates = await Promise.all(ratePromises);

    if (rates.some((rate) => rate === null)) return null;

    return rates as number[];
  } catch (error) {
    console.error(error);
    throw new ExchangeError('Не удалось получить курсы обмена');
  }
};
