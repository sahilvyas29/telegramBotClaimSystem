import { Telegraf } from 'telegraf';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(async ctx => {
  let firstName = ctx.message.from.first_name;
  ctx.reply(`Welcome to the Claim Bot ${firstName}`);
  ctx.reply('Send your wallet address')
}

);


bot.on('message', async (ctx, next: () => Promise<void>) => {
  if (ctx.text && ctx.text.startsWith('/')) {
    return next();
  };

  const addr = ctx.text;
  console.log("addr", addr);
  if (!addr) return ctx.reply('Enter wallet address!');
  if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
    try {
      const { data } = await axios.post(`${process.env.BACKEND_URL}/claim`, {
        walletAddress: addr,
        telegramId: ctx.from.id,
        amount: process.env.CLAIM_AMOUNT
      });
      ctx.reply(`✅ Success: Your transaction hash ${data.txHash}`);
    } catch (e: any) {
      console.log("e is here", e.response.data.error);
      ctx.reply(`❌ ${e.response.data.error}`);
    }
  } else ctx.reply('Invalid address');
});

bot.command('status', async ctx => {
  try {
    const { data } = await axios.get(`${process.env.BACKEND_URL}/claim/status`, {
      params: { telegramId: ctx.from.id }
    });
    console.log(data);
    if (data.claimed == false) {
      ctx.reply('Not claimed yet');
    }
    if (data.claimed == true) {
      let msg = "Already Claimed \n\n";
      msg += `Tx Hash: ${data.txHash} \n\n`;
      msg += `Claimed at: ${data.claimedAt}`;
      ctx.reply(msg);
    }
  } catch (e: any) {
    ctx.reply(`❌ ${e.response?.data?.message || e.message}`);
  }
});

bot.launch();

