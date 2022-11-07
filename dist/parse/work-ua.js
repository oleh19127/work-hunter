"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkUa = void 0;
const cheerio = require("cheerio");
const trim_1 = require("../trim/trim");
const fetch = require("node-fetch");
const print_1 = require("../print/print");
class WorkUa {
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
        print_1.print.warning(`Start search: "${this.searchText}" on https://www.work.ua/`);
        const allVacancies = await this.getAllVacancies();
        const links = await this.createLinks(allVacancies);
        const formattedLinks = await this.formatLinks(links);
        print_1.print.warning(`End search: "${this.searchText}" on https://www.work.ua/`);
        return {
            title: '<a href="https://www.work.ua/">WorkUa</a>',
            messages: formattedLinks,
        };
    }
    async getAllVacancies() {
        const formattedSearchText = this.formatSearchText(this.searchText);
        let response = await fetch(`https://www.work.ua/jobs-${formattedSearchText}/`);
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
                const title = trim_1.trim.whiteSpaces($(card).find("h2").text());
                const link = $(card).find("a").attr("href");
                const responseLink = await fetch(`https://www.work.ua${link}`);
                const bodyLink = await responseLink.text();
                $ = cheerio.load(bodyLink);
                const date = trim_1.trim.whiteSpaces($(".card.wordwrap p.cut-bottom-print.flex.flex-wrap.flex-align-center span.text-muted").text());
                const description = trim_1.trim.whiteSpaces($(card).find(".add-top-xs").text());
                allVacancies.push({ title, link, description, date });
            }
            response = await fetch(`https://www.work.ua/jobs-${formattedSearchText}/?page=${count++}`);
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
                links.push(`${index + 1}) <a href="https://www.work.ua${element.link}">${element.title}</a>\n( ${element.description} ) ${element.date} \n`);
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
exports.WorkUa = WorkUa;
//# sourceMappingURL=work-ua.js.map