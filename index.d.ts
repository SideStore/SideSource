interface Options {
    camelCase?: boolean | null;
    entryPoint?: string | boolean | null;
    entryPointMatch?: Function | null;
}

declare module "esbuild-plugin-glob-import" {
    // @ts-ignore
    export default function (options: Options): Plugin;
}
