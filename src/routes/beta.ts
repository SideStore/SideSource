import { IRequest, RouterType } from "itty-router";
import { set } from "lodash";

import { getChannelData, parseReleaseData } from "../lib/github";
import { makeDefaultSource } from "../lib/source";
import { Source } from "../types/source";

export default function (router: RouterType) {
    router.all("/beta", async (req: IRequest, _: any, ctx: ExecutionContext) => {
        const { release, ...everythingElse } = await getChannelData("beta");
        const parsed = await parseReleaseData(release);

        const source: Source = {
            ...makeDefaultSource(everythingElse, parsed),
            name: "SideStore Beta",
            identifier: "com.SideStore.SideStore.Beta",
        };

        set(source, "apps[0].name", "SideStore Beta");

        set(
            source,
            "apps[0].localizedDescription",
            "SideStore Beta builds are hand-picked builds from development commits that will allow you to try out new features earlier than normal, but with a lower chance of bugs than if you used nightly builds. However, since these changes are newer and less tested, they still have a good chance of bugs, so use at your own risk.",
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
