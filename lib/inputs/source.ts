import json5 from "json5";
import { App, News, Source } from "sidestore-source-types";

import { failedToParseSource } from "#/errors";
import { SourceInput } from "#/struct/typedoc";
import { Mandatory } from "#/util";

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
        if (!app.version) app.version = app.versions[0]!.version;
        if (!app.versionDate) app.versionDate = app.versions[0]!.date;
        if (!app.versionDescription) app.versionDescription = app.versions[0]!.localizedDescription;
        if (!app.downloadURL) app.downloadURL = app.versions[0]!.downloadURL;
        if (!app.size) app.size = app.versions[0]!.size;
    }

    return { apps, news };
}
