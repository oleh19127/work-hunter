"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const root = async (fastify, opts) => {
  fastify.get("/", async function (request, reply) {
    return { root: true };
  });
};
exports.default = root;
