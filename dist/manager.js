import {
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	DeleteObjectCommand,
	GetObjectCommand,
	ListObjectsV2Command,
	S3Client,
	UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Utilities } from './utilities';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
export class S3Manager extends Utilities {
	/**
	 * Initializes a new instance of the S3Manager with specific S3 configuration.
	 * @param config Configuration for S3 client, including bucket name and credentials.
	 */
	constructor(config) {
		super(config.bucketName);
		Object.defineProperty(this, 'config', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: config,
		});
		Object.defineProperty(this, 'S3', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		});
		Object.defineProperty(this, 'BucketName', {
			enumerable: true,
			configurable: true,
			writable: true,
			value: void 0,
		});
		this.BucketName = this.config.bucketName;
		this.S3 = new S3Client({
			region: 'auto',
			endpoint: this.config.endpoint,
			credentials: {
				accessKeyId: this.config.accessKeyId,
				secretAccessKey: this.config.secretAccessKey,
			},
		});
	}
	/**
	 * Fetches an object from S3.
	 * @param key The key of the object to fetch.
	 * @returns The response from the GetObjectCommand, which includes the object's data.
	 */
	async getS3Object(key) {
		return await this.S3.send(new GetObjectCommand({ Bucket: this.BucketName, Key: key }));
	}
	/**
	 * Lists all objects in the configured S3 bucket.
	 * @returns An array of objects contained in the bucket.
	 */
	async listObjectsS3() {
		return (await this.S3.send(new ListObjectsV2Command({ Bucket: this.config.bucketName })))
			.Contents;
	}
	/**
	 * Deletes an object from the S3 bucket.
	 * @param key The key of the object to delete.
	 * @returns A promise that resolves when the delete operation is complete.
	 */
	async deleteObjectS3(key) {
		const url = await getSignedUrl(
			this.S3,
			new DeleteObjectCommand({ Bucket: this.config.bucketName, Key: key }),
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
	async uploadObjectS3(file, key, contentType) {
		const createMultipartInput = {
			Bucket: this.config.bucketName,
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
}
