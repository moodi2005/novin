import { NovinStorage, DocumentObject } from '@webkn/storage/storage.js';

interface file extends DocumentObject {
    name: string;
    type:string;
    public: boolean;
}

export const db = new NovinStorage<file>({ name: 'files' });