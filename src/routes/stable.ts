import { RouterType } from "itty-router";

import { createSourceRoute } from "../lib/source";

export default function (router: RouterType) {
    const route = createSourceRoute("stable");

    router.all("/", route(true));
    router.all("/stable", route(true));

    router.all("/preview/stable/:key", route(false));
}
