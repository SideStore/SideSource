/** https://github.com/moxystudio/js-deep-for-each (slightly modified and adapted for typescript) */
import isPlainObject from "lodash/isPlainObject";

type Iterator = (val: any, key: string | number, currentObj: any, currentPath: string) => unknown;

function forEachObject(obj: Record<string, any>, fn: Iterator, path: string) {
    for (const key in obj) {
        const deepPath = path ? `${path}.${key}` : key;

        // Note that we always use obj[key] because it might be mutated by forEach
        fn.call(obj, obj[key], key, obj, deepPath);

        forEach(obj[key], fn, deepPath);
    }
}

function forEachArray(array: any[], fn: Iterator, path: string) {
    array.forEach((value, index, arr) => {
        const deepPath = `${path}[${index}]`;

        fn.call(arr, value, index, arr, deepPath);

        // Note that we use arr[index] because it might be mutated by forEach
        forEach(arr[index], fn, deepPath);
    });
}

export default function forEach(value: Record<string, any>, fn: Iterator, path: string = "") {
    if (Array.isArray(value)) {
        forEachArray(value, fn, path);
    } else if (isPlainObject(value)) {
        forEachObject(value, fn, path);
    }

    return value;
}
