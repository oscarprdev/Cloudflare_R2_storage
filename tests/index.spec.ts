import { expect, describe, it, beforeEach } from 'vitest';
import dotenv from 'dotenv';
import { Bucket } from '../src';
import { UploadFileInput } from '../src/types';
import fs from 'fs';

dotenv.config();

describe('S3Bucket', () => {
	let testBucket: Bucket;

	beforeEach(() => {
		const endpoint = process.env.S3_API_URL || '';
		const accessKeyId = process.env.S3_ACCESS_KEY_ID || '';
		const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || '';
		const bucketName = process.env.BUCKET || '';

		testBucket = new Bucket({
			endpoint,
			accessKeyId,
			secretAccessKey,
			bucketName,
		});
	});

	it('Should initialize Bucket correctly', () => {
		expect(testBucket).toBeDefined();
	});

	it('Should upload a file', async () => {
		const file = Uint8Array.from(fs.readFileSync('tests/mock-data/tiny-image.webp'));

		const uploadFilePayload: UploadFileInput = {
			file,
			id: 'mock-id',
			contentType: 'image/webp',
			project: 'mock-project',
		};

		const result = await testBucket.uploadFile(uploadFilePayload);

		expect(result).toBe('mock-project/mock-id');
	});

	it('Should list all files', async () => {
		const keys = await testBucket.listFiles();

		console.log(keys)

		expect(keys).toBeTruthy();
		expect(keys?.length).toBeGreaterThan(0);

		if (keys) {
			for (const key of keys) {
				expect(key).toBeTruthy();
			}
		}
	});

	it('Should list files in a project', async () => {
		const keys = await testBucket.listFiles();
		const projectKeys = keys?.filter(key => key.startsWith('mock-project'));

		expect(projectKeys).toBeTruthy();
		expect(projectKeys?.length).toBeGreaterThan(0);

		if (projectKeys) {
			for (const key of projectKeys) {
				expect(key).toBeTruthy();
			}
		}
	});

	it('Should delete a file', async () => {
		await testBucket.deleteFile({ id: 'mock-id', project: 'mock-project' });

		const keys = await testBucket.listFiles();
		const projectKeys = keys?.filter(key => key.startsWith('mock-project'));

		expect(projectKeys?.includes('mock-project/mock-id')).toBeFalsy();
	});
});
