import { RouterType } from "itty-router";

import invalidKey from "../lib/invalidKey";

const stable = ["", "/", "/stable", "/stable/"];
const beta = ["/beta", "/beta/"];
const nightly = ["/nightly", "/nightly/"];

export default function (router: RouterType) {
    router.all("/reset-cache/:channel/:key", async (req, env, ctx: ExecutionContext) => {
        {
            const invalid = invalidKey(req, env);
            if (invalid) return invalid;
        }
        if (!req.params["channel"] || req.params["channel"].length < 1 || !["all", "stable", "beta", "nightly"].includes(req.params["channel"]))
            return new Response("invalid channel found", { status: 500 });

        const routes: string[] = [];
        if (["all", "stable"].includes(req.params["channel"])) routes.push(...stable);
        if (["all", "beta"].includes(req.params["channel"])) routes.push(...beta);
        if (["all", "nightly"].includes(req.params["channel"])) routes.push(...nightly);

        // if needed, we can use router.routes to find all registered routes instead of manually specifying them
        for (const route of routes) {
            const url = req.url.replace(/\/reset-cache(.*)/g, "") + route;
            console.log(`reset cache for url: ${url}`);
            ctx.waitUntil(caches.default.delete(url, { ignoreMethod: true }) as any);
        }

        return new Response(`Success! Reset cache for ${routes.filter((val) => val.length > 0).join(", ")}`);
    });

    // Removal notice
    router.all(
        "/reset-cache/:key+",
        () =>
            new Response(`This route has been removed and replaced with these routes:
- /reset-cache/all/<key>: Reset cache for all channels
- /reset-cache/<channel>/<key>: Only resets the cache for the specific channel`),
    );
}
