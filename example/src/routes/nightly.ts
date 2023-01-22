import { RouterType } from "itty-router";
import { makeSourceHandler } from "sidesource";
import functions from "../functions";

export default function (router: RouterType) {
    const handler = makeSourceHandler(
        {
            configURL: "github:SideStore/SideSource/example/config/nightly.json?wip",
        },
        functions,
    );

    router.all("/nightly", handler.fetch);
    router.all("/preview/nightly/:key", handler.fetch);
    router.all("/reset-cache/nightly/:key", handler.resetCache(["/nightly", "/nightly/"]));
}
