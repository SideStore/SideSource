import chalk from "chalk";

import { pretty } from "./util";

class SideSourceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SideSourceError";
    }
}

export function err(strings: TemplateStringsArray, ...values: any[]) {
    let fullString = "";
    if (strings.length > 0 && values.length < 1) fullString += strings[0];
    for (let i = 0; i < values.length; i++) {
        fullString += strings[i] + values[i];
    }
    return new SideSourceError(fullString);
}

export const invalidGitHubConfigURL = (configURL: string) =>
    err`Invalid GitHub configURL. Please make sure it is in the form \`${chalk.red("github:{user or org}/{repo name}/{file path}")}\`. If you need to specify a branch, use this format: \`${chalk.red(
        "github:{user or org}/{repo name}/{file path}?{branch}",
    )}\`.
configURL: ${chalk.reset.red("github:" + configURL)}`;

export const failedToParseRemoteConfig = (text: string) => err`Failed to parse remote config. Please make sure it is compatible with JSON5.
Remote config: ${chalk.reset.red(text)}`;

export const invalidConfig = (config: object) => err`Invalid config. Make sure you have all the required properties and that they are the correct types.
Config: ${chalk.reset.yellow(pretty(config))}`;

export const invalidSourceMetadata = (config: object) => err`Invalid source metadata. Make sure you have all the required properties and that they are the correct types.
Config: ${chalk.reset.yellow(pretty(config))}`;

export const githubApiError = (json: object) => err`GitHub API Error: ${chalk.red(pretty(json))}`;

export const noAsset = (assetRegex: string) => err`Couldn't find asset that matches regex \`${chalk.red(assetRegex)}\``;

export const invalidLambdaReturn = (name: string, output: any) => err`Function \`${chalk.red(name)}\` did not return a valid string (returned \`${chalk.red(JSON.stringify(output))}\`)`;

export const functionNotFound = (functionName: string) =>
    err`Couldn't find a function called \`${chalk.red(functionName)}\`. If it's not a built in function, make sure to specified it when called makeSourceHandler or makeSource`;

export const invalidPropertyPath = (path: string, lambdaName: string) =>
    err`The property path specified in \`${chalk.red(lambdaName)}\` seems to be invalid. Make sure it is referencing the \`release\` or \`ipaAsset\` variable. Path: \`${chalk.red(path)}\``;

export const invalidPropertyPathResult = (path: string, lambdaName: string, result: string) =>
    err`The property path specified in \`${chalk.red(lambdaName)}\` gave an invalid result (\`${chalk.red(
        result,
    )}\`). Make sure it is referencing a valid property inside the \`release\` or \`ipaAsset\` variable. Path: \`${chalk.red(path)}\``;

export const failedToParseSource = (text: string) => err`Failed to parse source.
Source: ${chalk.reset.red(text)}`;

export const invalidCustomFunctionReturn = (name: string, output: any) =>
    err`Function \`${chalk.red(name)}\` did not return a valid object with an apps array (returned \`${chalk.red(JSON.stringify(output))}\`)`;

export const invalidAppsOrNewsFromCustomFunction = (name: string, output: any) =>
    err`Function \`${chalk.red(name)}\` returned invalid apps or news. Please make sure the function is producing valid app and news objects (returned \`${chalk.red(JSON.stringify(output))}\`)`;

export const invalidAppsOrNewsFromRawInput = err`Please make sure the raw input has valid app and news objects`;

export const noReleasesFound = err`No releases found when searching for latest release`;
export const typeNotInInput = err`Type was not found in input, skipping`;
export const invalidInput = err`Invalid input. Make sure you have all the required properties and that they are the correct types`;
export const unknownType = err`Unknown type. Make sure you have set the \`${chalk.red("type")}\` property to the correct type for the input you are using`;
export const keyNotSet = chalk.yellowBright`WARNING: There is no \`KEY\` secret set! Reset cache and preview functions will not work. Please see https://sidestore.io/sidesource/#4-setting-up-a-key-for-preview-and-caching-resetting-functionality for more info`;
