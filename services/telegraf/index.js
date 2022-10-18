import {Scenes, session, Telegraf,} from "telegraf"
import {commands} from './commands.js'
import {parse} from "../parse/index.js";
import {print} from "../print/index.js";
import {sleep} from "../sleep/index.js"


class Telegram {

  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN)
  }

  async init() {
    const stage = new Scenes.Stage()
    const createWizardScene = new Scenes.WizardScene('searchJob',
      async (ctx) => {
        try {
          await ctx.reply('What job are you looking for?')
          return ctx.wizard.next()
        } catch (e) {
          await ctx.reply(e.message)
          print.error(e.message)
        }
      },
      async (ctx) => {
        try {
          ctx.wizard.state.searchValue = ctx.message.text
          const searchValue = ctx.wizard.state.searchValue
          await ctx.reply(`Searching: ${searchValue}`)
          const allVacancies = await parse.init(searchValue)
          print.successfully('Start upload vacancies')
          for (const vacancies of allVacancies) {
            await ctx.replyWithHTML(`Results from: ${vacancies.title}`, {disable_web_page_preview: true})
            for (const item of vacancies.message) {
              await ctx.replyWithHTML(item, {disable_web_page_preview: true})
              await sleep(200)
            }
          }
          await ctx.reply('End upload vacancies')
          print.successfully('End upload vacancies')
        } catch (e) {
          await ctx.reply(e.message)
          print.error(e.message)
        }
        return ctx.scene.leave()
      }
    )

    await stage.register(createWizardScene)
    await this.bot.use(session())
    await this.bot.use(stage.middleware())

    await this.bot.start( async (ctx) => {
      try {
        await ctx.reply(`Welcome ${ctx.message.chat.first_name}`)
      } catch (e) {
        await ctx.reply(e.message)
        print.error(e.message)
      }
    })

    await this.bot.command('vacancies', async (ctx) => {
      try {
        await ctx.scene.enter('searchJob')
      } catch (e) {
        await ctx.reply(e.message)
        print.error(e.message)
      }
    })

    await this.bot.help( async (ctx) => {
      try {
        await ctx.reply(commands)
      } catch (e) {
        await ctx.reply(e.message)
        print.error(e.message)
      }
    })

    await this.bot.on('text', async (ctx) => {
      try {
        await ctx.reply(commands)
      } catch (e) {
        await ctx.reply(e.message)
        print.error(e.message)
      }
    })

    await this.bot.command('quit', async (ctx) => {
      try {
        await ctx.leaveChat()
        await ctx.reply('Leave chat!!!')
      } catch (e) {
        await ctx.reply(e.message)
        print.error(e.message)
      }
    })

    await this.bot.launch()
    process.once('SIGINT', async () => await this.bot.stop('SIGINT'))
    process.once('SIGTERM', async () => await this.bot.stop('SIGTERM'))

  }


}


const telegram = new Telegram

export {telegram}