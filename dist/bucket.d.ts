import { S3Manager } from './manager';
import { DeleteItemByKey, GetItemsByEntity, S3Config, UploadFileInput } from './types';
export interface CR2S {
    listAllItemsKeys(): Promise<string[] | void>;
    getKeysByEntity(input: GetItemsByEntity): Promise<string[] | void>;
    deleteItemByKey(input: DeleteItemByKey): Promise<void>;
    uploadFile(input: UploadFileInput): Promise<void | string>;
}
export declare class Bucket extends S3Manager implements CR2S {
    protected readonly config: S3Config;
    constructor(config: S3Config);
    /**
     * Lists all items within the S3 bucket.
     * @returns A promise that resolves to an array of File objects or void in case of error.
     */
    listAllItemsKeys(): Promise<string[] | void>;
    /**
     * Retrieves items from the S3 bucket that match a specified entity.
     * @param input An object containing the entity to match against item names.
     * @returns A promise that resolves to an array of File objects or void in case of error.
     */
    getKeysByEntity({ entity }: GetItemsByEntity): Promise<string[] | void>;
    /**
     * Uploads a file to the S3 bucket.
     * @param input An object containing the file, ID, content type, and optional project under which to store the file.
     * @returns A promise that resolves to a File object representing the uploaded file, or void in case of error.
     */
    uploadFile({ file, id, contentType, project }: UploadFileInput): Promise<string | void>;
    /**
     * Deletes an item from the S3 bucket by its key.
     * @param input An object containing the key of the item to delete.
     * @returns A promise that resolves to void upon successful deletion, or void in case of error.
     */
    deleteItemByKey({ key }: DeleteItemByKey): Promise<void>;
}
