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
        async fetch(req, env, ctx) {
            let shouldCache = true;

            if ("KEY" in env) {
                if (req.url.includes(`preview/${env.KEY}`)) shouldCache = false;
                if (req.url.includes(`reset-cache/${env.KEY}`)) return this.resetCache(["", "/"])(req, env, ctx);
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
                res.headers.set("X-Using-Preview", "true");
            }

            return res;
        },
        resetCache(routes) {
            return (req, env, ctx) => {
                if ("KEY" in env)
                    if (req.url.includes(env.KEY)) {
                        for (const route of routes) {
                            const url = new URL(req.url).origin + route;
                            console.log(`reset cache for url: ${url}`);
                            ctx.waitUntil(caches.default.delete(url, { ignoreMethod: true }) as any);
                        }

                        return new Response(`Success! Reset cache for ${routes.filter((val) => val.length > 0).join(", ")}`);
                    } else return new Response("Wrong key. Make sure to include it in the URL!");

                error(keyNotSet);

                return new Response(`The \`KEY\` secret is not set. Please see TODO for more info`);
            };
        },
    } as {
        // Using request will cause type errors with itty-router, so we need to change it to any
        fetch: (req: any, env: Env, ctx: ExecutionContext) => Promise<Response>;
        resetCache: (routes: string[]) => (req: any, env: Env, ctx: ExecutionContext) => Response;
    };
}
