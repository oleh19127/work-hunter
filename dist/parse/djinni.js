"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Djinni = void 0;
const cheerio = require("cheerio");
const trim_1 = require("../trim/trim");
const print_1 = require("../print/print");
const fetch = require("node-fetch");
class Djinni {
    constructor(searchText) {
        Object.defineProperty(this, "searchText", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.searchText = searchText;
    }
    async init() {
        print_1.print.warning(`Start search: "${this.searchText}" on https://djinni.co/`);
        const allVacancies = await this.getAllVacancies();
        const links = await this.createLinks(allVacancies);
        const formattedLinks = await this.formatLinks(links);
        print_1.print.warning(`End search: "${this.searchText}" on https://djinni.co/`);
        return {
            title: '<a href="https://djinni.co/">Djinni</a>',
            messages: formattedLinks,
        };
    }
    async getAllVacancies() {
        const formattedSearchText = this.formatSearchText(this.searchText);
        let response = await fetch(`https://djinni.co/jobs/?keywords=${formattedSearchText}&all-keywords=&any-of-keywords=&exclude-keywords=&full_text=on&region=UKR`);
        let count = 2;
        const allVacancies = [];
        while (true) {
            const body = await response.text();
            let $ = cheerio.load(body);
            const pagination = $(".pagination_with_numbers .page-item .page-link").toArray();
            const lastPage = pagination[pagination.length - 2];
            const lastPageNumber = parseInt($(lastPage).text());
            const jobCards = $(".list-jobs__item").toArray();
            for await (const card of jobCards) {
                const title = trim_1.trim.whiteSpaces($(card).find(".list-jobs__title a span").text());
                const link = $(card).find("a").attr("href");
                const responseLink = await fetch(`https://djinni.co${link}`);
                const bodyLink = await responseLink.text();
                $ = cheerio.load(bodyLink);
                const date = trim_1.trim.whiteSpaces($(".col-sm-8.row-mobile-order-2 .profile-page-section.text-small p.text-muted")
                    .first()
                    .contents()
                    .filter(function () {
                    return this.nodeType === 3;
                })
                    .text());
                const description = trim_1.trim.whiteSpaces($(card).find(".list-jobs__description p").text());
                allVacancies.push({ title, date, description, link });
            }
            if (count === lastPageNumber + 1 || pagination.length === 0) {
                break;
            }
            response = await fetch(`https://djinni.co/jobs/?keywords=${formattedSearchText}&all-keywords=&any-of-keywords=&exclude-keywords=&full_text=on&region=UKR&page=${count++}`);
        }
        return allVacancies;
    }
    async createLinks(allVacancies) {
        let links = [];
        if (allVacancies.length === 0) {
            links.push("No vacancies!!!");
        }
        else {
            for (const [index, element] of allVacancies.entries()) {
                links.push(`${index + 1}) <a href="https://djinni.co${element.link}">${element.title}</a>\n( ${element.description} ) ${element.date} \n`);
            }
        }
        return links;
    }
    async formatLinks(links) {
        let formatLinks = [];
        const chunkSize = 10;
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
exports.Djinni = Djinni;
//# sourceMappingURL=djinni.js.map