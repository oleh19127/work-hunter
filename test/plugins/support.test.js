"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const fastify_1 = require("fastify");
const support_1 = require("../../src/plugins/support");
(0, tap_1.test)('support works standalone', async (t) => {
    const fastify = (0, fastify_1.default)();
    void fastify.register(support_1.default);
    await fastify.ready();
    t.equal(fastify.someSupport(), 'hugs');
});
