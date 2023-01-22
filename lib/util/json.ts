import json5 from "json5";

const indentation = "    ";

export const pretty = (object: unknown, indent = 1) => {
    let output = json5.stringify(object, null, indentation.repeat(indent));
    // Add an indent to closing curly brace/bracket
    if (indent > 1) return output.replace(new RegExp("}$"), indentation.repeat(indent - 1) + "}").replace(new RegExp("]$"), indentation.repeat(indent - 1) + "]");
    return output;
};
