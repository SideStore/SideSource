import { components } from "@octokit/openapi-types";

const sideStoreRepo = "SideStore/SideStore";
const maxCommitMessageLength = 50; // This controls what the commit message will be trimmed to when making nightly changelogs
const prefix = "Welcome to the next generation of sideloading! This update fixes and adds the following:"; // Stable auto-generated changelog prefix

async function getCommitMessage(repo: string, sha: string) {
    return (
        (await (
            await fetch(`https://api.github.com/repos/${repo}/commits/${sha}`, {
                headers: { "User-Agent": `https://github.com/SideStore/SideSource example` },
            })
        ).json()) as components["schemas"]["commit"]
    ).commit.message;
}

export default {
    async changelog(release: components["schemas"]["release"]) {
        if (release.body!.toLowerCase().includes("changelog")) {
            // yes I know this is a horrible way to parse for changelog
            return prefix + "\n" + release.body!.substring(release.body!.indexOf("## Changelog")).split("## Changelog")[1].split("## Build Info")[0].trim().replaceAll("-", "•").replaceAll("\r", "");
        } else {
            const commitSHA = release.body!.split("## Build Info").at(-1)!.split("`")[5];
            const origCommitMessage = (await getCommitMessage(sideStoreRepo, commitSHA)).split("\n")[0];
            let commitMessage = origCommitMessage.substring(0, maxCommitMessageLength).trim();
            if (origCommitMessage.length > 50) commitMessage += "...";
            return `${commitMessage} (https://github.com/${sideStoreRepo}/commit/${commitSHA})`;
        }
    },
    date(release: components["schemas"]["release"]) {
        return release.body!.split("## Build Info").at(-1)!.split("`")[3];
    },
    version(release: components["schemas"]["release"]) {
        return release.body!.split("## Build Info").at(-1)!.split("`")[7];
    },
} as Record<string, (...args: any) => unknown>;
