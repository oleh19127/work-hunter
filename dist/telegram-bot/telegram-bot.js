"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramBot = void 0;
const telegraf_1 = require("telegraf");
const commands_1 = require("./commands");
const print_1 = require("../print/print");
const sleep_1 = require("../sleep/sleep");
const parse_1 = require("../parse/parse");
const telegramBot = async () => {
    const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN, {
        handlerTimeout: 900000000,
    });
    const stage = new telegraf_1.Scenes.Stage();
    const createWizardScene = new telegraf_1.Scenes.WizardScene("searchJob", async (ctx) => {
        await ctx.reply("What job are you looking for?");
        return ctx.wizard.next();
    }, async (ctx) => {
        ctx.wizard.state.searchValue = await ctx.message.text;
        const searchValue = await ctx.wizard.state.searchValue;
        await ctx.reply(`Searching: ${searchValue}`);
        const allVacancies = await new parse_1.Parse().init(searchValue);
        print_1.print.successfully("Start upload vacancies");
        let sleepTime = 200;
        for (const vacancies of allVacancies) {
            await ctx.replyWithHTML(`Results from: ${vacancies.title}`, {
                disable_web_page_preview: true,
            });
            for (const message of vacancies.messages) {
                await ctx.replyWithHTML(message, {
                    disable_web_page_preview: true,
                });
                await (0, sleep_1.sleep)(sleepTime);
                sleepTime = sleepTime + 100;
            }
        }
        await ctx.reply("End upload vacancies");
        print_1.print.successfully("End upload vacancies");
        return ctx.scene.leave();
    });
    stage.register(createWizardScene);
    bot.use((0, telegraf_1.session)());
    bot.use(stage.middleware());
    bot.start(async (ctx) => {
        await ctx.reply(`Welcome ${ctx.message.from.first_name}`);
    });
    bot.command("vacancies", async (ctx) => {
        await ctx.scene.enter("searchJob");
    });
    bot.help(async (ctx) => {
        await ctx.reply(commands_1.commands);
    });
    bot.on("text", async (ctx) => {
        await ctx.reply(commands_1.commands);
    });
    bot.command("quit", async (ctx) => {
        await ctx.leaveChat();
        await ctx.reply("Leave chat!!!");
    });
    bot.catch(async (e, ctx) => {
        await ctx.reply(e.message);
        print_1.print.error(e.message);
    });
    await bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
exports.telegramBot = telegramBot;
//# sourceMappingURL=telegram-bot.js.map