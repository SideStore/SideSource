import { components } from "@octokit/openapi-types";
import get from "lodash/get";
import { App } from "sidestore-source-types";

import { invalidLambdaReturn, invalidPropertyPath, invalidPropertyPathResult, functionNotFound, noAsset } from "#/errors";
import { info } from "#/logging";
import { GitHubInput } from "#/struct/typedoc";
import { Mandatory, merge, Functions } from "#/util";

import { getLatestRelease, getReleaseByTag } from "./api";

export async function makeAppFromGitHubInput({ repo, tag, allowPrereleases, assetRegex, appMetadata, ...input }: Mandatory<GitHubInput>, functions: Functions) {
    const release = tag == "latest" ? await getLatestRelease(repo, allowPrereleases) : await getReleaseByTag(repo, tag);

    let ipaAsset: components["schemas"]["release-asset"] | undefined;

    for (const asset of release.assets) {
        const match = asset.name.match(assetRegex);
        if (match && match.length > 0) {
            ipaAsset = asset;
            continue;
        }
    }

    if (!ipaAsset) throw noAsset(assetRegex);

    info(`Found release asset (${ipaAsset.name})`);

    async function runLambda(name: string) {
        let lambda = (input as any)[name] as string;
        if (lambda.startsWith("function:")) {
            lambda = lambda.replace("function:", "");

            if (!(lambda in functions)) throw functionNotFound(lambda);
            const result = await functions[lambda]!(release, ipaAsset!);
            if (!result || typeof result !== "string") throw invalidLambdaReturn(lambda, result);
            return result;
        }

        let value: any;
        if (lambda.startsWith("release.")) value = get(release, lambda.replace("release.", ""));
        else if (lambda.startsWith("ipaAsset.")) value = get(ipaAsset, lambda.replace("ipaAsset.", ""));
        else throw invalidPropertyPath(lambda, name);

        if (!value) throw invalidPropertyPathResult(lambda, name, value);
        return value.toString() || JSON.stringify(value);
    }

    const app = merge<App>(appMetadata, {
        versions: [
            {
                version: await runLambda("versionLambda"),
                date: await runLambda("dateLambda"),
                localizedDescription: await runLambda("changelogLambda"),
                downloadURL: ipaAsset.browser_download_url,
                size: ipaAsset.size,
            },
        ],
    });

    // Copy version data to legacy properties
    app.version = app.versions[0]!.version;
    app.versionDate = app.versions[0]!.date;
    app.versionDescription = app.versions[0]!.localizedDescription;
    app.downloadURL = app.versions[0]!.downloadURL;
    app.size = app.versions[0]!.size;

    return app;
}
