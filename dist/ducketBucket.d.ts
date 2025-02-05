import { DucketConfig, S3Bucket, UploadFileInput } from "./types";
export declare class DucketBucket implements S3Bucket {
    protected readonly config: DucketConfig;
    private apiEndpoint;
    constructor(config: DucketConfig);
    listFiles(): Promise<string[] | void>;
    getFile({ id }: {
        id: string;
    }): Promise<string | void>;
    uploadFile({ file, id, type, project }: UploadFileInput): Promise<string | void>;
    deleteFile({ id }: {
        id: string;
    }): Promise<void>;
}
