import { RouterType } from "itty-router";
import { makeSourceHandler } from "sidesource";

import functions from "../functions";

export default function (router: RouterType) {
    const handler = makeSourceHandler(
        {
            configURL: "github:SideStore/SideSource/example/config/stable.json?wip",
        },
        functions,
    );

    router.all("/", handler.handle);
    router.all("/stable", handler.handle);
    router.all("/preview/stable/:key", handler.handle);
    router.all("/reset-cache/stable/:key", handler.resetCache(["", "/stable"]));
}
