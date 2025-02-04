import { CompleteMultipartUploadCommand, CreateMultipartUploadCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, S3Client, UploadPartCommand, } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
/**
 * Manages interactions with an S3 bucket.
 */
export class S3Manager {
    constructor(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "S3", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "bucketName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (config.useDucket) {
            throw new Error('S3Manager can only be used with the S3Config');
        }
        this.bucketName = config.bucketName;
        this.S3 = new S3Client({
            region: 'auto',
            endpoint: config.apiUrl,
            credentials: {
                accessKeyId: config.accessId,
                secretAccessKey: config.secret,
            },
        });
    }
    /**
     * Fetches an object from S3.
     * @param key The key of the object to fetch.
     * @returns The response from the GetObjectCommand, which includes the object's data.
     */
    async getS3Object(key) {
        return await this.S3.send(new GetObjectCommand({ Bucket: this.bucketName, Key: key }));
    }
    /**
     * Lists all objects in the configured S3 bucket.
     * @returns An array of objects contained in the bucket.
     */
    async listObjectsS3() {
        return (await this.S3.send(new ListObjectsV2Command({ Bucket: this.bucketName }))).Contents;
    }
    /**
     * Deletes an object from the S3 bucket.
     * @param key The key of the object to delete.
     * @returns A promise that resolves when the delete operation is complete.
     */
    async deleteObjectS3(key) {
        const url = await getSignedUrl(this.S3, new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }), {
            expiresIn: 3600,
        });
        await fetch(url, {
            method: 'DELETE',
        });
    }
    /**
     * Uploads an object to the S3 bucket.
     * @param file The content of the file to upload, which can be a string, Buffer, or Stream.
     * @param key The key under which to store the object in the bucket.
     * @param contentType The MIME type of the file being uploaded.
     * @returns A promise that resolves when the upload operation is complete.
     */
    async uploadObjectS3(file, key, contentType) {
        const createMultipartInput = {
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        };
        const multipartUploadResponse = await this.S3.send(new CreateMultipartUploadCommand(createMultipartInput));
        const uploadPartInput = {
            ...createMultipartInput,
            Body: file,
            UploadId: multipartUploadResponse.UploadId,
            PartNumber: 1,
        };
        const partUploadResponse = await this.S3.send(new UploadPartCommand(uploadPartInput));
        const completeParams = {
            ...createMultipartInput,
            UploadId: multipartUploadResponse.UploadId,
            MultipartUpload: {
                Parts: [
                    {
                        ETag: partUploadResponse.ETag,
                        PartNumber: 1,
                    },
                ],
            },
        };
        await this.S3.send(new CompleteMultipartUploadCommand(completeParams));
    }
    /**
     * Custom error handler for creating a structured error message.
     * @param error The error object or any thrown value.
     * @param action A string describing the action during which the error occurred.
     * @throws Throws a new error with a structured message containing the bucket name, action, error message, and timestamp.
     */
    CR2SError(error, action) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(JSON.stringify({
            bucket: this.bucketName,
            action,
            message: errorMessage,
            at: new Date().getUTCDate(),
        }));
    }
}
