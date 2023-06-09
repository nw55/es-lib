import { json, type PartialReadonlyJsonValue } from '@nw55/common';
import { CheckableType, requireType } from '@nw55/runtime-types';
import { promises as fs } from 'fs';
import { isNodeError } from '../common.js';

export async function tryReadTextFile(file: string) {
    try {
        return await fs.readFile(file, 'utf8');
    }
    catch (e) {
        if (isNodeError(e, 'ENOENT'))
            return null;
        // eslint-disable-next-line @typescript-eslint/no-throw-literal -- rethrow
        throw e;
    }
}

export async function tryReadJsonFile(file: string) {
    const content = await tryReadTextFile(file);
    if (content === null)
        return null;
    return json.decode(content);
}

export async function tryReadJsonFileChecked<T>(file: string, type: CheckableType<T>) {
    const content = await tryReadTextFile(file);
    if (content === null)
        return null;
    const parsed = json.decode(content);
    requireType(type, parsed);
    return parsed;
}

export async function writeTextFile(file: string, content: string) {
    await fs.writeFile(file, content, 'utf8');
}

export async function writeJsonFile(file: string, data: PartialReadonlyJsonValue) {
    const content = json.encode(data, 2);
    await writeTextFile(file, content);
}
