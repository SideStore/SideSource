import { News } from "sidestore-source-types";

import { Input } from "./input";

export interface Config {
    /**
     * If set to false, the config will not be fetched from {@link configURL}. **This is not recommended because you will have to re-deploy your cloudflare worker whenever you want to change the config.**
     *
     * Defaults to true.
     */
    remoteConfig?: boolean | undefined;
    /**
     * Specifies the URL to fetch the config as JSON. This allows for updating the config without having to re-deploy the cloudflare worker.
     *
     * **If the config is hosted in a public GitHub repository, please use the format `github:{user or org}/{repo name}/{file path}`. If you need to specify a branch, use this format: `github:{user or org}/{repo name}/{file path}?{branch}`. For example, `github:SideStore/SideSource/example/config/stable.json`.** This will allow us to get around the rate limiting of raw files using the GitHub API.
     *
     * If you are not using a custom domain (aka you are not using caching), **you should not use any `github:` URLs.** `github:` URLs resolve using GitHub's API, which is limited to 60 requests per hour
     * without an access token, which will be exceeded very quickly without caching. Instead, use the URL that your browser goes to when viewing the "raw" contents of a file.
     *
     * Required if {@link remoteConfig} is not false. Otherwise, it does nothing.
     */
    configURL?: string | undefined;
    /**
     * Specifies the URL to base the config on. This is especially helpful when you have multiple release channels and you need a different source for each release channel but want to reduce duplicate configuration.
     *
     * **If the config is hosted in a public GitHub repository, please use the format `github:{user or org}/{repo name}/{file path}`. For example, `github:SideStore/SideSource/example/config/base.json`.** This will allow us to get around the rate limiting of raw files using the GitHub API.
     *
     * If you are not using a custom domain (aka you are not using caching), **you should not use any `github:` URLs.** `github:` URLs resolve using GitHub's API, which is limited to 60 requests per hour
     * without an access token, which will be exceeded very quickly without caching. Instead, use the URL that your browser goes to when viewing the "raw" contents of a file.
     */
    baseConfigURL?: string | undefined;
    /**
     * Number of minutes results will be cached for. If 0, caching will be disabled.
     *
     * Defaults to 4 hours (240 minutes).
     */
    cacheTime?: number | undefined;
    /** Source metadata */
    source?:
        | {
              /** The name of your source. */
              name: string;
              /**
               * This is a bundle identifier SideStore uses to keep your source separate
               * from every other source. For this reason, it is recommended to follow Apple's
               * standard for an identifier.
               *
               * It's important to note here that changing this identifier down the road will
               * have **consequences**. Users with the source already installed will suddenly have
               * conflicting identifiers with the online source and will cause an error in SideStore
               * that will require them to completely remove the source before they can add it back.
               */
              identifier: string;
              /**
               * If your user adds your Source using a URL shortener or you have the link to file
               * stored on CDN, it is recommended that you include this property. This allows
               * SideStore to save the exact link to the file which speeds up retrieval time.
               */
              sourceURL?: string | undefined;
          }
        | undefined;
    /** Inputs for the source. */
    inputs?: Input[] | undefined;
    /** Please see https://sidestore.io/sidestore-source-types/interfaces/News.html for possible values */
    news?: News[] | undefined;
    /**
     * An object that will be used to override properties.
     *
     * ### Example 1
     *
     * Your source output looks something like this:
     * ```json
     * {
     *     "name": "Source",
     *     "identifier": "com.example.source",
     *     "apps": [
     *         {
     *             "name": "My App",
     *             "identifier": "com.example.myapp"
     *         }
     *     ]
     * }
     * ```
     *
     * If you want to change the `name` property of the first app, you could set {@link overrides} to this:
     * ```json
     * {
     *     "apps": [
     *         {
     *             "name": "Override"
     *         }
     *     ]
     * }
     * ```
     *
     * Result:
     * ```json
     * {
     *     "name": "Source",
     *     "identifier": "com.example.source",
     *     "apps": [
     *         {
     *             "name": "Override",
     *             "identifier": "com.example.myapp"
     *         }
     *     ]
     * }
     * ```
     *
     * ### Example 2
     *
     * However, if you have more than one app, like this:
     * ```json
     * {
     *     "name": "Source",
     *     "identifier": "com.example.source",
     *     "apps": [
     *         {
     *             "name": "My App",
     *             "identifier": "com.example.myapp"
     *         },
     *         {
     *             "name": "My App 2",
     *             "identifier": "com.example.myapp2"
     *         }
     *     ]
     * }
     * ```
     *
     * If you only want to override the second one, you will need to do this:
     * ```json
     * {
     *     "apps": [
     *         {},
     *         {
     *             "name": "Override"
     *         }
     *     ]
     * }
     * ```
     *
     * Note the first empty app override. Result:
     * ```json
     * {
     *     "name": "Source",
     *     "identifier": "com.example.source",
     *     "apps": [
     *         {
     *             "name": "My App",
     *             "identifier": "com.example.myapp"
     *         },
     *         {
     *             "name": "Override",
     *             "identifier": "com.example.myapp2"
     *         }
     *     ]
     * }
     * ```
     *
     * ### Example 3
     *
     * You can also manually specify the paths to override with [property paths](https://lodash.com/docs/4.17.15#set):
     * ```json
     * {
     *     "apps[0].name": "Override"
     * }
     * ```
     *
     * Result (using previous 2 app example):
     * ```json
     * {
     *     "name": "Source",
     *     "identifier": "com.example.source",
     *     "apps": [
     *         {
     *             "name": "Override",
     *             "identifier": "com.example.myapp"
     *         },
     *         {
     *             "name": "My App 2",
     *             "identifier": "com.example.myapp2"
     *         }
     *     ]
     * }
     * ```
     */
    overrides?: Record<string, any> | undefined;
}
