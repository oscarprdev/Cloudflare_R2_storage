import { Readable } from "stream";
export class DucketBucket {
    constructor(config) {
        Object.defineProperty(this, "config", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: config
        });
        Object.defineProperty(this, "apiEndpoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'https://ducket.vercel.app/'
        });
    }
    async listFiles() {
        try {
            const response = await fetch(`${this.apiEndpoint}/files`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${this.config.apiKey}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const data = await response.json();
            return data.files;
        }
        catch (error) {
            console.error('Error in listFiles:', error);
        }
    }
    async getFile({ id, project }) {
        try {
            const key = project ? `${project}/${id}` : id;
            const response = await fetch(`${this.apiEndpoint}/file/${key}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch file');
            }
            const data = await response.json();
            return data.fileUrl;
        }
        catch (error) {
            console.error('Error in getFile:', error);
        }
    }
    async uploadFile({ file, id, type, project }) {
        try {
            const formData = new FormData();
            if (typeof file === 'string') {
                formData.append('file', new Blob([file], { type }));
            }
            else if (file instanceof Uint8Array || file instanceof Buffer) {
                formData.append('file', new Blob([file], { type }));
            }
            else if (file instanceof Readable) {
                throw new Error('Streams are not directly supported in FormData. Convert to Buffer first.');
            }
            else {
                throw new Error('Unsupported file type');
            }
            formData.append('id', id);
            formData.append('type', type);
            if (project)
                formData.append('project', project);
            const response = await fetch(`${this.apiEndpoint}/upload`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload file');
            }
            const data = await response.json();
            return data.fileUrl;
        }
        catch (error) {
            console.error('Error in uploadFile:', error);
        }
    }
    async deleteFile({ id, project }) {
        try {
            const key = project ? `${project}/${id}` : id;
            const response = await fetch(`${this.apiEndpoint}/delete/${key}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${this.config.apiKey}` },
            });
            if (!response.ok) {
                throw new Error('Failed to delete file');
            }
        }
        catch (error) {
            console.error('Error in deleteFile:', error);
        }
    }
}
