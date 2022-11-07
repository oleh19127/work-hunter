"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parse = void 0;
const djinni_1 = require("./djinni");
const work_ua_1 = require("./work-ua");
class Parse {
    async init(searchText) {
        const [workUaVacancies, djinniVacancies] = await Promise.all([
            new work_ua_1.WorkUa(searchText).init(),
            new djinni_1.Djinni(searchText).init(),
        ]);
        return [workUaVacancies, djinniVacancies];
    }
}
exports.Parse = Parse;
//# sourceMappingURL=parse.js.map