import { components } from "@octokit/openapi-types";
import chalk from "chalk";
import set from "lodash/set";
import { App, Source } from "sidestore-source-types";

import { configDefaults, githubInputDefaults, sourceInputDefaults } from "#/defaults";
import {
    functionNotFound,
    invalidAppsOrNewsFromCustomFunction,
    invalidAppsOrNewsFromRawInput,
    invalidConfig,
    invalidCustomFunctionReturn,
    invalidInput,
    invalidSourceMetadata,
    typeNotInInput,
    unknownType,
} from "#/errors";
import { error, info } from "#/logging";
import { resolveRemoteConfig } from "#/remoteConfig";
import { Config, GitHubInput, SourceInput } from "#/struct/typedoc";
import { flattenKeys, pretty, Mandatory, merge, Functions } from "#/util";
import { isApp, isConfig, isCustomInput, isGitHubInput, isNews, isRawInput, isSource, isSourceInput } from "#/util/is";

import { makeAppFromGitHubInput } from "./inputs/github";
import { makeAppFromSourceInput } from "./inputs/source";
import { copyToLegacyProperties } from "./legacyProperties";

export async function makeSource(config: Config, functions: Functions = {}) {
    config = configDefaults(config);

    if (config.remoteConfig) {
        config = await resolveRemoteConfig(config.configURL!);
    } else info("Not using remote config");

    if (config.baseConfigURL) {
        const baseConfig = await resolveRemoteConfig(config.baseConfigURL, "base config");
        config = merge<Config>(baseConfig, config);
        info("Successfully applied base config");
    }

    if (!isConfig(config)) throw invalidConfig(config);
    if (!config.source.name || !config.source.identifier) throw invalidSourceMetadata(config);

    const source = merge<Source>(config.source, {
        apps: [] as App[],
        news: config.news || [],
    } as Source);

    functions = merge<Functions>(functions, {
        ipaAssetUpdatedAtToSourceDate: (_, ipaAsset) => {
            const date = new Date((ipaAsset as components["schemas"]["release-asset"]).updated_at);
            return date.getUTCFullYear() + "-" + ("00" + (date.getUTCMonth() + 1)).slice(-2) + "-" + ("00" + date.getUTCDate()).slice(-2);
        },
        makeUnc0verApp: async () => {
            const release = ((await (await fetch("https://unc0ver.dev/releases.json")).json()) as any)[0];

            return {
                apps: [
                    {
                        name: "unc0ver",
                        bundleIdentifier: "science.xnu.undecimus",
                        developerName: "Pwn20wnd",
                        subtitle: "The most advanced jailbreak tool.",
                        iconURL: "https://i.imgur.com/5aehDxj.png",
                        tintColor: "#101216",
                        screenshotURLs: ["https://i.imgur.com/ItMaRRV.png", "https://i.imgur.com/bjzyqpY.png", "https://i.imgur.com/3TMGkaO.png", "https://i.imgur.com/gTYfncm.png"],
                        localizedDescription: `unc0ver is an advanced jailbreaking tool for iOS devices. Jailbreaking with unc0ver unlocks the true power of your iDevice. Customize the appearance of your device, gain full control over how your device operates, obtain access to hidden features of iOS, and more.

Compatibility:
* unc0ver supports iOS 11.0 through to iOS 14.3 (Excluding 13.5.1 and 13.3.1)

Stability:
* Utilizing the latest stable APT and Mobile Substrate, stability is guaranteed.

Security:
* Utilizing native system sandbox exceptions, security remains intact while enabling access to jailbreak files.`,

                        versions: [
                            {
                                version: release.tag_name.replace("v", ""),
                                date: release.published_at,
                                localizedDescription: `# ${release.name}\n\n${release.body}`,
                                downloadURL: `https://unc0ver.dev${release.browser_download_url}`,
                                size: 0,
                            },
                        ],
                        version: release.tag_name.replace("v", ""),
                        versionDate: release.published_at,
                        versionDescription: `# ${release.name}\n\n${release.body}`,
                        downloadURL: `https://unc0ver.dev${release.browser_download_url}`,
                        size: 0,
                    },
                ] as App[],
            };
        },
    });

    console.log();
    for (let input of config.inputs) {
        try {
            if (!("type" in input)) throw typeNotInInput;

            const sendArguments = () =>
                info(
                    `Using ${input.type} input with arguments:${Object.entries(input)
                        .map(([key, val]) => `\n    ${key}: ${pretty(val, 2)}`)
                        .join("")}`,
                );
            switch (input.type) {
                case "github": {
                    input = githubInputDefaults(input);
                    if (!isGitHubInput(input)) throw invalidInput;
                    if (!input.repo || !input.tag || !input.assetRegex || !input.dateLambda || !input.versionLambda || !input.changelogLambda) throw invalidInput;

                    sendArguments();
                    source.apps.push(await makeAppFromGitHubInput(input as Mandatory<GitHubInput>, functions));
                    break;
                }
                case "source": {
                    input = sourceInputDefaults(input);
                    if (!isSourceInput(input)) throw invalidInput;
                    if (!input.url) throw invalidInput;

                    sendArguments();
                    const data = await makeAppFromSourceInput(input as Mandatory<SourceInput>);
                    source.apps.push(...data.apps);
                    source.news!.push(...data.news);
                    break;
                }
                case "raw": {
                    if (!isRawInput(input)) throw invalidInput;

                    sendArguments();

                    if (!isApp(input.app)) throw invalidAppsOrNewsFromRawInput();
                    copyToLegacyProperties(input.app);
                    source.apps.push(input.app);

                    if ("news" in input) {
                        for (const news of input.news) if (!isNews(news)) throw invalidAppsOrNewsFromRawInput();
                        source.news!.push(...input.news);
                    }
                    break;
                }
                case "custom": {
                    if (!isCustomInput(input)) throw invalidInput;
                    if (!input.functionName) throw invalidInput;

                    sendArguments();
                    const name = input.functionName.replace("function:", "");

                    if (!(name in functions)) throw functionNotFound(name);
                    const result = await functions[name]!();
                    if (!result || typeof result != "object" || !("apps" in result)) throw invalidCustomFunctionReturn(name, result);

                    for (const app of result.apps) {
                        if (!isApp(app)) throw invalidAppsOrNewsFromCustomFunction(name, result);
                        copyToLegacyProperties(app);
                    }
                    source.apps.push(...result.apps);

                    if ("news" in result) {
                        for (const news of result.news) if (!isNews(news)) throw invalidAppsOrNewsFromCustomFunction(name, result);
                        source.news!.push(...result.news);
                    }
                    break;
                }
                default: {
                    throw unknownType;
                }
            }

            info(`Finished using input with type ${input.type}`);
            console.log();
        } catch (e) {
            error(`Got error when using an input so the input will be skipped and not added to the source. Error: ${e}
    Input: ${chalk.reset.yellow(pretty(input, 2))}`);
            console.log();
        }
    }

    if (config.overrides) {
        info("Applying overrides");
        for (const entry of Object.entries(flattenKeys(config.overrides))) {
            info(`    Setting \`${entry[0]}\` to \`${entry[1]}\``);
            set(source, entry[0], entry[1]);
        }
        info("Done applying overrides");
    }

    if (!isSource(source)) error(chalk.yellowBright`WARNING: The source does not seem to be valid! SideStore/AltStore users may experience issues with it.`);

    return source;
}

makeSource({
    configURL: "https://github.com/SideStore/SideSource/raw/wip/example/config/stable.json",
}).then(console.log);
