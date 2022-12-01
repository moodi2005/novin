import { NovinStorage, DocumentObject } from 'https://cdn.jsdelivr.net/gh/moodi2005/novin@30fe1e0/packages/storage/deno/storage.ts';


interface rejestered extends DocumentObject {
    group: string;
    private:boolean;
    path:string;
    type:string;
    level:number;
}

export const db_rejestered = new NovinStorage<rejestered>({
    name: 'reocrds',
    path: './db',
    logInConsole:false
});
