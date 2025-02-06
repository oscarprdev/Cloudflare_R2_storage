import { Readable } from 'stream';
import { DucketConfig, S3Bucket, UploadFileInput } from './types';

export class DucketBucket implements S3Bucket {
	private apiEndpoint = 'https://www.ducket.dev/api/ducket';

	constructor(protected readonly config: DucketConfig) {}

	public async listFiles(): Promise<string[] | void> {
		try {
			const response = await fetch(`${this.apiEndpoint}/files`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${this.config.apiKey}`,
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				throw new Error('Failed to fetch files');
			}
			const data = await response.json();
			return data.files;
		} catch (error) {
			console.error('Error in listFiles:', error);
		}
	}

	public async getFile({ name }: { name: string }): Promise<string | void> {
		try {
			const response = await fetch(`${this.apiEndpoint}/file/${name}`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${this.config.apiKey}` },
			});

			if (!response.ok) {
				throw new Error('Failed to fetch file');
			}
			const data = await response.json();
			return data.fileUrl;
		} catch (error) {
			console.error('Error in getFile:', error);
		}
	}

	public async uploadFile({ file, name, type, project }: UploadFileInput): Promise<string | void> {
		try {
			const formData = new FormData();

			if (typeof file === 'string') {
				formData.append('file', new Blob([file], { type }));
			} else if (file instanceof Uint8Array || file instanceof Buffer) {
				formData.append('file', new Blob([file], { type }));
			} else if (file instanceof Readable) {
				throw new Error('Streams are not directly supported in FormData. Convert to Buffer first.');
			} else {
				throw new Error('Unsupported file type');
			}

			formData.append('name', name);
			formData.append('type', type);
			if (project) formData.append('project', project);

			const response = await fetch(`${this.apiEndpoint}/file`, {
				method: 'POST',
				headers: { Authorization: `Bearer ${this.config.apiKey}` },
				body: formData,
			});
			if (!response.ok) {
				throw new Error('Failed to upload file');
			}
			const data = await response.json();
			return data.fileUrl;
		} catch (error) {
			console.error('Error in uploadFile:', error);
		}
	}

	public async deleteFile({ name }: { name: string }): Promise<void> {
		try {
			const response = await fetch(`${this.apiEndpoint}/file/${name}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${this.config.apiKey}` },
			});
			if (!response.ok) {
				throw new Error('Failed to delete file');
			}
		} catch (error) {
			console.error('Error in deleteFile:', error);
		}
	}
}
