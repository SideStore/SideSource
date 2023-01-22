import set from "lodash/set";

import { flattenKeys } from "./flattenKeys";

export function merge<T>(baseObject: any, newValues: Partial<T>): T {
    const keys = flattenKeys(newValues);

    for (const entry of Object.entries(keys)) {
        // Edge case for arrays
        if (Array.isArray(entry[1])) baseObject[entry[0]] = entry[1];
        else set(baseObject, entry[0], entry[1]);
    }

    return baseObject as T;
}
