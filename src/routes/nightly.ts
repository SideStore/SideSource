import { IRequest, RouterType } from "itty-router";
import { set } from "lodash";

import { getChannelData, parseReleaseData } from "../lib/github";
import { makeDefaultSource } from "../lib/source";
import { Source } from "../types/source";

export default function (router: RouterType) {
    router.all("/nightly", async (req: IRequest, _: any, ctx: ExecutionContext) => {
        const { release, ...everythingElse } = await getChannelData("nightly");
        const parsed = await parseReleaseData(release);

        const source: Source = {
            ...makeDefaultSource(everythingElse, parsed),
            name: "SideStore Nightly",
        };

        set(source, "apps[0].name", "SideStore Nightly");

        set(
            source,
            "apps[0].localizedDescription",
            "SideStore Nightly builds are built from the most recent commit which means you'll be able to try out new features very early. However, since these changes are much newer and less tested, they have a much higher chance of bugs, so use at your own risk.",
        );

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
    });
}
