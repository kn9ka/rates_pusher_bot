import { Telegraf } from 'telegraf';
import { City } from '../models/City';
import { Currency } from '../models/Currency';
import { ExchangeError } from './exchange';
import { getAllExchangeRates } from './exchange';
import { cityConfig } from '../config/cities';
import { formatRatesMessage } from '../utils/message';

async function getRatesForCity(city: City) {
  const [rubToCash, rubToZelle, cashUsdToRub, zelleToRub] = await Promise.all([
    getAllExchangeRates(Currency.CASHUSD, Currency.WIRERUB, city),
    getAllExchangeRates(Currency.ZELLE, Currency.WIRERUB, city),
    getAllExchangeRates(Currency.WIRERUB, Currency.CASHUSD, city),
    getAllExchangeRates(Currency.WIRERUB, Currency.ZELLE, city),
  ]);

  if (!rubToCash || !rubToZelle || !cashUsdToRub || !zelleToRub) {
    throw new ExchangeError(
      'Не удалось получить курсы обмена для выбранного города'
    );
  }

  return {
    rubToCash,
    rubToZelle,
    cashUsdToRub,
    zelleToRub,
  };
}

async function sendRatesMessage(
  bot: Telegraf,
  chatId: number | string,
  city: City,
  replyToMessageId?: number
) {
  const rates = await getRatesForCity(city);
  const message = formatRatesMessage(rates, city);
  const info = cityConfig.info[city];
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '💬 Узнать подробности & совершить обмен',
          url: info,
        },
      ],
    ],
  };

  const messageOptions = {
    reply_markup: keyboard,
    parse_mode: 'HTML' as const,
  };

  if (replyToMessageId) {
    await bot.telegram.sendMessage(chatId, message, {
      ...messageOptions,
      reply_parameters: {
        message_id: replyToMessageId,
      },
    });
  } else {
    await bot.telegram.sendMessage(chatId, message, messageOptions);
  }
}

export async function sendScheduledMessage(bot: Telegraf, city: City) {
  try {
    const chat = await bot.telegram.getChat(cityConfig.groups[city]);
    const replyToMessageId =
      'pinned_message' in chat && chat.pinned_message
        ? chat.pinned_message.message_id
        : undefined;

    await sendRatesMessage(
      bot,
      cityConfig.groups[city],
      city,
      replyToMessageId
    );

    if (process.env.ADMIN_CHAT_ID) {
      try {
        bot.telegram.sendMessage(
          Number(process.env.ADMIN_CHAT_ID),
          `Сообщение отправлено в ${cityConfig.groups[city]}`
        );
      } catch (error) {
        console.error(`Ошибка при отправке сообщения в админ-чат:`, error);
      }
    }
  } catch (error) {
    console.error(`Ошибка при отправке сообщения для города ${city}:`, error);
  }
}

export { sendRatesMessage };
