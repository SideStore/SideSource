import { RouterType } from "itty-router";
import { makeSourceHandler } from "sidesource";

export default function (router: RouterType) {
    const route = makeSourceHandler(
        {
            remoteConfig: false,
            inputs: [
                {
                    type: "github",
                    repo: "SideStore/SideStore",
                    tag: "latest",
                    allowPrereleases: true,
                    appMetadata: {
                        name: "SideStore",
                        developerName: "SideTeam",
                        bundleIdentifier: "SideSource demo",
                        iconURL: "",
                        localizedDescription: "",
                    },
                },
                {
                    type: "github",
                    repo: "SideStore/SideStore",
                    tag: "nightly",
                    appMetadata: {
                        name: "SideStore Nightly",
                        developerName: "SideTeam",
                        bundleIdentifier: "SideSource demo nightly",
                        iconURL: "",
                        localizedDescription: "",
                    },
                },
            ],
            source: {
                name: "",
                identifier: "",
            },
            overrides: {
                apps: [{ name: "test" }, { iconURL: "TEST3" }],
                "apps[1].name": "test2",
            },
        },
        {
            test: () => "test",
        },
    );

    router.all("/", route.fetch);
    router.all("/stable", route.fetch);

    // router.all("/preview/stable/:key", route(false));
}
