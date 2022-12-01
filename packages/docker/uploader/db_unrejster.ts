import { NovinStorage, DocumentObject } from '../../storage/deno/storage.ts';


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
