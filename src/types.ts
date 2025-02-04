import { Readable } from 'stream';

/**
 * Represents the types of files that can be uploaded to the bucket.
 * Can be a simple string (path), Uint8Array, Buffer, or a Readable stream.
 */
export type BucketFile = string | Uint8Array | Buffer | Readable;

/**
 * Configuration options for connecting to an S3 bucket.
 */
export interface S3Config {
	/** The name of the S3 bucket. */
	bucketName: string;
	/** The endpoint URL of the S3 service. */
	endpoint: string;
	/** Access key ID for S3. */
	accessKeyId: string;
	/** Secret access key for S3. */
	secretAccessKey: string;
}

/**
 * Input parameters for uploading a file to the bucket.
 */
export interface UploadFileInput {
	/** The content of the file to be uploaded. */
	file: BucketFile;
	/** The ID or name to assign to the file in the bucket. Used as part of the file's key. */
	id: string;
	/** The MIME type of the file being uploaded. */
	contentType: string;
	/** Optional. The name of the project or folder within the bucket to which the file belongs. */
	project?: string;
}
