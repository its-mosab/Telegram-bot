const TelegramBot = require('node-telegram-bot-api');
const CryptoJS = require('crypto-js');

const token = '6912363619:AAGuGGvum6dJpyNCOmhpqVuudOeEPpX1Ea8';
const secretKey = '087GhkpB2IDRcPyNyZ5WUwlr8834fMcBiI7cqN2s1p8K';

// معرفات المستخدمين المسموح لهم باستخدام البوت
const allowedUsers = [6061488446, 6988698706];

const bot = new TelegramBot(token, { polling: true });

// دالة التشفير
function encrypt(text) {
  return CryptoJS.AES.encrypt(text, secretKey).toString();
}

// دالة فك التشفير
function decrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// الاستماع إلى الرسائل النصية
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const messageText = msg.text;

  // التحقق من المستخدم
  if (!allowedUsers.includes(userId)) {
    bot.sendMessage(chatId, 'عذراً، أنت غير مصرح لك باستخدام هذا البوت.');
    return;
  }

  let response;

  // التحقق إذا كانت الرسالة مشفرة أو نص عادي
  if (messageText.startsWith('ENC:')) {
    // إذا كانت الرسالة مشفرة، فك تشفيرها
    const encryptedText = messageText.slice(4);
    try {
      response = decrypt(encryptedText);
    } catch (error) {
      response = 'فشل فك التشفير. تأكد من صحة النص.';
    }
  } else {
    // إذا كانت الرسالة نص عادي، تشفيرها
    response = 'ENC:' + encrypt(messageText);
  }

  // إرسال الرد
  bot.sendMessage(chatId, response);
});
