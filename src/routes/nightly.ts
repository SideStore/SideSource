import { RouterType } from "itty-router";
import { set } from "lodash";

import { createSourceRoute } from "../lib/source";

export default function (router: RouterType) {
    router.all(
        "/nightly",
        createSourceRoute("nightly", (source) => {
            set(source, "identifier", "com.SideStore.SideStore.Nightly");

            set(source, "name", "SideStore (Nightly)");
            set(source, "apps[0].name", "SideStore (Nightly)");

            set(
                source,
                "apps[0].localizedDescription",
                "SideStore Nightly builds are built from the most recent commit which means you'll be able to try out new features very early. However, since these changes are much newer and less tested, they have a much higher chance of bugs, so use at your own risk.",
            );
        }),
    );
}
