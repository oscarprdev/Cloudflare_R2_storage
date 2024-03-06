import { S3Manager } from './manager';
export class Bucket extends S3Manager {
    constructor(config) {
        super(config);
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
    }
    /**
     * Lists all items within the S3 bucket.
     * @returns A promise that resolves to an array of File objects or void in case of error.
     */
    async listAllItemsKeys() {
        try {
            const S3ObjectsList = await this.listObjectsS3();
            if (S3ObjectsList && Array.isArray(S3ObjectsList)) {
                return S3ObjectsList.filter(({ Key }) => Key !== undefined).map(item => item.Key);
            }
        }
        catch (error) {
            return this.CR2SError(error, 'listAllItems');
        }
    }
    /**
     * Retrieves items from the S3 bucket that match a specified entity.
     * @param input An object containing the entity to match against item names.
     * @returns A promise that resolves to an array of File objects or void in case of error.
     */
    async getKeysByEntity({ entity }) {
        try {
            const list = await this.listAllItemsKeys();
            return list?.filter(key => key.match(entity));
        }
        catch (error) {
            return this.CR2SError(error, 'getItemsByEntity');
        }
    }
    /**
     * Uploads a file to the S3 bucket.
     * @param input An object containing the file, ID, content type, and optional project under which to store the file.
     * @returns A promise that resolves to a File object representing the uploaded file, or void in case of error.
     */
    async uploadFile({ file, id, contentType, project, }) {
        try {
            const key = `${project ? `${project}/` : ''}${id}`;
            await this.uploadObjectS3(file, key, contentType);
            const result = await this.getS3Object(key);
            return result && key;
        }
        catch (error) {
            return this.CR2SError(error, 'uploadFile');
        }
    }
    /**
     * Deletes an item from the S3 bucket by its key.
     * @param input An object containing the key of the item to delete.
     * @returns A promise that resolves to void upon successful deletion, or void in case of error.
     */
    async deleteItemByKey({ key }) {
        try {
            await this.deleteObjectS3(key);
        }
        catch (error) {
            return this.CR2SError(error, 'deleteItemByKey');
        }
    }
}
