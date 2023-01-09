import { IRequest, RouterType } from "itty-router";

import { getChannelData, parseReleaseData } from "../lib/github";
import { makeDefaultSource } from "../lib/source";
import { Source } from "../types/source";

const stable = async (req: IRequest, _: any, ctx: ExecutionContext) => {
    const { release, ...everythingElse } = await getChannelData("stable");
    const parsed = await parseReleaseData(release);

    const source: Source = makeDefaultSource(everythingElse, parsed);

    const res = new Response(JSON.stringify(source, null, "    "), {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            // TODO: make a route that requires a secret and if the secret is correct, would reset cache and allow for longer cache times
            "Cache-Control": "max-age=900", // 15 minutes
        },
    });

    ctx.waitUntil(caches.default.put(req as unknown as RequestInfo, res.clone()));

    return res;
};

export default function (router: RouterType) {
    router.all("/", stable);
    router.all("/stable", stable);
}
