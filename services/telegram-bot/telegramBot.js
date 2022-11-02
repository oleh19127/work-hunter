import { Scenes, session, Telegraf } from "telegraf";
import { commands } from "./commands.js";
import { print } from "../Print/Print.js";
import { sleep } from "../sleep/index.js";
import { Parse } from "../Parse/Parse.js";

export const telegramBot = async () => {
  const bot = new Telegraf(process.env.BOT_TOKEN, {
    handlerTimeout: 900_000_000,
  });

  const stage = new Scenes.Stage();
  const createWizardScene = new Scenes.WizardScene(
    "searchJob",
    async (ctx) => {
      await ctx.reply("What job are you looking for?");
      return ctx.wizard.next();
    },
    async (ctx) => {
      ctx.wizard.state.searchValue = await ctx.message.text;
      const searchValue = await ctx.wizard.state.searchValue;
      await ctx.reply(`Searching: ${searchValue}`);
      const allVacancies = await new Parse().init(searchValue);
      print.successfully("Start upload vacancies");
      let sleepTime = 200;
      for (const vacancies of allVacancies) {
        await ctx.replyWithHTML(`Results from: ${vacancies.title}`, {
          disable_web_page_preview: true,
        });

        for (const item of vacancies.message) {
          await ctx.replyWithHTML(item, { disable_web_page_preview: true });
          await sleep(sleepTime);
          sleepTime = sleepTime + 100;
          // print.warning(sleepTime);
        }
      }
      await ctx.reply("End upload vacancies");
      print.successfully("End upload vacancies");
      return ctx.scene.leave();
    }
  );

  stage.register(createWizardScene);
  bot.use(session());
  bot.use(stage.middleware());

  bot.start(async (ctx) => {
    await ctx.reply(`Welcome ${ctx.message.chat.first_name}`);
  });

  bot.command("vacancies", async (ctx) => {
    await ctx.scene.enter("searchJob");
  });

  bot.help(async (ctx) => {
    await ctx.reply(commands);
  });

  bot.on("text", async (ctx) => {
    await ctx.reply(commands);
  });

  bot.command("quit", async (ctx) => {
    await ctx.leaveChat();
    await ctx.reply("Leave chat!!!");
  });

  bot.catch(async (e, ctx) => {
    await ctx.reply(e.message);
    print.error(e.message);
  });

  await bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
