import { expect, describe, it, beforeEach } from 'vitest';
import dotenv from 'dotenv';
import { Bucket } from '../src';
import { UploadFileInput } from '../src/types';
import fs from 'fs';

dotenv.config();

describe('DucketStorage', () => {
	describe('With common config', () => {
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
				name: 'mock-name',
				type: 'image/webp',
				project: 'test',
			};

			const result = await testDucket.uploadFile(uploadFilePayload);

			expect(result).toBe('test/mock-name');
		});

		it('Should get a file', async () => {
			const response = await testDucket.getFile({ name: 'mock-name', project: 'test' });
			expect(response).toBe('test/mock-name');
		});

		it('Should list all files', async () => {
			const keys = await testDucket.listFiles();

			expect(keys).toBeTruthy();
			expect(keys?.length).toBeGreaterThan(0);

			if (keys) {
				for (const key of keys) {
					expect(key).toBeTruthy();
					expect(key).toBe('test/mock-name');
				}
			}
		});

		it('Should delete a file', async () => {
			await testDucket.deleteFile({ name: 'mock-name', project: 'test' });
			const keys = await testDucket.listFiles();
			expect(keys).toBeUndefined();
		});
	});

	describe('With ducket config', () => {
		let testDucket: Bucket;
		let publicURL = process.env.S3_PUBLIC_URL || '';

		beforeEach(() => {
			const apiKey = process.env.S3_API_KEY || '';

			testDucket = new Bucket({
				useDucket: true,
				apiKey,
			});
		});

		it('Should initialize Ducket correctly', () => {
			expect(testDucket).toBeDefined();
		});

		it('Should upload a file', async () => {
			const file = Uint8Array.from(fs.readFileSync('tests/mock-data/tiny-image.webp'));

			const uploadFilePayload: UploadFileInput = {
				file,
				name: 'mock-name',
				type: 'image/webp',
			};

			const result = await testDucket.uploadFile(uploadFilePayload);

			expect(result).toBe(`${publicURL}/test/mock-name`);
		});

		it('Should get a file', async () => {
			const response = await testDucket.getFile({ name: 'mock-name' });
			expect(response).toBe(`${publicURL}/test/mock-name`);
		});

		it('Should list all files', async () => {
			const keys = await testDucket.listFiles();

			expect(keys).toBeTruthy();
			expect(keys?.length).toBeGreaterThan(0);

			if (keys) {
				for (const key of keys) {
					expect(key).toBeTruthy();
					expect(key).toBe(`${publicURL}/test/mock-name`);
				}
			}
		});

		it('Should delete a file', async () => {
			await testDucket.deleteFile({ name: 'mock-name' });
			const keys = await testDucket.listFiles();
			expect(keys?.length).toBe(0);
		});
	});
});
