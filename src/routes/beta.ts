import { RouterType } from "itty-router";
import { set } from "lodash";

import { createSourceRoute } from "../lib/source";

export default function (router: RouterType) {
    router.all(
        "/beta",
        createSourceRoute("beta", 60 * 60 /* 1 hour */, (source) => {
            set(source, "identifier", "com.SideStore.SideStore.Beta");

            set(source, "name", "SideStore (Beta)");
            set(source, "apps[0].name", "SideStore (Beta)");

            set(
                source,
                "apps[0].localizedDescription",
                "SideStore Beta builds are hand-picked builds from development commits that will allow you to try out new features earlier than normal, but with a lower chance of bugs than if you used nightly builds. However, since these changes are newer and less tested, they still have a good chance of bugs, so use at your own risk.",
            );
        }),
    );
}
