import { resolve } from 'node:path';

import { alwatrRegisteredList, createLogger } from '@alwatr/logger';
import exitHook from 'exit-hook';


import { v4 as uuidv4 } from 'uuid';

import { readJsonFile, startStorage, writeJsonFile } from './util.js';

import type { DocumentObject, Keys, Values, NovinStorageConfig } from './type.js';

export { DocumentObject };

alwatrRegisteredList.push({
    name: '@novin/storage',
    version: '{{Novin_Storage}}',
});

/**
 * Elegant micro in-memory json-like storage with disk backed,
 * Fastest NoSQL Database written in tiny TypeScript ES module.
 *
 * @param {string} name Storage name like database table name.
 * @param {string} pathPrefix Saved file path prefix (default is `data`).
 *
 * Example:
 *
 * ```ts
 * import {NovinStorage, DocumentObject} from '@novin/storage';
 * interface User extends DocumentObject {...}
 * const db = new NovinStorage<User>('user-list');
 * ```
 */
export class NovinStorage<DocumentType extends DocumentObject> {
    /**
     * Storage name like database table name.
     */
    readonly name;

    /**
     * Storage file full path.
     */
    readonly storagePath;

    /**
     * Storage file full path.
     */
    readonly saveBeautiful;

    /**
    * Save debounce timeout for minimal disk iops usage.
    */
    readonly saveDebounce;

    /**
     * Set id auto
     */
    readonly autoId;
    /**
     * log in works.
     */
    readonly logInConsole;
    
    /**
     * The storage has unsaved changes that have not yet been saved.
     */
    hasUnsavedChanges = false;

    protected _logger;
    protected _storage: Array<DocumentType> = [];
    
    
    /**
     * All document in array.
     *
     * Contain `_last`!
     */
    get getAll(): Array<DocumentType> {
        return this._storage
    }


    constructor(config: NovinStorageConfig) {
        this._logger = createLogger(`novin-storage:${config.name}`, undefined, config.debug);
        this.forceSave = this.forceSave.bind(this);
        
        this.saveBeautiful = config.saveBeautiful || false;
        this.name = config.name;
        this.storagePath = resolve(`${config.path ?? './db'}/${config.name}.json`);
        this.saveDebounce = config.saveDebounce ?? 1000;
        this.logInConsole = config.logInConsole ?? true;
        this.autoId = config.autoId || true;
        
        this.start();

        exitHook(this.forceSave);
        this.load();
    }

    /**
     * Load process like open/parse storage file.
     */
    private load(): void {
        this._logger.logMethodArgs('load', { path: this.storagePath });
        this._storage = readJsonFile<DocumentType>(this.storagePath) ?? [];
    }
    
    /**
     * Get item document.
     * @param key The ket to select document.
     * @param value The value to select document.
     *
     * Example:
     *
     * ```ts
     * const novin = userStorage.getItem('userName','Novin');
     * ```
     */
    getItem(key: Keys<DocumentObject>, value: Values<DocumentObject>): DocumentType | null {
        const document = this._storage.filter((item) => item[key] === value);
        if (document.length !== 0) {
            return document[0]
        } else {
            return null
        }
    }
    
    /**
     * Get item document by id.
     * @param id The Id in document.
     *
     * Example:
     *
     * ```ts
     * const novin = userStorage.getItem('rdfd-erty-fdgh-wglm');
     * or
     * const novin = userStorage.getItem(['rdfd-erty-fdgh-wglm','rdfd-erty-fdgh-wglm']);
     * ```
     */
    getItemById(id:string|string[]): DocumentType | null {
        const document = this._storage.filter((item) => item._id === id);
        if (document.length !== 0) {
            return document[0]
        } else {
            return null
        }
    }
    
    /**
     * Get a All document .
     *
     * Example:
     *
     * ```ts
     * const all = userStorage.getall();
     * ```
     */
    getall(): DocumentType[] | null {
        return this._storage;
    }
    
    /**
     * Insert a document object in the storage.
     *
     * @param documentObject The document object to insert contain `_id`.
     *
     * Example:
     *
     * ```ts
     * userStorage.set({
     *   _id: 'user-1',
     *   foo: 'bar',
     * });
     * ```
     */
    set(documentObject: DocumentType): DocumentType {
        if (this.getItemById(documentObject._id) !== null) throw new Error('Exist Record');
        
        if (this.autoId) documentObject._id = uuidv4();
        
        
        this._storage.push(documentObject)
        
        this.save();

        if (this.logInConsole) this._logger.logMethodArgs('set', documentObject._id);
        return documentObject;
    }

    /**
     * Remove Item document by one field.
     * @param key The ket to select document.
     * @param value The value to select document.
     *
     * Example:
     *
     * ```ts
     * userStorage.remove('userName','Novin');
     * ```
     */
    removeItem(key: Keys<DocumentObject>, value: Values<DocumentObject>): boolean {
        const filtered = this._storage.filter((item) => item[key] !== value);
        
        if (filtered.length === this._storage.length) {
            return false
        } else {
            this._storage = filtered
            this.save();
            
            if (this.logInConsole) this._logger.logMethodArgs('remove', {key,value});
            return true;
        }
        
    }
    
    /**
     * Remove Item document by Id.
     * @param id id document.
     * 
     * Example:
     *
     * ```ts
     * userStorage.remove('dtmjk-dgmi-dgbhd-dsghd');
     * ```
     */
    removeItemByItem(id:string):boolean {
        const filtered = this._storage.filter((item) => item._id !== id);

        if (filtered.length === this._storage.length) {
            return false
        } else {
            this._storage = filtered
            this.save();

            if (this.logInConsole) this._logger.logMethodArgs('remove', id);
            return true;
        }
    }

    /**
     * Update document .
     * @param documentObject The document object.
     *
     * Example:
     *
     * ```ts
     * userStorage.update({
     *   _id: 'user-1',
     *   foo: 'bar',
     * });     * ```
     */
    update(documentObject:DocumentType): boolean {
        const index = this._storage.findIndex((item) => item._id === documentObject._id);

        
        if (index !== -1) {
            this._storage[index] = documentObject;
            this.save();

            if (this.logInConsole) this._logger.logMethodArgs('update', documentObject._id);
            return true
        } else {
            return false
        }
    }


    /**
     * Loop over all document objects asynchronous.
     *
     * You can return false in callbackfn to break the loop.
     *
     * Example:
     *
     * ```ts
     * await userStorage.forAll(async (user) => {
     *   await sendMessage(user._id, 'Happy new year!');
     *   user.sent = true; // direct change document (use with caution)!
     * });
     * ```
     */
    async forAll(callbackfn: (documentObject: DocumentType) => void | false | Promise<void | false>): Promise<void> {
        this._storage.forEach(async (item) => {
            await callbackfn(item);
        })
        this.save();
    }

    private _saveTimer: NodeJS.Timeout | null = null;

    /**
     * Save the storage to disk.
     */
    save(): void {
        this._logger.logMethod('save');
        if (this._saveTimer != null) return; // save already requested
        this.hasUnsavedChanges = true;
        this._saveTimer = setTimeout(this.forceSave, this.saveDebounce);
    }

    /**
     * Save the storage to disk without any debounce.
     */
    forceSave(): void {
        this._logger.logMethodArgs('forceSave', { hasUnsavedChanges: this.hasUnsavedChanges });

        if (this._saveTimer != null) {
            clearTimeout(this._saveTimer);
            this._saveTimer = null;
        }

        if (this.hasUnsavedChanges) {
            writeJsonFile(this.storagePath, this._storage, this.saveBeautiful ? 2 : 0);
            this.hasUnsavedChanges = false;
        }
    }

    /**
     * Start Storage
     * 
     * The check files before start
     * 
     * 
     * Example:
     * userStorage.start()
     */
    start(): void {
        startStorage(this.storagePath);
    }
}