import { Config } from "#/struct/typedoc";
import { Functions } from "#/util";

import { makeSource } from ".";

interface Env {
    KEY: string;
}

export function makeSourceHandler(config: Config, functions: Functions = {}) {
    return {
        async fetch(req: any, _: Env, ctx: ExecutionContext): Promise<Response> {
            const source = await makeSource(config, functions);

            const res = new Response(JSON.stringify(source, null, "    "), {
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Access-Control-Allow-Origin": "*",
                },
            });

            if (config.cacheTime! > 0) {
                res.headers.set("Cache-Control", `max-age=${config.cacheTime! * 60}`);
                ctx.waitUntil(caches.default.put(req, res.clone()));
            }

            return res;
        },
        // async resetCache(path: string) {},
    };
}
