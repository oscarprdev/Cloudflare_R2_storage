import { CommonBucket } from './commonBucket';
import { DucketBucket } from './ducketBucket';
export class Bucket {
    constructor(config) {
        Object.defineProperty(this, "bucket", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (this.isDucketConfig(config)) {
            this.bucket = new DucketBucket(config);
        }
        else {
            this.bucket = new CommonBucket(config);
        }
    }
    isDucketConfig(config) {
        return Boolean(config.useDucket);
    }
    listFiles() {
        return this.bucket.listFiles();
    }
    getFile(input) {
        return this.bucket.getFile(input);
    }
    uploadFile(input) {
        return this.bucket.uploadFile(input);
    }
    deleteFile(input) {
        return this.bucket.deleteFile(input);
    }
}
