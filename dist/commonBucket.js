import { S3Manager } from './manager';
export class CommonBucket extends S3Manager {
    constructor(config) {
        super(config);
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
    }
    async listFiles() {
        try {
            const files = await this.listObjectsS3();
            return files?.map(({ Key }) => Key).filter(Boolean);
        }
        catch (error) {
            console.error('Error in listFiles:', error);
        }
    }
    async getFile({ id, project }) {
        try {
            const key = project ? `${project}/${id}` : id;
            await this.getS3Object(key);
            return key;
        }
        catch (error) {
            console.error('Error in getFile:', error);
        }
    }
    async uploadFile({ file, id, type, project }) {
        try {
            const key = project ? `${project}/${id}` : id;
            await this.uploadObjectS3(file, key, type);
            return key;
        }
        catch (error) {
            console.error('Error in uploadFile:', error);
        }
    }
    async deleteFile({ id, project }) {
        try {
            const key = project ? `${project}/${id}` : id;
            await this.deleteObjectS3(key);
        }
        catch (error) {
            console.error('Error in deleteFile:', error);
        }
    }
}
