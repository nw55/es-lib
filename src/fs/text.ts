import { json, PartialJsonValue, ReadonlyJsonValue } from '@nw55/common';
import { CheckableType, requireType } from '@nw55/type-checking';
import { promises as fs } from 'fs';
import { isNodeError } from '../common';

export async function tryReadTextFile(file: string) {
    try {
        return await fs.readFile(file, 'utf8');
    }
    catch (e: unknown) {
        if (isNodeError(e, 'ENOENT'))
            return null;
        throw e;
    }
}

export async function tryReadJsonFile(file: string) {
    const content = await tryReadTextFile(file);
    if (content === null)
        return null;
    return json.decode(content);
}

export async function tryReadJsonFileChecked<T extends PartialJsonValue>(file: string, type: CheckableType<T>) {
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

export async function writeJsonFile(file: string, data: ReadonlyJsonValue) {
    const content = json.encode(data, 2);
    await writeTextFile(file, content);
}
