import { NovinStorage } from '@webkn/storage';

import type {DocumentObject} from '@webkn/storage';

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
