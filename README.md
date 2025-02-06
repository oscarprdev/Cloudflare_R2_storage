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

There are 2 ways to use this package, first is using the common bucket approach with your own credentials from Cloudflare, and the second is using the ducket approach with an account on ducket.vercel.app. Link to the app: https://ducket.vercel.app/

## Using cloudflare credentials

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
  name: 'your-file-name', // Unique file name
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
  name: 'your-file-name', // File name
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

## Using ducket app credentials

Before using the package, you'll need an api key from ducket.vercel.app:
Each project has its own api key, so you can use it to access the files of that project.
- **API_KEY**

## Usage

Once the package is installed and your credentials are ready, you can start using it to interact with your Ducket storage. Every file will be monitored on the ducket.vercel.app dashboard, so you can access the files directly from there.

### Example

#### Initialize the Bucket

```javascript
import { Bucket } from '@bucket';

const bucket = new Bucket({
  useDucket: true,
  apiKey: "your-api-key",
});
```

#### Upload a File

```javascript
await bucket.uploadFile({
  file, // File content
  name: 'your-file-name', // Unique file name
  type: 'image/webp', // Content type of the file
});
```

#### List All Files

```javascript
const files = await bucket.listFiles();
```

#### Retrieve a File by Project

```javascript
const file = await bucket.getFile({
  name: 'your-file-name', // File name
});
```

#### Delete a File

```javascript
await bucket.deleteFile({
  name: 'your-file-name', // File name
});
```

## Notes

> **Tip:** The file URL is constructed using your project name and file name:  
> `https://ducket.vercel.app/your-project-name/your-file-name`


