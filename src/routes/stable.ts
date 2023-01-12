import { RouterType } from "itty-router";

import { createSourceRoute } from "../lib/source";

export default function (router: RouterType) {
    const route = createSourceRoute("stable", 60 * 60 /* 1 hour */);
    router.all("/", route);
    router.all("/stable", route);
}
