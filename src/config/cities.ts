import { City } from '../models/City';
import { CityConfig } from '../types';

export const cities = [
  City.LOS_ANGELES,
  City.MIAMI,
  City.NEW_YORK,
  City.CHICAGO,
];

export const cityConfig: CityConfig = {
  operators: {
    [City.LOS_ANGELES]: {
      username: 'rfice220',
      name: 'LA Operator',
      channel: 'obmen_la_ca',
    },
    [City.MIAMI]: {
      username: 'miami_obmenca',
      name: 'Miami Operator',
      channel: 'obmenca_miami',
    },
    [City.NEW_YORK]: {
      username: 'NY_obmenka',
      name: 'NY Operator',
      channel: 'obmenka_newyork',
    },
    [City.CHICAGO]: {
      username: 'CHI_obmenca',
      name: 'Chicago Operator',
      channel: 'Chicago_obmenca',
    },
    [City.ORANGE_COUNTY]: {
      username: 'obmenca_oc',
      name: 'Orange County Operator',
      channel: 'oc_obmenca',
    },
  },
  translations: {
    [City.LOS_ANGELES]: 'Лос-Анджелес',
    [City.MIAMI]: 'Майами',
    [City.NEW_YORK]: 'Нью-Йорк',
    [City.CHICAGO]: 'Чикаго',
    [City.ORANGE_COUNTY]: 'Орандж Каунти',
  },
  timeZones: {
    [City.LOS_ANGELES]: 'America/Los_Angeles',
    [City.MIAMI]: 'America/Los_Angeles',
    [City.NEW_YORK]: 'America/New_York',
    [City.CHICAGO]: 'America/Chicago',
    [City.ORANGE_COUNTY]: 'America/Los_Angeles',
  },
  groups: {
    [City.LOS_ANGELES]: '@obmen_la_ca',
    [City.MIAMI]: '@obmenca_miami',
    [City.NEW_YORK]: '@obmenka_newyork',
    [City.CHICAGO]: '@Chicago_obmenca',
    [City.ORANGE_COUNTY]: '@oc_obmenca',
    // [City.LOS_ANGELES]: '@test_email_channel',
    // [City.MIAMI]: '@test_email_channel',
    // [City.NEW_YORK]: '@test_email_channel',
    // [City.CHICAGO]: '@test_email_channel',
    // [City.ORANGE_COUNTY]: '@test_email_channel',
  },
  info: {
    [City.LOS_ANGELES]: 'https://t.me/obmen_la_ca/897',
    [City.MIAMI]: 'https://t.me/obmenca_miami/263',
    [City.NEW_YORK]: 'https://t.me/obmenka_newyork/534',
    [City.CHICAGO]: 'https://t.me/Chicago_obmenca/167',
    [City.ORANGE_COUNTY]: 'https://t.me/oc_obmenca/169',
  },
};
