export type JSON = Record<string, unknown>;

export interface DocumentObject {
  [key: string]: unknown;
  _id?: string;
}

export type Keys<DocType extends DocumentObject> = keyof DocType

type ValueOf<T> = T[keyof T];

export type Values<DocType extends DocumentObject> = ValueOf<DocType>


export type NovinStorageConfig = {
  /**
   * Storage name.
   */
  name: string;

  /**
   * Storage path.
   *
   * @default './db'
   */
  path?: string;

  /**
   * Log in the console.
   *
   * @default true
   */
   logInConsole?: boolean;

  /**
  * Write pretty formatted JSON file.
  *
  * @default false
  */
  saveBeautiful?: boolean;

  /**
 * Save debounce timeout for minimal disk iops usage.
 *
 * @default 1000
 */
  saveDebounce?: number;

  /**
   * Set Id Automatic.
   *
   * @default true
   */
  autoId?: boolean;

  /**
   * Debug output logs
   *
   * @default undefined Auto detect base on `NODE_ENV`
   */
  debug?: boolean;
};

export type AlwatrStorageProviderConfig = {
  /**
   * Default storage path. you can override it in get config params.
   *
   * @default './db'
   */
  path?: string;

  /**
   * Save debounce timeout for minimal disk iops usage.
   *
   * @default 100
   */
  saveDebounce?: number;

  /**
   * Write pretty formatted JSON file.
   *
   * @default false
   */
  saveBeautiful?: boolean;

  /**
   * Debug output logs
   *
   * @default undefined Auto detect base in NODE_ENV
   */
  debug?: boolean;
};