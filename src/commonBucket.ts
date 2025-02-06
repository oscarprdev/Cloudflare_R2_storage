import { S3Manager } from './manager';
import { S3Config, UploadFileInput, S3Bucket } from './types';

export class CommonBucket extends S3Manager implements S3Bucket {
	constructor(protected readonly config: S3Config) {
		super(config);
	}

	public async listFiles(): Promise<string[] | void> {
		try {
			const files = await this.listObjectsS3();
			return files?.map(({ Key }) => Key!).filter(Boolean);
		} catch (error) {
			console.error('Error in listFiles:', error);
		}
	}

	public async getFile({ name, project }: { name: string; project?: string }): Promise<string | void> {
		try {
			const key = project ? `${project}/${name}` : name;
			await this.getS3Object(key);
			return key;
		} catch (error) {
			console.error('Error in getFile:', error);
		}
	}

	public async uploadFile({ file, name, type, project }: UploadFileInput): Promise<string | void> {
		try {
			const key = project ? `${project}/${name}` : name;
			await this.uploadObjectS3(file, key, type);
			return key;
		} catch (error) {
			console.error('Error in uploadFile:', error);
		}
	}

	public async deleteFile({ name, project }: { name: string; project?: string }): Promise<void> {
		try {
			const key = project ? `${project}/${name}` : name;
			await this.deleteObjectS3(key);
		} catch (error) {
			console.error('Error in deleteFile:', error);
		}
	}
}
