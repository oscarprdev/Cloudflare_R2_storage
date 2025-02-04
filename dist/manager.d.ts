import { S3Client, _Object } from '@aws-sdk/client-s3';
import { BucketConfig, BucketFile } from './types';
/**
 * Manages interactions with an S3 bucket.
 */
export declare class S3Manager {
    protected readonly config: BucketConfig;
    protected readonly S3: S3Client;
    private readonly bucketName;
    constructor(config: BucketConfig);
    /**
     * Fetches an object from S3.
     * @param key The key of the object to fetch.
     * @returns The response from the GetObjectCommand, which includes the object's data.
     */
    protected getS3Object(key: string): Promise<import("@aws-sdk/client-s3").GetObjectCommandOutput>;
    /**
     * Lists all objects in the configured S3 bucket.
     * @returns An array of objects contained in the bucket.
     */
    protected listObjectsS3(): Promise<_Object[] | undefined>;
    /**
     * Deletes an object from the S3 bucket.
     * @param key The key of the object to delete.
     * @returns A promise that resolves when the delete operation is complete.
     */
    protected deleteObjectS3(key: string): Promise<void>;
    /**
     * Uploads an object to the S3 bucket.
     * @param file The content of the file to upload, which can be a string, Buffer, or Stream.
     * @param key The key under which to store the object in the bucket.
     * @param contentType The MIME type of the file being uploaded.
     * @returns A promise that resolves when the upload operation is complete.
     */
    protected uploadObjectS3(file: BucketFile, key: string, contentType: string): Promise<void>;
    /**
     * Custom error handler for creating a structured error message.
     * @param error The error object or any thrown value.
     * @param action A string describing the action during which the error occurred.
     * @throws Throws a new error with a structured message containing the bucket name, action, error message, and timestamp.
     */
    protected CR2SError(error: Error | unknown, action: string): void;
}
