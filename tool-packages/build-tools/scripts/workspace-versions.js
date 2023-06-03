import { Configuration, Project, structUtils } from '@yarnpkg/core';
import { ppath } from '@yarnpkg/fslib';
import semver from 'semver';

function compareVersions(a, b) {
    if (a === b)
        return '=';
    if (!a || !b)
        return ' ';
    const cmp = semver.compare(a, b);
    return cmp < 0 ? '<' : cmp > 0 ? '>' : '=';
}

export default async function main() {
    const cwd = ppath.cwd();
    const configuration = await Configuration.find(cwd, null);
    // eslint-disable-next-line no-unused-vars
    const { project, workspace } = await Project.find(configuration, cwd);

    console.info(`                              latest       local `);
    const children = workspace.getRecursiveWorkspaceChildren();
    for (const child of children) {
        const ident = child.manifest.name;
        const identString = structUtils.stringifyIdent(ident);
        const localVersion = child.manifest.version;
        const result = await (await fetch(`https://registry.npmjs.org/${identString}/latest`)).json();
        const latestVersion = result.version ?? '';
        const compareResult = compareVersions(latestVersion, localVersion);
        console.info(`${identString.padEnd(25)} ${latestVersion.padStart(10)} ${compareResult} ${localVersion.padStart(10)}`);
    }
}
