import chalk from "chalk";

import { pretty } from "./util/json";

export const invalidGitHubConfigURL = (configURL: string) =>
    `Invalid GitHub configURL. Please make sure it is in the form \`${chalk.red("github:{user or org}/{repo name}/{file path}")}\`. If you need to specify a branch, use this format: \`${chalk.red(
        "github:{user or org}/{repo name}/{file path}?{branch}",
    )}\`.
configURL: ${chalk.reset.red("github:" + configURL)}`;

export const failedToParseRemoteConfig = (text: string) => `Failed to parse remote config. Please make sure it is compatible with JSON5.
Remote config: ${chalk.reset.red(text)}`;

export const invalidConfig = (config: object) => `Invalid config. Make sure you have all the required properties and that they are the correct types.
Config: ${chalk.reset.yellow(pretty(config))}`;

export const invalidSourceMetadata = (config: object) => `Invalid source metadata. Make sure you have all the required properties and that they are the correct types.
Config: ${chalk.reset.yellow(pretty(config))}`;

export const githubApiError = (json: object) => `GitHub API Error: ${chalk.red(pretty(json))}`;

export const noAsset = (assetRegex: string) => `Couldn't find asset that matches regex \`${chalk.red(assetRegex)}\``;

export const invalidLambdaReturn = (name: string, output: any) => `Function \`${chalk.red(name)}\` did not return a valid string (returned \`${chalk.red(JSON.stringify(output))}\`)`;

export const functionNotFound = (functionName: string) =>
    `Couldn't find a function called \`${chalk.red(functionName)}\`. If it's not a built in function, make sure to specified it when called makeSourceHandler or makeSource`;

export const invalidPropertyPath = (path: string, lambdaName: string) =>
    `The property path specified in \`${chalk.red(lambdaName)}\` seems to be invalid. Make sure it is referencing the \`release\` or \`ipaAsset\` variable. Path: \`${chalk.red(path)}\``;

export const invalidPropertyPathResult = (path: string, lambdaName: string, result: string) =>
    `The property path specified in \`${chalk.red(lambdaName)}\` gave an invalid result (\`${chalk.red(
        result,
    )}\`). Make sure it is referencing a valid property inside the \`release\` or \`ipaAsset\` variable. Path: \`${chalk.red(path)}\``;

export const failedToParseSource = (text: string) => `Failed to parse source.
Source: ${chalk.reset.red(text)}`;

export const invalidCustomFunctionReturn = (name: string, output: any) =>
    `Function \`${chalk.red(name)}\` did not return a valid object with an apps array (returned \`${chalk.red(JSON.stringify(output))}\`)`;

export const invalidAppsOrNewsFromCustomFunction = (name: string, output: any) =>
    `Function \`${chalk.red(name)}\` returned invalid apps or news. Please make sure the function is producing valid app and news objects (returned \`${chalk.red(JSON.stringify(output))}\`)`;

export const invalidAppsOrNewsFromRawInput = () => `Please make sure the raw input has valid app and news objects`;

export const noReleasesFound = "No releases found when searching for latest release";
export const typeNotInInput = `Type was not found in input, skipping`;
export const invalidInput = "Invalid input. Make sure you have all the required properties and that they are the correct types";
export const unknownType = `Unknown type. Make sure you have set the \`${chalk.red("type")}\` property to the correct type for the input you are using`;
