import { Telegraf, Markup } from 'telegraf';
import { config } from 'dotenv';
import * as cron from 'node-cron';

import { City } from './models/City';
import { cityConfig } from './config/cities';
import { sendScheduledMessage, sendRatesMessage } from './services/message';

config();

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const cronJobs: Record<City, cron.ScheduledTask> = {} as Record<
  City,
  cron.ScheduledTask
>;

// Остановка всех крон-задач
function stopAllCronJobs() {
  Object.values(cronJobs).forEach((job) => job.stop());
}

// Настройка расписания отправки сообщений
function setupScheduledMessages() {
  const cities = [
    City.LOS_ANGELES,
    City.MIAMI,
    City.NEW_YORK,
    City.CHICAGO,
    City.ORANGE_COUNTY,
  ];

  // Останавливаем существующие задачи
  stopAllCronJobs();

  // Создаем новые задачи
  cities.forEach((city) => {
    const timeZone = cityConfig.timeZones[city];
    const job = cron.schedule(
      '0 9 * * *',
      () => sendScheduledMessage(bot, city),
      {
        timezone: timeZone,
      }
    );

    cronJobs[city] = job;
  });
}

// Остановка бота
function stopBot(signal: string) {
  stopAllCronJobs();
  bot.stop(signal);
}

// Обработка команды /test_schedule
bot.command('test_schedule', async (ctx) => {
  if (ctx.chat.type !== 'private') return;
  if (ctx.chat.id !== Number(process.env.ADMIN_CHAT_ID)) return;

  const cities = [City.LOS_ANGELES, City.MIAMI, City.NEW_YORK, City.CHICAGO];
  for (const city of cities) {
    try {
      await sendScheduledMessage(bot, city);
    } catch (error) {
      console.error(
        `Ошибка при отправке тестового сообщения для города ${city}:`,
        error
      );
    }
  }
});

bot.command('start', async (ctx) => {
  if (ctx.chat.type !== 'private') return;

  const keyboard = Markup.inlineKeyboard(
    Object.entries(cityConfig.translations).map(([city, name]) => [
      Markup.button.callback(name, `city_${city}`),
    ])
  );

  await ctx.reply('Выберите город:', keyboard);
});

// Обработка текстовых сообщений
bot.on('text', async (ctx) => {
  console.log(ctx.chat.id);
  if (ctx.chat.type !== 'private') return;
  if (ctx.message.text.startsWith('/')) return;

  const keyboard = Markup.inlineKeyboard(
    Object.entries(cityConfig.translations).map(([city, name]) => [
      Markup.button.callback(name, `city_${city}`),
    ])
  );

  await ctx.reply('Выберите город:', keyboard);
});

// Обработка нажатий на кнопки
bot.action(/^city_(.+)$/, async (ctx) => {
  if (!ctx.chat) return;

  const city = ctx.match[1] as City;

  try {
    const chat = await bot.telegram.getChat(ctx.chat.id);
    const replyToMessageId =
      'pinned_message' in chat && chat.pinned_message
        ? chat.pinned_message.message_id
        : undefined;

    await sendRatesMessage(bot, ctx.chat.id, city, replyToMessageId);
  } catch (error) {
    await ctx.reply(
      'Произошла ошибка при получении курсов обмена. Пожалуйста, попробуйте позже.'
    );
  }
});

// Запуск бота
bot.launch(() => {
  setupScheduledMessages();
  console.log('Бот запущен');
});

// Включаем graceful stop
process.once('SIGINT', () => stopBot('SIGINT'));
process.once('SIGTERM', () => stopBot('SIGTERM'));
