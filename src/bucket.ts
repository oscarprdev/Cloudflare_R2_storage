import { S3Manager } from './manager';
import {  S3Config, UploadFileInput } from './types';

export interface S3Bucket {
	listFiles(): Promise<string[] | void>;

	getFile(input: { id: string; project?: string }): Promise<string | void>;

	deleteFile(input: { id: string; project?: string }): Promise<void>;

	uploadFile(input: UploadFileInput): Promise<string | void>;
}

export class Bucket extends S3Manager implements S3Bucket {
	constructor(protected readonly config: S3Config) {
		super(config);
	}

	/**
	 * Lists all files in the S3 bucket.
	 */
	public async listFiles(): Promise<string[] | void> {
		try {
			const files = await this.listObjectsS3();
			return files?.map(({ Key }) => Key!).filter(Boolean);
		} catch (error) {
			return this.handleError(error, 'listFiles');
		}
	}

	/**
	 * Retrieves a file key from the S3 bucket based on ID and optional project.
	 */
	public async getFile({ id, project }: { id: string; project?: string }): Promise<string | void> {
		try {
			const key = project ? `${project}/${id}` : id;
			const result = await this.getS3Object(key);
			return result && key;
		} catch (error) {
			return this.handleError(error, 'getFile');
		}
	}

	/**
	 * Uploads a file to the S3 bucket.
	 */
	public async uploadFile({ file, id, contentType, project }: UploadFileInput): Promise<string | void> {
		try {
			const key = project ? `${project}/${id}` : id;
			await this.uploadObjectS3(file, key, contentType);
			return key;
		} catch (error) {
			return this.handleError(error, 'uploadFile');
		}
	}

	/**
	 * Deletes a file from the S3 bucket by ID and optional project.
	 */
	public async deleteFile({ id, project }: { id: string; project?: string }): Promise<void> {
		try {
			const key = project ? `${project}/${id}` : id;
			await this.deleteObjectS3(key);
		} catch (error) {
			this.handleError(error, 'deleteFile');
		}
	}

	/**
	 * Error handler function to maintain consistency.
	 */
	private handleError(error: unknown, methodName: string): void {
		console.error(`Error in ${methodName}:`, error);
	}
}
