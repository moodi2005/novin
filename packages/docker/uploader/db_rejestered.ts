import { NovinStorage, DocumentObject } from '../../storage/deno/storage.ts';


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
