import * as cheerio from "cheerio";
import { trim } from "../Trim/Trim.js";
import fetch from "node-fetch";
import { print } from "../Print/Print.js";

export class WorkUa {
  constructor(searchText) {
    this.searchText = searchText;
  }
  async init() {
    print.warning(`Start search: "${this.searchText}" on https://www.work.ua/`); // debug

    const allVacancies = await this.getAllVacancies();
    const links = await this.createLinks(allVacancies);
    const formattedLinks = await this.formatLinks(links);

    print.warning(`End search: "${this.searchText}" on https://www.work.ua/`); // debug

    return {
      title: '<a href="https://www.work.ua/">WorkUa</a>',
      message: formattedLinks,
    };
  }

  async getAllVacancies() {
    const formattedSearchText = this.formatSearchText(this.searchText);
    let response = await fetch(
      `https://www.work.ua/jobs-${formattedSearchText}/`
    );
    let count = 2;
    const allVacancies = [];
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

  async createLinks(allVacancies) {
    let links = [];
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

  async formatLinks(links) {
    let formatLinks = [];
    const chunkSize = 35;
    for (let i = 0; i < links.length; i += chunkSize) {
      const chunk = links.slice(i, i + chunkSize);
      formatLinks.push(chunk.join("\n"));
    }
    return formatLinks;
  }

  formatSearchText(searchText) {
    return searchText.toLowerCase().trim().split(" ").join("+");
  }
}
