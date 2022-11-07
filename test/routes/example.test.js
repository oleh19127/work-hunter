"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const helper_1 = require("../helper");
(0, tap_1.test)('example is loaded', async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        url: '/example'
    });
    t.equal(res.payload, 'this is an example');
});
