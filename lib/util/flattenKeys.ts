// https://github.com/lodash/lodash/issues/2240#issuecomment-995160298
// Modified for typescript and fixed some edge cases
export function flattenKeys(object: Record<string, any>, _pathPrefix = ""): Record<string, any> {
    if (!object || typeof object !== "object") {
        return [{ [_pathPrefix]: object }];
    }

    const prefix = _pathPrefix ? (Array.isArray(object) ? _pathPrefix : `${_pathPrefix}.`) : "";

    const objectKeys = Object.keys(object);

    if (objectKeys.length < 1) {
        const tmp: Record<string, any> = {};
        tmp[_pathPrefix] = object;
        return tmp;
    }
    return objectKeys.flatMap((key) => flattenKeys(object[key], Array.isArray(object) ? `${prefix}[${key}]` : `${prefix}${key}`)).reduce((acc, path) => ({ ...acc, ...path }));
}
