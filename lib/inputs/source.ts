import json5 from "json5";
import { App, News, Source } from "sidestore-source-types";

import { failedToParseSource } from "#/errors";
import { copyToLegacyProperties } from "#/legacyProperties";
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
        copyToLegacyProperties(app);
    }

    return { apps, news };
}
