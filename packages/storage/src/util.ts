import { existsSync, mkdirSync, writeFileSync, renameSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type { JSON } from './type.js';

/**
 * Enhanced read json file.
 * @example
 * const fileContent = readJsonFile('./file.json');
 */
export function readJsonFile<T>(path: string): T[] {

    let fileContent: string;
    try {
        fileContent = readFileSync(path, { encoding: 'utf-8' });
    }
    catch (err) {
        throw new Error('read_file_failed');
    }

    try {
        const data = JSON.parse(fileContent) as T[];
        return data;
    }
    catch (err) {
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
    catch (err) {
        throw new Error('stringify_failed');
    }

    if (existsSync(path)) {
        try {
            renameSync(path, path + '.bk');
        }
        catch (err) {
            console.error('cannot rename file!');
        }
    }
    else {
        try {
            mkdirSync(dirname(path), { recursive: true });
        }
        catch (err) {
            throw new Error('make_dir_failed');
        }
    }

    try {
        writeFileSync(path, jsonContent, { encoding: 'utf-8', flag: 'w' });
    }
    catch (err) {
        throw new Error('write_file_failed');
    }
}

/**
 * Start Storage.
 * @example
 * startStorage('./db/novin.json')
 */
export function startStorage(path: string) {
    console.log('\x1b[33m','\n<<==============Novin Storage=============>>');
    if (!existsSync(path)) {
        console.log('Welcome To Novin Storage,this is a json file database');
        try {
            mkdirSync(dirname(path), { recursive: true });
            try {
                writeFileSync(path, '[]', { encoding: 'utf-8', flag: 'w' });
                console.log('\x1b[32m','Creat File done successfully');
                console.log('\x1b[31m',`in Path \n: ${path}`);
            } catch (error) {
                throw new Error('touch_file');
            }
        }
        catch (err) {
            throw new Error('make_dir_failed');
        }
    } else {
        console.log('\x1b[32m','The File 👌');
    }
    console.log('\x1b[33m','\n storage is ready to receive any amount of data     (👍 ᵔ︣ ͜ʖ ᵔ︣ )👍');
}