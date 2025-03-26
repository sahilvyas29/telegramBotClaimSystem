import { Telegraf } from 'telegraf';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(ctx => ctx.reply('Send your wallet address'));
bot.on('message', async (ctx, next:()=>Promise<void>) => {
  if (ctx.text && ctx.text.startsWith('/')){ 
    return next();
  };
  const addr = ctx.text;
  console.log("addr",addr);
  if(!addr) return ctx.reply('Enter wallet address!');
  if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
    try {
      const { data } = await axios.post(`${process.env.BACKEND_URL}/claim`, {
        walletAddress: addr,
        telegramId: ctx.from.id,
        amount: process.env.CLAIM_AMOUNT
      });
      ctx.reply(`✅ Success: Your transaction hash ${data.txHash}`);
    } catch (e: any) {
      console.log("e is here",e.response.data.error);
      ctx.reply(`❌ ${e.response.data.error}`);
    }
  } else ctx.reply('Invalid address');
});

bot.command('status', async ctx => {
  console.log("In status command")
  const parts = ctx.message.text.split(' ');
  console.log("parts");
  if (!parts[1]) return ctx.reply('Usage: /status <wallet>');
  try {
    const { data } = await axios.get(`${process.env.BACKEND_URL}/claim/${parts[1]}`);
    ctx.reply(JSON.stringify(data));
  } catch (e: any) {
    ctx.reply(`❌ ${e.response?.data?.message || e.message}`);
  }
});

bot.launch();

