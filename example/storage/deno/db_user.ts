import { NovinStorage } from '../../../packages/storage/deno/storage.ts';

import type {DocumentObject} from '../../../packages/storage/deno/type.ts';

interface user extends DocumentObject {
    firstName:string,
    lastName:string,
    userName:string,
    email:string,
    profile:string,
    lastLogin:string,
}

export const user = new NovinStorage<user>({
    name:'user',
    path:'./db',
})
