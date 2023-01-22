const ts = require("typescript");

/**
 * @return {ts.TransformerFactory<ts.SourceFile>}
 */
const transformer = (_) => {
    return (context) => (sourceFile) => {
        /**
         * @param {ts.Node} node
         * @returns {ts.Node}
         */
        const visitor = (node) => {
            if (ts.isImportDeclaration(node)) {
                try {
                    // Remove imports to typia since they are unused and increase bundle size
                    if (node.moduleSpecifier.getText().includes("typia")) return undefined;
                } catch (_) {}
            }

            return ts.visitEachChild(node, visitor, context);
        };

        return ts.visitNode(sourceFile, visitor);
    };
};

module.exports = transformer;
