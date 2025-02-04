import { expect, describe, it, beforeEach } from 'vitest';
import dotenv from 'dotenv';
import { Bucket } from '../src';
import { S3Config, UploadFileInput } from '../src/types';
import fs from 'fs';

dotenv.config();

describe('DucketStorage', () => {
	let testDucket: Bucket;

	beforeEach(() => {
		const apiUrl = process.env.S3_API_URL || '';
		const accessId = process.env.S3_ACCESS_KEY_ID || '';
		const secret = process.env.S3_SECRET_ACCESS_KEY || '';
		const bucketName = process.env.DUCKET || '';

		testDucket = new Bucket({
			apiUrl,
			accessId,
			secret,
			bucketName,
		});
	});

	it('Should initialize Ducket correctly', () => {
		expect(testDucket).toBeDefined();
	});

	it('Should upload a file', async () => {
		const file = Uint8Array.from(fs.readFileSync('tests/mock-data/tiny-image.webp'));

		const uploadFilePayload: UploadFileInput = {
			file,
			id: 'mock-id',
			type: 'image/webp',
			project: 'mock-project',
		};

		const result = await testDucket.uploadFile(uploadFilePayload);

		expect(result).toBe('mock-project/mock-id');
	});

	it('Should list all files', async () => {
		const keys = await testDucket.listFiles();

		expect(keys).toBeTruthy();
		expect(keys?.length).toBeGreaterThan(0);

		if (keys) {
			for (const key of keys) {
				expect(key).toBeTruthy();
			}
		}
	});

	it('Should list files in a project', async () => {
		const keys = await testDucket.listFiles();
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
		await testDucket.deleteFile({ id: 'mock-id', project: 'mock-project' });

		const keys = await testDucket.listFiles();
		const projectKeys = keys?.filter(key => key.startsWith('mock-project'));

		expect(projectKeys?.includes('mock-project/mock-id')).toBeFalsy();
	});
});
