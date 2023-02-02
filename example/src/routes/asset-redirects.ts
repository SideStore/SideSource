import { RouterType } from "itty-router";

const redirect = (url: string) => () => new Response("302 Found", { status: 302, headers: { Location: url } });

export default function (router: RouterType) {
    // Redirects for assets that used to be hosted in the apps.json repo
    router.all("/apps/sidestore/v0.1.1/icon.png", redirect("https://sidestore.io/assets/icon.png"));

    router.all("/apps/sidestore/v0.1.1/browse-dark.png", redirect("https://sidestore.io/assets/screenshots/dark/browse.png"));
    router.all("/apps/sidestore/v0.1.1/apps-dark.png", redirect("https://sidestore.io/assets/screenshots/dark/apps.png"));
    router.all("/apps/sidestore/v0.1.1/news-dark.png", redirect("https://sidestore.io/assets/screenshots/dark/news.png"));

    router.all("/apps/sidestore/v0.1.1/browse-light.png", redirect("https://sidestore.io/assets/screenshots/light/browse.png"));
    router.all("/apps/sidestore/v0.1.1/apps-light.png", redirect("https://sidestore.io/assets/screenshots/light/apps.png"));
    router.all("/apps/sidestore/v0.1.1/news-light.png", redirect("https://sidestore.io/assets/screenshots/light/news.png"));
}
