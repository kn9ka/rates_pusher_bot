import { City } from '../models/City';
import { ExchangeRates, RateLine } from '../types';
import { cityConfig } from '../config/cities';
import { cityRates } from '../config/rates';

export const formatRatesMessage = (
  rates: ExchangeRates,
  city: City
): string => {
  const { rubToCash, rubToZelle, cashUsdToRub, zelleToRub } = rates;
  const operator = cityConfig.operators[city];
  const info = cityConfig.info[city];
  const cityDisplayName = cityConfig.translations[city];
  const usdtRates = cityRates[city];

  const rubToUsdRates: RateLine[] = [
    { amount: '1000000₽', cash: rubToCash[4] ?? 0, zelle: rubToZelle[4] ?? 0 },
    { amount: '500000₽', cash: rubToCash[3] ?? 0, zelle: rubToZelle[3] ?? 0 },
    { amount: '150000₽', cash: rubToCash[2] ?? 0, zelle: rubToZelle[2] ?? 0 },
    { amount: '50000₽', cash: rubToCash[1] ?? 0, zelle: rubToZelle[1] ?? 0 },
    { amount: '10000₽', cash: rubToCash[0] ?? 0, zelle: rubToZelle[0] ?? 0 },
  ];

  const usdToRubRates: RateLine[] = [
    { amount: '10000$', cash: cashUsdToRub[4] ?? 0, zelle: zelleToRub[4] ?? 0 },
    { amount: '5000$', cash: cashUsdToRub[3] ?? 0, zelle: zelleToRub[3] ?? 0 },
    { amount: '1500$', cash: cashUsdToRub[2] ?? 0, zelle: zelleToRub[2] ?? 0 },
    { amount: '500$', cash: cashUsdToRub[1] ?? 0, zelle: zelleToRub[1] ?? 0 },
    { amount: '100$', cash: cashUsdToRub[0] ?? 0, zelle: zelleToRub[0] ?? 0 },
  ];

  const formatRubToUsdLine = (rate: RateLine): string =>
    `• ${rate.amount} -> ${rate.cash}$`;

  const formatUsdToRubLine = (rate: RateLine): string =>
    `• ${rate.amount} -> ${rate.cash}₽`;

  const formatUsdtRates = (rates: { [key: string]: number }): string[] =>
    Object.entries(rates)
      .sort(([amountA], [amountB]) => Number(amountB) - Number(amountA))
      .map(([amount, percent]) => `• $${amount} -> ${percent}%`);

  const formatCashTransfers = (
    transfers: typeof usdtRates.cashTransfers
  ): string[] =>
    transfers.map(
      (transfer) =>
        `• ${transfer.from} -> ${transfer.to} (от $${transfer.minAmount}) | ${transfer.percent}%`
    );

  const showZellePercent = city !== City.MIAMI;

  const messageLines = [
    `<b>📍 Обмен валют в ${cityDisplayName}:</b>`,
    `Написать по обмену <a href="https://t.me/${operator.username}">Zelle online</a> или оставить <a href="https://obmenca.com/">заявку на сайте</a> или в <a href="https://t.me/Obmen_cabot">нашем боте</a>`,
    '',
    '<b>Курсы обмена ₽ на $(наличные):</b>',
    ...rubToUsdRates.map(formatRubToUsdLine),
    ...(showZellePercent
      ? [`• Zelle +${usdtRates.zellePercent.rubToUsd}%`]
      : []),
    '',
    '<b>Курсы обмена $(наличные) на ₽:</b>',
    ...usdToRubRates.map(formatUsdToRubLine),
    ...(showZellePercent
      ? [`• Zelle +${usdtRates.zellePercent.usdToRub}%`]
      : []),
    '',
    '<b>Обмен USDT на $ (наличные):</b>',
    ...formatUsdtRates(usdtRates.usdtToCash),
    ...(showZellePercent
      ? [`• Zelle +${usdtRates.zellePercent.usdtToCash}%`]
      : []),
    '',
    '<b>Обмен $ (наличные) на USDT:</b>',
    ...formatUsdtRates(usdtRates.cashToUsdt),
    ...(showZellePercent
      ? [`• Zelle +${usdtRates.zellePercent.cashToUsdt}%`]
      : []),
    '',
    '<b>⚡️ Переводы наличных</b>',
    ...formatCashTransfers(usdtRates.cashTransfers),
    `💡 <a href="https://t.me/${operator.username}">Написать оператору</a> и совершить обмен`,
    '',
    `🔵 <b><a href="${info}">УЗНАТЬ ПОЛНУЮ ИНФОРМАЦИЮ И ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ (ОТЗЫВЫ)</a></b>`,
  ];

  return messageLines.join('\n');
};
