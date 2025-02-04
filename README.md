# Ducket

`Ducket` is a simple and efficient library to manage your files using Cloudflare R2 Storage.

## Features

- Upload files
- Get file
- List files
- Delete files

## Installation

To install the package in your project, run the following command:

```bash
npm install ducket
```

## Setup

Before using the package, you'll need the following Cloudflare credentials:

- **Cloudflare Access Key ID**
- **Cloudflare Secret Access Key**
- **Cloudflare Api Url**
- **Bucket Name**

Please ensure you have these variables from your Cloudflare account. If you're unsure how to get them, refer to the [Cloudflare Documentation](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/).

## Usage

Once the package is installed and your credentials are ready, you can start using it to interact with your Cloudflare R2 storage. Here's how to use the various features:

### Example

#### Initialize the Bucket

```javascript
import { Bucket } from '@bucket';

const bucket = new Bucket({
			apiUrl,
			accessId,
			secret,
			bucketName,
});
```

#### Upload a File

```javascript
await bucket.uploadFile({
  file, // File content
  id: 'your-file-id', // Unique file ID
  type: 'image/webp', // Content type of the file
  project: 'your-project-name', // Project name for file organization
});
```

#### List All Files

```javascript
const files = await bucket.listFiles();
```

#### Retrieve a File by Project

```javascript
const file = await bucket.getFile({
  id: 'your-file-id', // File ID
  project: 'your-project-name', // Project name
});
```

#### Delete a File

```javascript
await bucket.deleteFile({
  id: 'your-file-id', // File ID
  project: 'your-project-name', // Project name
});
```

## Notes

> **Tip:** The file URL is constructed using your project name and file ID:  
> `https://r2-storage.url.com/your-project-name/your-file-id`
