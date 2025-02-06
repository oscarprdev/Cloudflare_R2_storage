import { S3Bucket, BucketConfig, DucketConfig, S3Config } from './types';
import { CommonBucket } from './commonBucket';
import { DucketBucket } from './ducketBucket';

export class Bucket implements S3Bucket {
	private bucket: S3Bucket;

	constructor(config: BucketConfig) {
		if (this.isDucketConfig(config)) {
			this.bucket = new DucketBucket(config satisfies DucketConfig);
		} else {
			this.bucket = new CommonBucket(config satisfies S3Config);
		}
	}

	private isDucketConfig(config: BucketConfig): config is DucketConfig {
		return Boolean(config.useDucket);
	}

	public listFiles(): Promise<string[] | void> {
		return this.bucket.listFiles();
	}

	public getFile(input: { name: string; project?: string }): Promise<string | void> {
		return this.bucket.getFile(input);
	}

	public uploadFile(input: Parameters<S3Bucket['uploadFile']>[0]): Promise<string | void> {
		return this.bucket.uploadFile(input);
	}

	public deleteFile(input: { name: string; project?: string }): Promise<void> {
		return this.bucket.deleteFile(input);
	}
}
