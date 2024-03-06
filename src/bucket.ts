import { S3Manager } from './manager';
import { DeleteItemByKey, GetItemsByEntity, S3Config, UploadFileInput } from './types';

export interface CR2S {
	listAllItemsKeys(): Promise<string[] | void>;

	getKeysByEntity(input: GetItemsByEntity): Promise<string[] | void>;

	deleteItemByKey(input: DeleteItemByKey): Promise<void>;

	uploadFile(input: UploadFileInput): Promise<void | string>;
}

export class Bucket extends S3Manager implements CR2S {
	constructor(protected readonly config: S3Config) {
		super(config);
	}

	/**
	 * Lists all items within the S3 bucket.
	 * @returns A promise that resolves to an array of File objects or void in case of error.
	 */
	public async listAllItemsKeys(): Promise<string[] | void> {
		try {
			const S3ObjectsList = await this.listObjectsS3();

			if (S3ObjectsList && Array.isArray(S3ObjectsList)) {
				return S3ObjectsList.filter(({ Key }) => Key !== undefined).map((item) => item.Key) as string[];
			}
		} catch (error: unknown) {
			return this.CR2SError(error, 'listAllItems');
		}
	}

	/**
	 * Retrieves items from the S3 bucket that match a specified entity.
	 * @param input An object containing the entity to match against item names.
	 * @returns A promise that resolves to an array of File objects or void in case of error.
	 */
	public async getKeysByEntity({ entity }: GetItemsByEntity): Promise<string[] | void> {
		try {
			const list = await this.listAllItemsKeys();

			return list?.filter((key) => key.match(entity));
		} catch (error: unknown) {
			return this.CR2SError(error, 'getItemsByEntity');
		}
	}

	/**
	 * Uploads a file to the S3 bucket.
	 * @param input An object containing the file, ID, content type, and optional project under which to store the file.
	 * @returns A promise that resolves to a File object representing the uploaded file, or void in case of error.
	 */
	public async uploadFile({ file, id, contentType, project }: UploadFileInput): Promise<string | void> {
		try {
			const key = `${project ? `${project}/` : ''}${id}`;

			await this.uploadObjectS3(file, key, contentType);

			const result = await this.getS3Object(key);

			return result && key;
		} catch (error: unknown) {
			return this.CR2SError(error, 'uploadFile');
		}
	}

	/**
	 * Deletes an item from the S3 bucket by its key.
	 * @param input An object containing the key of the item to delete.
	 * @returns A promise that resolves to void upon successful deletion, or void in case of error.
	 */
	public async deleteItemByKey({ key }: DeleteItemByKey): Promise<void> {
		try {
			await this.deleteObjectS3(key);
		} catch (error: unknown) {
			return this.CR2SError(error, 'deleteItemByKey');
		}
	}
}
