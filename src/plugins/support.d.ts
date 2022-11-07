export interface SupportPluginOptions {
}
declare const _default: import("fastify").FastifyPluginAsync<SupportPluginOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault>;
export default _default;
declare module 'fastify' {
    interface FastifyInstance {
        someSupport(): string;
    }
}
