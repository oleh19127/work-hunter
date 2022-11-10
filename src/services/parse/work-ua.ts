import * as cheerio from "cheerio";
import { trim } from "../trim/trim";
const fetch = require("node-fetch");
import { print } from "../print/print";
import { IVacancie } from "../../interfaces/IVacancie";
import { IAllVacancies } from "../../interfaces/IAllVacancies";

export class WorkUa {
  searchText: string;
  constructor(searchText: string) {
    this.searchText = searchText;
  }
  async init(): Promise<IAllVacancies> {
    print.warning(`Start search: "${this.searchText}" on https://www.work.ua/`); // debug

    // const allVacancies = await this.getAllVacancies();
    // const links = await this.createLinks(allVacancies);
    // const formattedLinks = await this.formatLinks(links);
    const allVacancies: IVacancie[] = await this.getAllVacancies();
    const links: string[] = await this.createLinks(allVacancies);
    const formattedLinks: string[] = await this.formatLinks(links);

    print.warning(`End search: "${this.searchText}" on https://www.work.ua/`); // debug

    return {
      title: '<a href="https://www.work.ua/">WorkUa</a>',
      messages: formattedLinks,
    };
  }

  private async getAllVacancies(): Promise<IVacancie[]> {
    const formattedSearchText = this.formatSearchText(this.searchText);
    let response = await fetch(
      `https://www.work.ua/jobs-${formattedSearchText}/`
    );
    let count = 2;
    const allVacancies: IVacancie[] = [];
    while (true) {
      const body = await response.text();
      let $ = cheerio.load(body);
      const jobList = $("#pjax-job-list");
      const jobCards = jobList.find(".job-link").toArray();
      if (jobCards.length === 0) {
        break;
      }
      for await (const card of jobCards) {
        const title = trim.whiteSpaces($(card).find("h2").text());
        const link = $(card).find("a").attr("href");
        const responseLink = await fetch(`https://www.work.ua${link}`);
        const bodyLink = await responseLink.text();
        $ = cheerio.load(bodyLink);
        const date = trim.whiteSpaces(
          $(
            ".card.wordwrap p.cut-bottom-print.flex.flex-wrap.flex-align-center span.text-muted"
          ).text()
        );
        const description = trim.whiteSpaces(
          $(card).find(".add-top-xs").text()
        );
        allVacancies.push({ title, link, description, date });
      }
      response = await fetch(
        `https://www.work.ua/jobs-${formattedSearchText}/?page=${count++}`
      );
    }
    return allVacancies;
  }

  private async createLinks(allVacancies: IVacancie[]): Promise<string[]> {
    let links: string[] = [];
    if (allVacancies.length === 0) {
      links.push("No vacancies!!!");
    } else {
      for (const [index, element] of allVacancies.entries()) {
        links.push(
          `${index + 1}) <a href="https://www.work.ua${element.link}">${
            element.title
          }</a>\n( ${element.description} ) ${element.date} \n`
        );
      }
    }
    return links;
  }

  private async formatLinks(links: string[]): Promise<string[]> {
    let formatLinks: string[] = [];
    const chunkSize = 35;
    for (let i = 0; i < links.length; i += chunkSize) {
      const chunk = links.slice(i, i + chunkSize);
      formatLinks.push(chunk.join("\n"));
    }
    return formatLinks;
  }

  private formatSearchText(searchText: string): string {
    return searchText.toLowerCase().trim().split(" ").join("+");
  }
}
