import { uuid } from "https://deno.land/x/uuid@v0.1.2/mod.ts";


import { readJsonFile, writeJsonFile } from './util.ts';

import type { DocumentObject, Keys, Values, NovinStorageConfig } from './type.ts';

export { DocumentObject };

let logStart = false;

/**
 * Elegant micro in-memory json-like storage with disk backed,
 * Fastest NoSQL Database written in tiny TypeScript ES module.
 *
 * @param {string} name Storage name like database table name.
 * @param {string} pathPrefix Saved file path prefix (default is `data`).
 * 
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

  protected _storage: DocumentType[] = [];


  /**
   * All document in array.
   *
   * Contain `_last`!
   */
  get getAll(): Array<DocumentType> {
    return this._storage
  }


  constructor(config: NovinStorageConfig) {
    this.forceSave = this.forceSave.bind(this);

    this.saveBeautiful = config.saveBeautiful || false;
    this.name = config.name;
    this.storagePath = `${config.path ?? './db'}/${config.name}.json`;
    this.saveDebounce = config.saveDebounce ?? 1000;
    this.logInConsole = config.logInConsole ?? true;
    this.autoId = config.autoId || true;

    this.start();
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
  private async start(): Promise<void> {
    this._storage = await readJsonFile<DocumentType>(this.storagePath);

    if (!logStart) {
      console.log('\x1b[33m', "Novin Storage Started");
      console.log('storage is ready to receive any amount of data (Ok)', '\x1b[0m');

      logStart = true;
    }

  }




  /**
   * Load process like open/parse storage file.
   */
  private async load(): Promise<void> {
    this._storage = await readJsonFile<DocumentType>(this.storagePath) ?? [];
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
  getItem(id: string | string[]): DocumentType | null {
    const document = this._storage.filter((item) => item._id === id);
    if (document.length !== 0) {
      return document[0]
    } else {
      return null
    }
  }

  /**
   * Get item document by key&value documentObject.
   * @param key The ket to select document.
   * @param value The value to select document.
   *
   * Example:
   *
   * ```ts
   * const novin = userStorage.getItem('userName','Novin');
   * ```
   */
  getItemByKn(key: Keys<DocumentType>, value: Values<DocumentType>): DocumentType | null {
    const document = this._storage.filter((item) => item[key] === value);
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
    if (documentObject._id && this.getItem(documentObject._id) !== null) throw new Error('Exist Record');

    if (this.autoId) documentObject._id = uuid();



    this._storage.push(documentObject);

    this.save();


    if (this.logInConsole) console.log(`@webkn-storage => ${this.name}.set(${documentObject._id})`);
    return documentObject;
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
  removeItem(id: string): boolean {
    const filtered = this._storage.filter((item) => item._id !== id);

    if (filtered.length === this._storage.length) {
      return false
    } else {
      this._storage = filtered
      this.save();

      if (this.logInConsole) console.log(`@webkn-storage => ${this.name}.remove(${id})`);
      return true;
    }
  }

  /**
   * Remove Item document by key&valye documentObject.
   * @param key The ket to select document.
   * @param value The value to select document.
   *
   * Example:
   *
   * ```ts
   * userStorage.remove('userName','Novin');
   * ```
   */
  removeItemByKn(key: Keys<DocumentObject>, value: Values<DocumentObject>): boolean {
    const filtered = this._storage.filter((item) => item[key] !== value);

    if (filtered.length === this._storage.length) {
      return false
    } else {
      this._storage = filtered
      this.save();

      if (this.logInConsole) console.log(`@webkn-storage => ${this.name}.remove(key:${key},value:${value})`);
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
  update(documentObject: DocumentType & DocumentObject): boolean {
    const index = this._storage.findIndex((item) => item._id === documentObject._id);


    if (index !== -1) {
      this._storage[index] = documentObject;
      this.save();

      if (this.logInConsole) console.log(`@webkn/storage => ${this.name}.update${documentObject._id}`);
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
  forAll(callbackfn: (documentObject: DocumentType) => void | false | Promise<void | false>): void {
    this._storage.forEach(async (item) => {
      await callbackfn(item);
    })
    this.save();
  }

  private _saveTimer: number | null = null;

  /**
   * Save the storage to disk.
   */
  save(): void {
    if (this.logInConsole) console.log(`@webkn/storage => ${this.name}.save()`);

    if (this._saveTimer != null) return; // save already requested 
    this.hasUnsavedChanges = true;
    this._saveTimer = setTimeout(this.forceSave, this.saveDebounce);
  }

  /**
   * Save the storage to disk without any debounce.
   */
  forceSave(): void {
    if (this.logInConsole) console.log(`@webkn/storage => ${this.name}.forceSave()`);

    if (this._saveTimer != null) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }

    if (this.hasUnsavedChanges) {
      writeJsonFile(this.storagePath, this._storage, this.saveBeautiful ? 2 : 0);
      this.hasUnsavedChanges = false;
    }
  }

}
