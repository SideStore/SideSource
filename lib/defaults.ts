import defaults from "lodash/defaults";

import { Config, GitHubInput, SourceInput } from "#/struct/typedoc";

export function configDefaults(config: Config) {
    config = defaults(config, {
        remoteConfig: true,
        cacheTime: 240,
    } as Partial<Config>);

    if (config.remoteConfig && !config.configURL) throw "`remoteConfig` requires a `configURL` to be specified";

    return config;
}

export function githubInputDefaults(input: GitHubInput) {
    return defaults(input, {
        allowPrereleases: false,
        assetRegex: "(.*).ipa",
        dateLambda: "function:ipaAssetUpdatedAtToSourceDate",
        versionLambda: "release.tag_name",
        changelogLambda: "release.body",
    } as Partial<GitHubInput>);
}

export function sourceInputDefaults(input: SourceInput) {
    return defaults(input, {
        allApps: false,
        allNews: false,
        appBundleIds: [],
        newsIds: [],
    } as Partial<SourceInput>);
}
