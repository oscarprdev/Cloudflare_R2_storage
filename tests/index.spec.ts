import { expect, describe, it, beforeEach } from 'vitest';
import dotenv from 'dotenv';
import { Bucket } from '../src';
import { UploadFileInput } from '../src/types';
import fs from 'fs';

dotenv.config();

describe('CR2S', () => {
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

	it('Should Bucket variables be setted correctly', () => {
		expect(testBucket).toBeDefined();
	});

	it('Should Bucket be able to upload a File', async () => {
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

	it('Should Bucket be able to list all items', async () => {
		const keys = await testBucket.listAllItemsKeys();

		expect(keys).toBeTruthy();
		expect(keys?.length).toBeGreaterThan(0);

		if (keys) {
			for (const key of keys) {
				expect(key).toBeTruthy();
			}
		}
	});

	it('Should Bucket be able to list all items in a project', async () => {
		const keys = await testBucket.getKeysByEntity({ entity: 'mock-project' });

		expect(keys).toBeTruthy();
		expect(keys?.length).toBeGreaterThan(0);

		if (keys) {
			for (const key of keys) {
				expect(key).toBeTruthy();
			}
		}
	});

	it('Should Bucket be able to delete an item', async () => {
		await testBucket.deleteItemByKey({ key: 'mock-project/mock-id' });

		const keys = await testBucket.getKeysByEntity({ entity: 'mock-project' });
		expect(keys).toBeFalsy();
	});
});
