import { Router } from "itty-router";

import routes from "./routes/*";

const router = Router();

// Register routes
for (const route of Object.keys(routes)) {
    if (typeof routes[route] != "function") {
        console.log(`skipping route because it's not a function: ${route}`);
        continue;
    }
    console.log(`adding route: ${route}`);
    routes[route](router);
}

router.all("*", () => new Response("404 Not Found", { status: 404 }));

export default {
    fetch: async (req: Request, env: object, ctx: ExecutionContext) => {
        const matched = await caches.default.match(req);
        if (matched) {
            console.log(`cache found for ${req.url}`);
            return matched;
        }

        console.log(`no cache for ${req.url}`);
        return router.handle(req, env, ctx);
    },
};
