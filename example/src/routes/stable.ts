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

    router.all("/", handler.fetch);
    router.all("/stable", handler.fetch);
    router.all("/preview/stable/:key", handler.fetch);
    router.all("/reset-cache/stable/:key", handler.resetCache(["", "/", "/stable", "/stable/"]));
}
