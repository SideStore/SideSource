import { App } from "sidestore-source-types";

export function copyToLegacyProperties(app: App) {
    if (!app.versions || app.versions.length < 1) return;
    if (!app.version) app.version = app.versions[0]!.version;
    if (!app.versionDate) app.versionDate = app.versions[0]!.date;
    if (!app.versionDescription) app.versionDescription = app.versions[0]!.localizedDescription;
    if (!app.downloadURL) app.downloadURL = app.versions[0]!.downloadURL;
    if (!app.size) app.size = app.versions[0]!.size;
}
