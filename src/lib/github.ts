import { components } from "@octokit/openapi-types";
import { Endpoints } from "@octokit/types";

import deepForEach from "./deepForEach";

const sideStoreRepo = "naturecodevoid/SideStore";
const workerRepo = "naturecodevoid/SideStore-source"; // Used for overrides
const maxCommitMessageLength = 50; // This controls what the commit message will be trimmed to when making nightly changelogs
const prefix = "Welcome to the next generation of sideloading! This update fixes and adds the following:"; // Stable auto-generated changelog prefix

export type Channel = "stable" | "beta" | "nightly";
export type ReleaseData = Endpoints["GET /repos/{owner}/{repo}/releases/tags/{tag}"]["response"]["data"];

const fetchApi = async (endpoint: string, prefix = "https://api.github.com", extraParams = {}) => {
    const data = await fetch(prefix + endpoint, { headers: { "User-Agent": "https://github.com/naturecodevoid/SideStore-source" }, ...extraParams });
    if (!prefix) {
        // Fix \n's in JSON breaking everything
        const json = JSON.parse((await data.text()).replaceAll("\\n", "\\\\n"));
        deepForEach(json, (val, key, obj) => {
            if (typeof val == "string") obj[key] = val.replaceAll("\\n", "\n");
        });
        return json;
    }
    return data.json<any>();
};

async function getLatestRelease(repo: string): Promise<ReleaseData> {
    return await fetchApi(`/repos/${repo}/releases/latest`);
}

async function getReleaseByTag(repo: string, tag: string): Promise<ReleaseData> {
    return await fetchApi(`/repos/${repo}/releases/tags/${tag}`);
}

async function getCommitMessage(repo: string, sha: string) {
    return ((await fetchApi(`/repos/${repo}/commits/${sha}`)) as Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"]).commit.message;
}

export async function getChannelData(channel: Channel) {
    return {
        release: channel == "stable" ? await getLatestRelease(sideStoreRepo) : await getReleaseByTag(sideStoreRepo, channel),
        overrides: await fetchApi(`https://github.com/${workerRepo}/raw/main/overrides/${channel}.json`, ""),
    };
}

function findIPAAsset(assets: components["schemas"]["release-asset"][]) {
    for (const asset of assets) {
        if (asset.name.endsWith(".ipa")) return asset;
    }
    return null;
}

export async function parseReleaseData(release: ReleaseData) {
    const buildInfo = release.body!.split("## Build Info").at(-1)!.split("`");

    const ipaAsset = findIPAAsset(release.assets)!;

    const parsed = {
        date: buildInfo[3],
        commitSHA: buildInfo[5],
        version: buildInfo[7],
        downloadURL: ipaAsset.browser_download_url,
        size: ipaAsset.size,
        changelog: "",
    };

    if (release.body!.toLowerCase().includes("changelog")) {
        // yes I know this is a horrible way to parse for changelog
        parsed.changelog =
            prefix + "\n" + release.body!.substring(release.body!.indexOf("## Changelog")).split("## Changelog")[1].split("## Build Info")[0].trim().replaceAll("-", "•").replaceAll("\r", "");
    } else {
        const origCommitMessage = (await getCommitMessage(sideStoreRepo, parsed.commitSHA)).split("\n")[0];
        let commitMessage = origCommitMessage.substring(0, maxCommitMessageLength).trim();
        if (origCommitMessage.length > 50) commitMessage += "...";
        parsed.changelog = `${commitMessage} (https://github.com/${sideStoreRepo}/commit/${parsed.commitSHA})`;
    }

    return parsed;
}
