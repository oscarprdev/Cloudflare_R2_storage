import { Readable } from 'stream';

/**
 * Represents the types of files that can be uploaded to the bucket.
 * Can be a simple string (path), Uint8Array, Buffer, or a Readable stream.
 */
export type BucketFile = string | Uint8Array | Buffer | Readable;

/**
 * Input parameters for uploading a file to the bucket.
 */
export interface UploadFileInput {
	/** The content of the file to be uploaded. */
	file: BucketFile;
	/** The ID or name to assign to the file in the bucket. Used as part of the file's key. */
	id: string;
	/** The MIME type of the file being uploaded. */
	type: string;
	/** Optional. The name of the project or folder within the bucket to which the file belongs. */
	project?: string;
}

/**
 * Configuration options for connecting to an S3 bucket.
 */
export interface S3Config {
	bucketName: string;
	apiUrl: string;
	accessId: string;
	secret: string;
	useDucket?: false;
}

export interface DucketConfig {
	useDucket: true;
	apiKey: string;
}

export type BucketConfig = S3Config | DucketConfig;

export interface S3Bucket {
	listFiles(): Promise<string[] | void>;
	getFile(input: { id: string; project?: string }): Promise<string | void>;
	uploadFile(input: UploadFileInput): Promise<string | void>;
	deleteFile(input: { id: string; project?: string }): Promise<void>;
}
