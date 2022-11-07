"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.print = void 0;
const colorette_1 = require("colorette");
const log = console.log;
class Print {
    successfully(message) {
        log((0, colorette_1.green)(message));
    }
    error(message) {
        log((0, colorette_1.red)(message));
    }
    warning(message) {
        log((0, colorette_1.yellow)(message));
    }
}
exports.print = new Print();
//# sourceMappingURL=print.js.map