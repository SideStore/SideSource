import { set } from "lodash";

import { Source } from "../types/source";
import type { parseReleaseData } from "./github";

export function makeDefaultSource({ permissions, news, overrides }: { [i: string]: any }, parsed: Awaited<ReturnType<typeof parseReleaseData>>) {
    const source: Source = {
        name: "SideStore",
        identifier: "com.SideStore.SideStore",
        //sourceURL: "https://apps.sidestore.io",
        apps: [
            {
                name: "SideStore",
                bundleIdentifier: "com.SideStore.SideStore",
                developerName: "SideStore Team",
                localizedDescription:
                    "SideStore is an alternative app store for non-jailbroken devices.\n\nSideStore allows you to sideload other .ipa files and apps from the Files app or via the SideStore Library.",
                tintColor: "A405FA",
                iconURL: "https://apps.sidestore.io/apps/sidestore/v0.1.1/icon.png",
                screenshotURLs: [
                    "https://apps.sidestore.io/apps/sidestore/v0.1.1/browse-dark.png",
                    "https://apps.sidestore.io/apps/sidestore/v0.1.1/apps-dark.png",
                    "https://apps.sidestore.io/apps/sidestore/v0.1.1/news-dark.png",
                    "https://apps.sidestore.io/apps/sidestore/v0.1.1/browse-light.png",
                    "https://apps.sidestore.io/apps/sidestore/v0.1.1/apps-light.png",
                    "https://apps.sidestore.io/apps/sidestore/v0.1.1/news-light.png",
                ],

                permissions,

                versions: [
                    {
                        version: parsed.version,
                        date: parsed.date,
                        localizedDescription: parsed.changelog,
                        downloadURL: parsed.downloadURL,
                        size: parsed.size,
                    },
                ],
            },
        ],
        news,
    };

    for (const entry of Object.entries(overrides)) {
        set(source, entry[0], entry[1]);
    }

    // Copy version data to legacy properties
    source.apps[0].version = source.apps[0].versions[0].version;
    source.apps[0].versionDate = source.apps[0].versions[0].date;
    source.apps[0].versionDescription = source.apps[0].versions[0].localizedDescription;
    source.apps[0].downloadURL = source.apps[0].versions[0].downloadURL;
    source.apps[0].size = source.apps[0].versions[0].size;

    return source;
}
