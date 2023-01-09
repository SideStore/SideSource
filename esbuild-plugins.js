import globImport from "esbuild-plugin-glob-import";

export default function () {
    return [
        globImport({
            camelCase: false,
            entryPoint: null,
            entryPointMatch: null,
        }),
    ];
}
