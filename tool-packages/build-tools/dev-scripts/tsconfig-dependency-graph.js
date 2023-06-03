import fs from 'fs/promises';
import { dirname, parse, relative, resolve } from 'path';
import stripJsonComments from 'strip-json-comments';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function relativeFileName(base, file) {
    const result = relative(base, file);
    return result.replace(/\\/g, '/').replace(/\.json$/, '');
}

async function* iterateFilesRecursive(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const file = resolve(dir, entry.name);
        if (entry.isDirectory())
            yield* iterateFilesRecursive(file);
        else
            yield file;
    }
}

async function processFile(baseDir, file, nodes, edges) {
    const name = relativeFileName(baseDir, file);
    const pathInfo = parse(file);
    if (pathInfo.ext !== '.json')
        return;

    const fileContent = JSON.parse(stripJsonComments(await fs.readFile(file, 'utf-8')));

    nodes.push(name);

    const extendsList = fileContent.extends ? Array.isArray(fileContent.extends) ? fileContent.extends : [fileContent.extends] : [];
    for (const extendsEntry of extendsList) {
        const extendsName = relativeFileName(baseDir, resolve(pathInfo.dir, extendsEntry));
        edges.push([extendsName, name]);
    }
}

const specialNodeAttributes = {
    '_base/base': 'fontcolor=red',
    '_base/lib': 'color=blue'
};

async function main() {
    const tsconfigDir = resolve(__dirname, '../tsconfig');
    const outputFile = resolve(tsconfigDir, 'dependencies.gv');

    const nodes = [];
    const edges = [];

    for await (const file of iterateFilesRecursive(tsconfigDir))
        await processFile(tsconfigDir, file, nodes, edges);

    const nodeMap = new Map(nodes.map((name, index) => [name, index]));

    const fileContents = [
        'digraph tsconfig {',
        'rankdir=LR;'
    ];

    const specialNodes = Object.fromEntries(Object.keys(specialNodeAttributes).map(specialNode => [specialNode, new Set()]));
    for (const [from, to] of edges) {
        if (specialNodes[from])
            specialNodes[from].add(to);
    }
    for (const [node, index] of nodeMap) {
        const attributes = [
            `label="${node.replace(/\//g, ' / ')}"`,
            ...Object.entries(specialNodeAttributes)
                .filter(([specialNode, attribute]) => node === specialNode || specialNodes[specialNode].has(node))
                .map(([specialNode, attribute]) => attribute)
        ];
        fileContents.push(`N${index} [${attributes.join(',')}];`);
    }
    for (const [from, to] of edges) {
        if (!specialNodeAttributes[from])
            fileContents.push(`N${nodeMap.get(from)} -> N${nodeMap.get(to)};`);
    }

    fileContents.push('}');

    await fs.writeFile(outputFile, fileContents.join('\n'), 'utf-8');
}

main();
