const TelegramBot = require('node-telegram-bot-api');
const CryptoJS = require('crypto-js');

const token = process.env.TOKEN;
const secretKey = process.env.SECRET_KEY;

const allowedUsers = [6061488446, 6988698706];

const bot = new TelegramBot(token, { polling: true });

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;

  if (!allowedUsers.includes(userId)) {
    bot.sendMessage(chatId, 'عذراً، أنت غير مصرح لك باستخدام هذا البوت.');
    return;
  }

  let response;

  if (messageText.startsWith('ENC:')) {
    const encryptedText = messageText.slice(4);
    try {
      response = decrypt(encryptedText);
    } catch (error) {
      response = 'فشل فك التشفير. تأكد من صحة النص.';
    }
  } else {
    response = 'ENC:' + encrypt(messageText);
  }

  bot.sendMessage(chatId, response);
});
