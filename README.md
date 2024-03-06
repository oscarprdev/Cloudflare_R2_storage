# Cloudflare R2 storage

A simple way to manage files using Cloudflare R2 storage

## Features
- Upload files
- List files
- Delete files

## Documentation

First, start installing the package in your project:

```javascript
npm i @oprdev/cloudflare-r2-storage
```

Second, retrieve the variables to connect the package with Cloudflare storage.

> [!IMPORTANT]
> To start using the package you will need from Cloudflare the following variables:
> - Cloudflare_access_key_ID
> - Cloudflare_access_key
> - Bucket name
>
> Please check it out the [Cloudflare Documentation](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)


## How it works

> [!TIP]
> Key value is created from Project and Id

```javascript
const bucket = new Bucket({
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName,
  });

// Upload file
await bucket.uploadFile({
    file,
    id: 'your-file-id',
    contentType: 'image/webp',
    project: 'your-project-name',
  })

// Get file by project
await bucket.getKeysByEntity({
    entity: 'your-project-name',
  })

// Delete file
await bucket.deleteItemByKey({
    key: 'your-project-name/your-file-id',
  })
```

