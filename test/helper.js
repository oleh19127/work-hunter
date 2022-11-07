"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.config = void 0;
const helper = require('fastify-cli/helper.js');
const path = require("path");
const AppPath = path.join(__dirname, '..', 'src', 'app.ts');
async function config() {
    return {};
}
exports.config = config;
async function build(t) {
    const argv = [AppPath];
    const app = await helper.build(argv, await config());
    t.teardown(() => void app.close());
    return app;
}
exports.build = build;
