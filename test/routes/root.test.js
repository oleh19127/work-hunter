"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tap_1 = require("tap");
const helper_1 = require("../helper");
(0, tap_1.test)('default root route', async (t) => {
    const app = await (0, helper_1.build)(t);
    const res = await app.inject({
        url: '/'
    });
    t.same(JSON.parse(res.payload), { root: true });
});
