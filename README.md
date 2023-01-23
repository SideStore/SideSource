# SideSource

[![npm](https://img.shields.io/npm/v/sidesource?style=flat-square)](https://npmjs.com/package/sidesource)

SideSource is a JavaScript/TypeScript framework for creating SideStore sources. It also has easy to use Cloudflare workers integration.

Web docs are available at https://sidestore.io/SideSource.

Changelog is available at https://github.com/SideStore/SideSource/blob/main/CHANGELOG.md.

Table of Contents:

- [Features](#features)
- [Example](#example)
- [Guides](#guides)
- [Initial Cloudflare Worker Setup](#initial-cloudflare-worker-setup)
    - [1. Creating the worker](#1-creating-the-worker)
    - [2. Making a single source worker](#2-making-a-single-source-worker)
    - [2. Making a multi-source worker](#2-making-a-multi-source-worker)
    - [3. Configuring your source](#3-configuring-your-source)
    - [4. Setting up a key for preview and caching resetting functionality](#4-setting-up-a-key-for-preview-and-caching-resetting-functionality)
    - [5. Testing your source](#5-testing-your-source)
    - [6. Deploying your worker](#6-deploying-your-worker)
- [Functions](#functions)
    - [Built in functions](#built-in-functions)
        - [`ipaAssetUpdatedAtToSourceDate`](#ipaassetupdatedattosourcedate)
        - [`makeUnc0verApp`](#makeunc0verapp)
    - [Making your own functions](#making-your-own-functions)
        - [Arguments](#arguments)

## Features

-   Fully documented with guides on setup and advanced features
-   Specify inputs from GitHub, other sources, or use a custom or raw input to provide apps and news from places that aren't supported by default
-   Overrides system allowing you to change any property to any value
-   Remote configs
    -   Specify a URL or file in a GitHub repository to get the configuration from
    -   This allows you to change your config without having to re-deploy the Cloudflare Worker
    -   You can also specify a URL or file in a GitHub repository to base a config off of to reduce duplicate configuration
-   Cloudflare Workers integration
    -   Caching
    -   Preview (view source without caching)
    -   Reset cache
    -   Preview and reset cache require a key that you can choose

## Example

[apps.sidestore.io](https://apps.sidestore.io) is powered by SideSource, and you can view the configs and source code at https://github.com/SideStore/SideSource/tree/main/example. It has multiple
different sources for each of the release channels (stable, beta and nightly) and uses custom functions to parse GitHub releases for changelog and other info.

## Guides

-   [Initial Cloudflare Worker Setup](#initial-cloudflare-worker-setup): A step by step guide on setting up a Cloudflare Worker and integrating it with SideSource.
-   [Functions](#functions): Detailed documentation on functions. Includes info on built in functions and a guide on how to create your own functions and use them in your source.

## Initial Cloudflare Worker Setup

> <span style="color: #c69026; font-weight: bold">**Warning**</span>
>
> SideSource's caching abilities **will only work on a custom domain (apex domain or subdomain will work).** Caching will greatly reduce the amount of time responses take to complete. This is a
> limitation of Cloudflare Workers; any requests to workers at `*.workers.dev` will be unable to use the Cache API. Please see the
> [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/runtime-apis/cache/) for more info.

First, ensure that you have node.js installed. You can either download it from [the official website](https://nodejs.org), or if you don't want to do a system-wide install, you can use a version
manager such as [nvm](https://nvm.sh).

Next, install wrangler, the CLI used for Cloudflare Workers:

```sh
npm install -g wrangler
```

If you have a Cloudflare account, you can login with it using:

```sh
wrangler login
```

However, this is not required until you want to deploy your worker.

---

### 1. Creating the worker

Create a new worker:

```sh
wrangler init <worker name>
```

Use these options:

-   package.json: Yes
-   TypeScript: Yes
-   Worker type: Fetch handler
-   Tests: No

Then, `cd <worker name>`.

You now have 2 options:

1. If you only want 1 source, go to [here](#2-making-a-single-source-worker)
2. If you want multiple sources on different routes (for example, for different release channels), go to [here](#2-making-a-multi-source-worker)

---

### 2. Making a single source worker

First, install the required dependencies:

```sh
npm i sidesource
```

Next, open `src/index.ts` and change it to this:

```ts
import { makeSourceHandler } from "sidesource";

export default makeSourceHandler({ <config> });
```

This will allow SideSource to handle all requests to the worker.

Next, [configure your source](#3-configuring-your-source).

---

### 2. Making a multi-source worker

First, install the required dependencies:

```sh
npm i sidesource itty-router
```

Next, open `src/index.ts` and change it to this:

```ts
import { Router } from "itty-router";
import { makeSourceHandler } from "sidesource";

const router = Router();

const stable = makeSourceHandler({ <stable config> });

router.all("/stable", stable.handle);
router.all("/preview/stable/:key", stable.handle);
router.all("/reset-cache/stable/:key", stable.resetCache(["/stable"])); // Make sure to include array of routes to reset cache for
// See for info on preview and reset-cache: https://sidestore.io/SideSource/#4-setting-up-a-key-for-preview-and-caching-resetting-functionality

const beta = makeSourceHandler({ <beta config> });

router.all("/beta", beta.handle);
router.all("/preview/beta/:key", beta.handle);
router.all("/reset-cache/beta/:key", beta.resetCache(["/beta"]));  // Make sure to include array of routes to reset cache for

// 404 fallback (must be added last so it doesn't overwrite other routes)
router.all("*", () => new Response("404 Not Found", { status: 404 }));

export default { fetch: router.handle };
```

This will use [itty-router](https://github.com/kwhitley/itty-router) to create 2 sources:

1. Available on `/stable`, preview at `/preview/stable/<key>`, reset cache at `/reset-cache/stable/<key>`
1. Available on `/beta`, preview at `/preview/beta/<key>`, reset cache at `/reset-cache/beta/<key>`

If you change the routes that the sources are available at, **make sure to update the reset cache route with the routes that it should reset the cache for**.

You can also make a source available at the base with the `/` route.

The sources can have separate configs, and therefore produce 2 different sources.

Next, [configure your source](#3-configuring-your-source).

---

### 3. Configuring your source

Possible values for a config are available at https://sidestore.io/SideSource/interfaces/Config.html. By default, a config expects a
[configURL](https://sidestore.io/SideSource/interfaces/Config.html#configURL), which is used to resolve a remote config.

Example for a config hosted in a GitHub repository:

```ts
makeSourceHandler({
    configURL: "github:SideStore/SideSource/example/config/stable.json",
});
```

> <span style="color: #c69026; font-weight: bold">**Warning**</span>
>
> If you are not using a custom domain (aka you are not using caching), **you should not use any `github:` URLs.** `github:` URLs resolve using GitHub's API, which is limited to 60 requests per hour
> without an access token, which will be exceeded very quickly without caching. Instead, use the URL that your browser goes to when viewing the "raw" contents of a file. (the raw equivalent of the
> above example URL would be https://github.com/SideStore/SideSource/raw/main/example/config/stable.json)

However, if you want to use the config you provide when calling `makeSourceHandler` and you don't want to use a remote config, you can set `remoteConfig` to `false`. **This is not recommended because
you will need to re-deploy your Cloudflare Worker every time you want to change the config.** If you use a remote config, you can just
[reset the cache](#4-setting-up-a-key-for-preview-and-caching-resetting-functionality) to fetch the latest config.

If you haven't already, you will probably want to upload your configs as JSON files to a github repository to use as remote configs. (JSON5 is supported.) There is also a JSON schema available:

```json
{
    "$schema": "https://github.com/SideStore/SideSource/raw/main/dist/schema.json"
}
```

If you have multiple release channels, you can reduce duplication configuration with a base config. Base configs are specified similarly to remote configs, and the same rules apply to them.

```ts
makeSourceHandler({
    configURL: "github:SideStore/SideSource/example/config/beta.json",
    baseConfigURL: "github:SideStore/SideSource/example/config/stable.json",
});
```

If your base config has this in it:

```json
{
    "source": {
        "name": "Example Source",
        "identifier": "com.example"
    }
}
```

And your normal config has this in it:

```json
{
    "source": {
        "name": "Example Source 2"
    }
}
```

It will result in this:

```json
{
    "source": {
        "name": "Example Source 2",
        "identifier": "com.example"
    }
}
```

---

### 4. Setting up a key for preview and caching resetting functionality

A secret key is required for the preview and caching setting functionality. It doesn't have to be very unique, but you probably don't want people knowing it because they could use it to use up the 60
github API requests you get per hour, and then cause inputs (or your whole source) to not work. A good way to get a secret key is by using a UUID, or just using the first 8 characters of one.

Now that you have your key, you need to allow the worker to see it. Create a `.dev.vars` file (you will want this to be in your .gitignore):

```sh
KEY=<your key>
```

You also need to give it to wrangler:

```sh
echo <your key> | wrangler secret put KEY
```

You should now be able to use the preview and reset cache functionality.

-   Preview: Go to `/preview/<your key>` (the route may be different if you are using a multi source setup). This will give you the source while bypassing cache. This is a good way to test before
    resetting the cache. You can tell if a source is bypassing the cache because if it is, the response will have a header named `X-Skipping-Cache`.
-   Reset cache: Go to `/reset-cache/<your key>` (the route may be different if you are using a multi source setup). This will reset the cache. If you have a GitHub Actions workflow you use for
    releasing your app, you can make a step that runs `curl <source url>/reset-cache/${{ secrets.KEY }}` after uploading a release. (make sure to add your key as a secret in the github actions
    settings)

---

### 5. Testing your source

To locally test your source, run:

```sh
wrangler dev --local
```

Your worker will start running and you can use the URL it gives you to test it.

---

### 6. Deploying your worker

To deploy your worker, run:

```sh
wrangler publish
```

If you want to use a custom domain for your worker (and allow SideSource to cache results), please see
[Cloudflare's documentation](https://developers.cloudflare.com/workers/platform/triggers/custom-domains/).

## Functions

Functions allow for dynamic logic that isn't possible to specify in a JSON config.

### Built in functions

As with any function, built in functions can be used with the format `function:<function name>`. Example of using [`makeUnc0verApp`](#makeunc0verapp) in a custom input:

```json
{
    "type": "custom",
    "functionName": "function:makeUnc0verApp"
}
```

This input would result in an unc0ver app being added into the source.

---

#### `ipaAssetUpdatedAtToSourceDate`

This function only works for GitHub input lambdas, and it parses the ipaAsset's updated_at property and turns it into a date compatible with source versions.

This function is currently the default for [dateLambda](https://sidestore.io/SideSource/interfaces/GitHubInput.html#dateLambda)

---

#### `makeUnc0verApp`

This function only works for custom inputs, and it parses https://unc0ver.dev/releases.json and creates an app from it.

---

### Making your own functions

Example functions: https://github.com/SideStore/SideSource/blob/main/example/src/functions.ts

Example usage of example functions: https://github.com/SideStore/SideSource/blob/main/example/config/stable.json#L13

You can pass your own functions as the second parameter to `makeSourceHandler` and `makeSource`. Example:

```ts
makeSourceHandler({
    <your config>
}, {
    myFunction: () => "example"
});
```

Then, you can use this function in properties that allow it as `function:myFunction`.

---

#### Arguments

Some properties will give arguments to functions it runs. For example, GitHub input lambdas will provide 2 arguments:

1. `release`: The release object from the GitHub API.
2. `ipaAsset`: The asset object that was picked using assetRegex.

Please check the documentation for more info on the specific arguments properties give.
