import { components } from "@octokit/openapi-types";

import { githubApiError, noReleasesFound } from "#/errors";

async function apiReq<T>(path: string, verifyPropertyName: string | null) {
    const res = await fetch(`https://api.github.com${path}`, { headers: { "User-Agent": "https://github.com/SideStore/SideSource" } });
    const json = (await res.json()) as object;
    if (verifyPropertyName && !(verifyPropertyName in json)) throw githubApiError(json);
    return json as T;
}

/* Releases */
export async function getLatestRelease(repo: string, includePrereleases: boolean = false) {
    if (!includePrereleases) return apiReq<components["schemas"]["release"]>(`/repos/${repo}/releases/latest`, "tag_name");

    const releases = await apiReq<components["schemas"]["release"][]>(`/repos/${repo}/releases`, null);
    if (releases.length < 1) throw noReleasesFound;

    for (const release of releases.sort((a, b) => {
        if (a == b) return 0;
        if (new Date(a.published_at!) < new Date(b.published_at!)) return 1;
        else return -1;
    })) {
        return release;
    }

    throw "Unknown error; it should be impossible to get here";
}
export const getReleaseByTag = (repo: string, tag: string) => apiReq<components["schemas"]["release"]>(`/repos/${repo}/releases/tags/${tag}`, "tag_name");

/* File contents */
export const getFileContents = async (repo: string, path: string, branch?: string | undefined) =>
    atob((await apiReq<components["schemas"]["content-file"]>(`/repos/${repo}/contents/${path}${branch ? `?ref=${branch}` : ""}`, "content")).content);
