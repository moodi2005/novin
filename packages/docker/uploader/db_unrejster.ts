import { NovinStorage, DocumentObject } from 'https://cdn.jsdelivr.net/gh/moodi2005/novin@30fe1e0/packages/storage/deno/storage.ts';


interface unRejester extends DocumentObject {
    name: string;
    filename: string;
    contentType: string;
    size: number;
}

export const db_unRejester = new NovinStorage<unRejester>({
    name: 'unRejester',
    path: './db',
    logInConsole:false
});
