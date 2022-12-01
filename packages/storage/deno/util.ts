import { dirname } from "https://deno.land/std@0.163.0/path/mod.ts";


import type { JSON } from './type.ts';




/**
 * Enhanced read json file.
 * @example
 * const fileContent = readJsonFile('./file.json');
 */
export async function readJsonFile<T>(path: string): Promise<T[]> {

    let fileContent: string;

    try {
        const decoder = new TextDecoder("utf-8");
        const data = Deno.readFile(path);
        fileContent = decoder.decode(await data)
    }
    catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
            throw new Error('annot rename file!');
        }
        else {
            try {
                Deno.mkdirSync(dirname(path), { recursive: true });
            }
            catch (err) {
                throw new Error(err);
            }
            try {
            const encoder = new TextEncoder();
                const data = encoder.encode('[]');
                Deno.writeFileSync(path, data,{create:true});
                return [];
            }
            catch (err) {
                throw new Error(err);
            }  
        }      
    }

    try {
        const data = JSON.parse(fileContent) as T[];
        return data;
    }
    catch (_err) {
        throw new Error('invalid_json');
    }
}

/**
 * Enhanced write json file.
 * @example
 * writeJsonFile('./file.json', { a:1, b:2, c:3 });
 */
export function writeJsonFile<T extends JSON>(path: string, dataObject: T[], space?: string | number | undefined): void {

    let jsonContent;
    try {
        jsonContent = JSON.stringify(dataObject, null, space);
    }
    catch (_err) {
        throw new Error('stringify_failed');
    }

    try {
        Deno.renameSync(path, path + '.bk');
    }
    catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
            console.error('cannot rename file!');
        }
        else {
            try {
                Deno.mkdirSync(dirname(path), { recursive: true });
            }
            catch (_err) {
                throw new Error('make_dir_failed');
            }
        }
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(jsonContent);
        Deno.writeFileSync(path, data,{create:true});
    }
    catch (_err) {
        throw new Error('write_file_failed');
    }
}
