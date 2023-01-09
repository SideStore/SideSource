import { RouterType } from "itty-router";

interface Options {
    camelCase?: boolean | null;
    entryPoint?: string | boolean | null;
    entryPointMatch?: Function | null;
}

declare module "esbuild-plugin-glob-import" {
    export default function (options: Options): Plugin;
}
