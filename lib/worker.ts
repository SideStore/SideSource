import { Config } from "#/struct/typedoc";
import { Functions } from "#/util";

import { makeSource } from ".";
import { keyNotSet } from "./errors";
import { error, info } from "./logging";

interface Env {
    KEY: string;
}

export function makeSourceHandler(config: Config, functions: Functions = {}) {
    return {
        fetch(req: Request, env: Env, ctx: ExecutionContext) {
            const { pathname } = new URL(req.url);
            if (pathname == "" || pathname == "/" || pathname.includes("preview") || pathname.includes("reset-cache")) return this.handle(req, env, ctx);
            return new Response("404 Not Found", { status: 404 });
        },
        async handle(req: Request, env, ctx) {
            let shouldCache = true;

            const { pathname } = new URL(req.url);
            if ("KEY" in env) {
                if (pathname.includes("preview") && pathname.includes(env.KEY)) shouldCache = false;
                if (pathname.includes("reset-cache") && pathname.includes(env.KEY)) return this.resetCache([""])(req, env, ctx);
            } else error(keyNotSet);

            if (shouldCache) {
                const matched = await caches.default.match(req);
                if (matched) {
                    info(`Cache found for ${req.url}`);
                    return matched;
                }

                info(`No cache for ${req.url}`);
            } else info("Skipping cache");

            const { source, newConfig } = await makeSource(config, functions);

            const res = new Response(JSON.stringify(source, null, "    "), {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Access-Control-Allow-Origin": "*",
                },
            });

            if (newConfig.cacheTime! > 0 && shouldCache) {
                res.headers.set("Cache-Control", `max-age=${newConfig.cacheTime! * 60}`);
                ctx.waitUntil(caches.default.put(req, res.clone()));
            } else if (!shouldCache) {
                res.headers.set("X-Skipping-Cache", "true");
            }

            return res;
        },
        resetCache(origRoutes) {
            return (req: Request, env, ctx) => {
                if ("KEY" in env) {
                    const url = new URL(req.url);
                    if (url.pathname.includes(env.KEY)) {
                        // Clone array so we don't modify the original
                        const routes = [...origRoutes];

                        // Create duplicate routes with trailing slashes
                        // Clone it again so we don't make an infinite loop
                        for (const route of [...routes]) {
                            const withTrailingSlash = `${route}/`;
                            if (routes.indexOf(withTrailingSlash) == -1) routes.push(withTrailingSlash);
                        }

                        for (const route of routes) {
                            const routeUrl = url.origin + route;
                            console.log(`reset cache for url: ${routeUrl}`);
                            ctx.waitUntil(caches.default.delete(routeUrl, { ignoreMethod: true }) as any);
                        }

                        return new Response(`Success! Reset cache for ${routes.filter((val) => val.length > 0).join(", ")}`);
                    } else return new Response("Wrong key. Make sure to include it in the URL!");
                }
                error(keyNotSet);

                return new Response(`The \`KEY\` secret is not set. Please see https://sidestore.io/SideSource/#4-setting-up-a-key-for-preview-and-caching-resetting-functionality for more info`);
            };
        },
    } as {
        // Using request will cause type errors with itty-router, so we need to change it to any
        handle: (req: any, env: Env, ctx: ExecutionContext) => Promise<Response>;
        resetCache: (routes: string[]) => (req: any, env: Env, ctx: ExecutionContext) => Response;
        // NOTE: we don't expose fetch because it should only be used when SideSource handles the entire worker. We don't want people using itty-router to use it
    };
}
