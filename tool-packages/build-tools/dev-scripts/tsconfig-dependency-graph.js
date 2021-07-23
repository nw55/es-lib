'use strict';

const path = require('path');
const fs = require('fs').promises;
const stripJsonComments = require('strip-json-comments');

async function* iterateFilesRecursive(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const file = path.resolve(dir, entry.name);
        if (entry.isDirectory())
            yield* iterateFilesRecursive(file);
        else
            yield file;
    }
}

async function processFile(baseDir, file, nodes, edges) {
    const name = path.relative(baseDir, file);
    const pathInfo = path.parse(file);
    if (pathInfo.ext !== '.json')
        return;

    const fileContent = JSON.parse(stripJsonComments(await fs.readFile(file, 'utf-8')));

    nodes.push(name);

    if (fileContent.extends) {
        const extendsName = path.relative(baseDir, path.resolve(pathInfo.dir, fileContent.extends));
        edges.push([extendsName, name]);
    }
}

async function main() {
    const tsconfigDir = path.resolve(__dirname, '../tsconfig');
    const outputFile = path.resolve(tsconfigDir, 'dependencies.gv');

    const nodes = [];
    const edges = [];

    for await (const file of iterateFilesRecursive(tsconfigDir))
        await processFile(tsconfigDir, file, nodes, edges);

    const nodeMap = new Map(nodes.map((name, index) => [name, index]));

    const fileContents = [
        'digraph tsconfig {',
        'rankdir=LR;'
    ];

    for (const [node, index] of nodeMap)
        fileContents.push(`N${index} [label="${node.replace(/[/\\]/g, ' / ').replace(/\.json$/, '')}"];`);
    for (const [from, to] of edges)
        fileContents.push(`N${nodeMap.get(from)} -> N${nodeMap.get(to)};`);

    fileContents.push('}');

    await fs.writeFile(outputFile, fileContents.join('\n'), 'utf-8');
}

main();
