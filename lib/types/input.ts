import { App, News, Permission } from "sidestore-source-types";

/** This can be one of the input types. The `type` value must be the value that is specified or they may not be parsed correctly. */
export type Input = GitHubInput | SourceInput | RawInput | CustomInput;

/**
 * An input for GitHub Releases.
 *
 * Currently, we cannot support GitHub Actions since artifacts can only be downloaded in zip format. However, you can add a build step that updates a release using [IsaacShelton/update-existing-release](https://github.com/IsaacShelton/update-existing-release).
 *
 * **{@link type} MUST be `github`**
 */
export interface GitHubInput {
    type: "github";
    /** The repository to use. Must be in `{user or org}/{repo name}` format. */
    repo: string;
    /** The tag to use when fetching the release. If the tag is `latest`, it will use the latest release. See {@link allowPrereleases} if you want to allow prereleases when fetching the latest release. */
    tag: "latest" | string;
    /**
     * If true, it will allow a prerelease to be the latest release. This will only do anything if {@link tag} is `latest`.
     *
     * Defaults to false.
     */
    allowPrereleases?: boolean | undefined;
    /**
     * The regex used to match the IPA asset from the assets in the release. I recommend using https://www.regextester.com/ to test your regex.
     *
     * Defaults to `(.*).ipa`
     */
    assetRegex?: string | undefined;
    /**
     * Lambdas have a few options for returning the required output:
     * 1. A property path that points to the property that should correspond to the output. Examples:
     *    - `release.body`
     *    - `ipaAsset.name`
     * 2. The name of a JavaScript/TypeScript function prefixed with `function:` provided when creating the handler/source. See TODO for more info on built in functions and how you can make your own.
     *
     * You will have access to the `release` variable (see https://docs.github.com/en/rest/releases/releases#get-the-latest-release) and `ipaAsset` variable, which is the asset that was picked using {@link assetRegex}.
     *
     * `dateLambda` is expected to return a string with the date in `YYYY-MM-DD` format.
     *
     * Defaults to parsing the date from the release asset `updated_at` property. (`function:ipaAssetUpdatedAtToSourceDate`)
     */
    dateLambda?: string | undefined;
    /**
     * See {@link dateLambda} for info on how to use lambdas.
     *
     * `versionLambda` is expected to return a string with the app version.
     *
     * Defaults to the release tag name. (`release.tag_name`)
     */
    versionLambda?: string | undefined;
    /**
     * See {@link dateLambda} for info on how to use lambdas.
     *
     * `changelogLambda` is expected to return a string with the version changelog.
     *
     * Defaults to the release body. (`release.body`)
     */
    changelogLambda?: string | undefined;
    /**
     * Metadata for the app. See https://sidestore.io/sidestore-source-types/interfaces/App.html for updated documentation on each value
     */
    appMetadata: {
        name: string;
        bundleIdentifier: string;
        developerName: string;
        subtitle?: string | undefined;
        localizedDescription: string;
        iconURL: string;
        tintColor?: string | undefined;
        permissions?: Permission[];
        screenshotURLs?: string[] | undefined;
    };
}

/**
 * An input for cherry picking apps and news from another source.
 *
 * **{@link type} MUST be `source`**
 */
export interface SourceInput {
    type: "source";
    /** The URL for the source. */
    url: string;
    /**
     * If true, all apps in the source will be cherry picked. This will override {@link appBundleIds}.
     *
     * Defaults to false.
     */
    allApps?: boolean | undefined;
    /**
     * An array of app bundleIdentifiers to cherry pick.
     *
     * If {@link allApps} is true, this option will do nothing.
     */
    appBundleIds?: string[] | undefined;
    /**
     * If true, all news in the source will be cherry picked. This will override {@link newsIds}.
     *
     * Defaults to false.
     */
    allNews?: boolean | undefined;
    /**
     * An array of news identifiers to cherry pick.
     *
     * If {@link allNews} is true, this option will do nothing.
     */
    newsIds?: string[] | undefined;
}

/**
 * An input that allows you to manually specify each value.
 *
 * **{@link type} MUST be `raw`**
 */
export interface RawInput {
    type: "raw";
    /** Please see https://sidestore.io/sidestore-source-types/interfaces/App.html for possible values */
    app: App;
    /** Please see https://sidestore.io/sidestore-source-types/interfaces/News.html for possible values */
    news?: News[] | undefined;
}

/**
 * An input that allows you to use a function to get apps and optionally news.
 *
 * **{@link type} MUST be `custom`**
 */
export interface CustomInput {
    type: "custom";
    /**
     * The name of a JavaScript/TypeScript function to use to get the app and news values. **It MUST return an object with an array of [App](https://sidestore.io/sidestore-source-types/interfaces/App.html)
     * objects called `apps` and optionally an array of [News](https://sidestore.io/sidestore-source-types/interfaces/News.html) objects called `news`.**
     *
     * Unlike the lambda properties in {@link GitHubInput}, **this property does not need to be prefixed with `function:`.**
     *
     * See TODO for more info on built in functions and how you can make your own.
     */
    functionName: string;
}
