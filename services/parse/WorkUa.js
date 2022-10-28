import * as cheerio from "cheerio";
import { trim } from "../trimWhiteSpaces/index.js";
import fetch from "node-fetch";
import { print } from "../print/index.js";

class WorkUa {
  async init(searchText) {
    print.warning("Start parse WorkUa!!!"); // debug
    const formattedSearchText = searchText
      .toLowerCase()
      .trim()
      .split(" ")
      .join("+");
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
    let formatLinks = [];
    const chunkSize = 35;
    for (let i = 0; i < links.length; i += chunkSize) {
      const chunk = links.slice(i, i + chunkSize);
      formatLinks.push(chunk.join("\n"));
    }
    print.warning("End parse WorkUa!!!"); // debug
    return {
      title: '<a href="https://www.work.ua/">WorkUa</a>',
      message: formatLinks,
    };
  }
}

export const workUa = new WorkUa();
