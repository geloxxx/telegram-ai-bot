require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: text }],
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const reply = res.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (error) {
    console.error(error.response?.data || error.message);
    bot.sendMessage(chatId, '❌ Error: Hindi available ang AI service.');
  }
});
