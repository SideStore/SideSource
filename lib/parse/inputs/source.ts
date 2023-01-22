import json5 from "json5";
import { App, News, Source } from "sidestore-source-types";

import { failedToParseSource } from "#/errors";
import { SourceInput } from "#/types";
import { Mandatory } from "#/util/mandatory";

export async function makeAppFromSourceInput({ url, allApps, allNews, appBundleIds, newsIds }: Mandatory<SourceInput>) {
    const text = await (await fetch(url)).text();
    let source: Source;
    try {
        source = json5.parse(text);
    } catch {
        throw failedToParseSource(text);
    }

    const apps: App[] = [];
    const news: News[] = [];

    for (const app of source.apps) if (allApps || appBundleIds.includes(app.bundleIdentifier)) apps.push(app);
    if (source.news) for (const newsEntry of source.news) if (allNews || newsIds.includes(newsEntry.identifier)) news.push(newsEntry);

    for (const app of apps) {
        if (!app.versions || app.versions.length < 1) continue;
        // Copy version data to legacy properties
        app.version = app.versions[0]!.version;
        app.versionDate = app.versions[0]!.date;
        app.versionDescription = app.versions[0]!.localizedDescription;
        app.downloadURL = app.versions[0]!.downloadURL;
        app.size = app.versions[0]!.size;
    }

    return { apps, news };
}
