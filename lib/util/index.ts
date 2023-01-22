import json5 from "json5";
import set from "lodash/set";

export type Mandatory<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};

export type Functions = Record<string, (...args: unknown[]) => any>;

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

const indentation = "    ";

export const pretty = (object: unknown, indent = 1) => {
    let output = json5.stringify(object, null, indentation.repeat(indent));
    // Add an indent to closing curly brace/bracket
    if (indent > 1) return output.replace(new RegExp("}$"), indentation.repeat(indent - 1) + "}").replace(new RegExp("]$"), indentation.repeat(indent - 1) + "]");
    return output;
};

export function merge<T>(baseObject: any, newValues: Partial<T>): T {
    const keys = flattenKeys(newValues);

    for (const entry of Object.entries(keys)) {
        // Edge case for arrays
        if (Array.isArray(entry[1])) baseObject[entry[0]] = entry[1];
        else set(baseObject, entry[0], entry[1]);
    }

    return baseObject as T;
}
