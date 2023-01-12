import { RouterType } from "itty-router";

export default function (router: RouterType) {
    router.all("/reset-cache/:key+", async (req, env, ctx: ExecutionContext) => {
        if (!req.params || !req.params["key"] || req.params["key"].length < 1) return new Response("no key found", { status: 500 });
        if (req.params["key"] != env.KEY) return new Response("wrong key", { status: 500 });

        // if needed, we can use router.routes to find all registered routes instead of manually specifying them
        for (const route of ["", "/", "/stable", "/beta", "/nightly"]) {
            const url = req.url.replace(/\/reset-cache(.*)/g, "") + route;
            console.log(`reset cache for url: ${url}`);
            ctx.waitUntil(caches.default.delete(url, { ignoreMethod: true }) as any);
        }

        return new Response("Success!");
    });
}
