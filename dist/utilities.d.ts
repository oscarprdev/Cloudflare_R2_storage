export declare class Utilities {
	private readonly bucketName;
	constructor(bucketName: string);
	/**
	 * Custom error handler for creating a structured error message.
	 * @param error The error object or any thrown value.
	 * @param action A string describing the action during which the error occurred.
	 * @throws Throws a new error with a structured message containing the bucket name, action, error message, and timestamp.
	 */
	protected CR2SError(error: Error | unknown, action: string): void;
}
