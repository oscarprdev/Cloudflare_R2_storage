import { S3Bucket, BucketConfig } from './types';
export declare class Bucket implements S3Bucket {
    private bucket;
    constructor(config: BucketConfig);
    private isDucketConfig;
    listFiles(): Promise<string[] | void>;
    getFile(input: {
        id: string;
        project?: string;
    }): Promise<string | void>;
    uploadFile(input: Parameters<S3Bucket['uploadFile']>[0]): Promise<string | void>;
    deleteFile(input: {
        id: string;
        project?: string;
    }): Promise<void>;
}
