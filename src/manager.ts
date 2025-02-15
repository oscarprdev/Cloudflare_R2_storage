import {
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	S3Client,
	UploadPartCommand,
	_Object,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BucketConfig, BucketFile } from './types';

/**
 * Manages interactions with an S3 bucket.
 */
export class S3Manager {
	protected readonly S3: S3Client;
	private readonly bucketName: string;

	constructor(protected readonly config: BucketConfig) {
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
	protected async getS3Object(key: string) {
		return await this.S3.send(new GetObjectCommand({ Bucket: this.bucketName, Key: key }));
	}

	/**
	 * Lists all objects in the configured S3 bucket.
	 * @returns An array of objects contained in the bucket.
	 */
	protected async listObjectsS3() {
		return (await this.S3.send(new ListObjectsV2Command({ Bucket: this.bucketName }))).Contents;
	}

	/**
	 * Deletes an object from the S3 bucket.
	 * @param key The key of the object to delete.
	 * @returns A promise that resolves when the delete operation is complete.
	 */
	protected async deleteObjectS3(key: string) {
		const url = await getSignedUrl(
			this.S3,
			new DeleteObjectCommand({ Bucket: this.bucketName, Key: key }),
			{
				expiresIn: 3600,
			}
		);

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
	protected async uploadObjectS3(file: BucketFile, key: string, contentType: string) {
		const createMultipartInput = {
			Bucket: this.bucketName,
			Key: key,
			ContentType: contentType,
		};

		const multipartUploadResponse = await this.S3.send(
			new CreateMultipartUploadCommand(createMultipartInput)
		);

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
	protected CR2SError(error: Error | unknown, action: string) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';

		throw new Error(
			JSON.stringify({
				bucket: this.bucketName,
				action,
				message: errorMessage,
				at: new Date().getUTCDate(),
			})
		);
	}
}
