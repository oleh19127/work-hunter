import * as cheerio from "cheerio";
import { trim } from "../trim/trim";
import { print } from "../print/print";
const fetch = require("node-fetch");
import { IVacancie } from "../../interfaces/IVacancie";
import { IAllVacancies } from "../../interfaces/IAllVacancies";

export class Djinni {
  searchText: string;
  constructor(searchText: string) {
    this.searchText = searchText;
  }
  async init(): Promise<IAllVacancies> {
    print.warning(`Start search: "${this.searchText}" on https://djinni.co/`); // debug

    const allVacancies: IVacancie[] = await this.getAllVacancies();
    const links: string[] = await this.createLinks(allVacancies);
    const formattedLinks: string[] = await this.formatLinks(links);

    print.warning(`End search: "${this.searchText}" on https://djinni.co/`); // debug

    return {
      title: '<a href="https://djinni.co/">Djinni</a>',
      messages: formattedLinks,
    };
  }

  private async getAllVacancies(): Promise<IVacancie[]> {
    const formattedSearchText = this.formatSearchText(this.searchText);
    let response = await fetch(
      `https://djinni.co/jobs/?keywords=${formattedSearchText}&all-keywords=&any-of-keywords=&exclude-keywords=&full_text=on&region=UKR`
    );
    let count = 2;
    const allVacancies: IVacancie[] = [];
    while (true) {
      const body = await response.text();
      let $ = cheerio.load(body);
      const pagination = $(
        ".pagination_with_numbers .page-item .page-link"
      ).toArray();
      const lastPage = pagination[pagination.length - 2];
      const lastPageNumber = parseInt($(lastPage).text());
      const jobCards = $(".list-jobs__item").toArray();
      for await (const card of jobCards) {
        const title = trim.whiteSpaces(
          $(card).find(".list-jobs__title a span").text()
        );
        const link = $(card).find("a").attr("href");
        const responseLink = await fetch(`https://djinni.co${link}`);
        const bodyLink = await responseLink.text();
        $ = cheerio.load(bodyLink);
        const date = trim.whiteSpaces(
          $(
            ".col-sm-8.row-mobile-order-2 .profile-page-section.text-small p.text-muted"
          )
            .first()
            .contents()
            .filter(function () {
              return this.nodeType === 3;
            })
            .text()
        );
        const description = trim.whiteSpaces(
          $(card).find(".list-jobs__description p").text()
        );
        allVacancies.push({ title, date, description, link });
      }
      if (count === lastPageNumber + 1 || pagination.length === 0) {
        break;
      }
      response = await fetch(
        `https://djinni.co/jobs/?keywords=${formattedSearchText}&all-keywords=&any-of-keywords=&exclude-keywords=&full_text=on&region=UKR&page=${count++}`
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
          `${index + 1}) <a href="https://djinni.co${element.link}">${
            element.title
          }</a>\n( ${element.description} ) ${element.date} \n`
        );
      }
    }
    return links;
  }

  private async formatLinks(links: string[]): Promise<string[]> {
    let formatLinks: string[] = [];
    const chunkSize = 10;
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
