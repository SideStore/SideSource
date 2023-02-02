import { Config, GitHubInput, SourceInput } from "#/struct/typedoc";

import { err } from "./errors";
import { merge } from "./util";

export function configDefaults(config: Config, skipRemoteConfigCheck = false) {
    config = merge<Config>(
        {
            remoteConfig: true,
            cacheTime: 240,
            inputs: [],
        } as Partial<Config>,
        config,
    );

    if (!skipRemoteConfigCheck && config.remoteConfig && !config.configURL) throw err`\`remoteConfig\` requires a \`configURL\` to be specified`;

    return config;
}

export function githubInputDefaults(input: GitHubInput) {
    return merge<GitHubInput>(
        {
            allowPrereleases: false,
            assetRegex: "(.*).ipa",
            dateLambda: "function:ipaAssetUpdatedAtToSourceDate",
            versionLambda: "release.tag_name",
            changelogLambda: "release.body",
        } as Partial<GitHubInput>,
        input,
    );
}

export function sourceInputDefaults(input: SourceInput) {
    return merge<SourceInput>(
        {
            allApps: false,
            allNews: false,
            appBundleIds: [],
            newsIds: [],
        } as Partial<SourceInput>,
        input,
    );
}
