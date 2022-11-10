import { Scenes, session, Context, Telegraf } from "telegraf";
import { Update } from "telegraf/types";
import { commands } from "./commands";
import { print } from "../print/print";
import { sleep } from "../sleep/sleep";
import { Parse } from "../parse/parse";
import { IAllVacancies } from "../../interfaces/IAllVacancies";

export const telegram = async () => {
  const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.BOT_TOKEN as string,
    {
      handlerTimeout: 900_000_000,
    }
  );

  const stage = new Scenes.Stage();
  const createWizardScene = new Scenes.WizardScene(
    "searchJob",
    async (ctx) => {
      await ctx.reply("What job are you looking for?");
      return ctx.wizard.next();
    },
    async (ctx) => {
      // @ts-ignore
      ctx.wizard.state.searchValue = await ctx.message.text;
      // @ts-ignore
      const searchValue = await ctx.wizard.state.searchValue;
      await ctx.reply(`Searching: ${searchValue}`);
      const allVacancies: IAllVacancies[] = await new Parse().init(searchValue);
      print.successfully("Start upload vacancies");
      let sleepTime = 200;
      for (const vacancies of allVacancies) {
        await ctx.replyWithHTML(`Results from: ${vacancies.title}`, {
          disable_web_page_preview: true,
        });
        for (const message of vacancies.messages) {
          await ctx.replyWithHTML(message, {
            disable_web_page_preview: true,
          });
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
  // @ts-ignore
  stage.register(createWizardScene);
  bot.use(session());
  // @ts-ignore
  bot.use(stage.middleware());

  bot.start(async (ctx) => {
    await ctx.reply(`Welcome ${ctx.message.from.first_name}`);
  });

  bot.command("vacancies", async (ctx) => {
    // @ts-ignore
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

  bot.catch(async (e: any, ctx) => {
    await ctx.reply(e.message);
    print.error(e.message);
  });

  await bot.launch();
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
