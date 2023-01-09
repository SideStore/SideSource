import { RouterType } from "itty-router";

import { createSourceRoute } from "../lib/source";

export default function (router: RouterType) {
    const route = createSourceRoute("stable");
    router.all("/", route);
    router.all("/stable", route);
}
