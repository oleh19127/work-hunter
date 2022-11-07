"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trim = void 0;
class Trim {
    whiteSpaces(string) {
        return string.replace(/\s+/g, " ").trim();
    }
}
const trim = new Trim();
exports.trim = trim;
//# sourceMappingURL=trim.js.map