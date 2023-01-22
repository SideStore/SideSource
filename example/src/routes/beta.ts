import { RouterType } from "itty-router";
import { makeSourceHandler } from "sidesource";

import functions from "../functions";

export default function (router: RouterType) {
    const handler = makeSourceHandler(
        {
            configURL: "github:SideStore/SideSource/example/config/beta.json?wip",
        },
        functions,
    );

    router.all("/beta", handler.handle);
    router.all("/preview/beta/:key", handler.handle);
    router.all("/reset-cache/beta/:key", handler.resetCache(["/beta"]));
}
