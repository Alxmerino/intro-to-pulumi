# Intro to pulumi

## Getting Started

1.  Install Pulumi
```sh
brew install pulumi/tap/pulumi
```
2. Configure AWS Credentials
```sh
export AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID> 
export AWS_SECRET_ACCESS_KEY=<YOUR_SECRET_ACCESS_KEY>
```
3. Create new Pulumi project
```sh
mkdir infrastructure && cd infrastructure
pulumi new aws-typescript
```
4. Deploy Application
```sh
pulumi up
```
5. Modify the Program
```js
const bucketObject = new aws.s3.BucketObject("index.html", {
    bucket: bucket,
    source: new pulumi.asset.FileAsset(path.join(__dirname, '../dist/index.html'))
});
```
6. `pulumi up`
7. Make it a static website
```js
// Bucket
const bucket = new aws.s3.Bucket("my-bucket", {
    website: {
        indexDocument: "index.html",
    },
});

// Bucket Object
const bucketObject = new aws.s3.BucketObject("index.html", {
    acl: "public-read",
    contentType: "text/html",
    bucket: bucket,
    source: new pulumi.asset.FileAsset(path.join(__dirname, '../dist/index.html'))
});
```
8. Expose the S3 URL 
```exports.bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;```

## Automate with GitHub, 
1. change to `demo` branch
2. Copy deploy script to `.github/workflows/deploy.yml`
3. Set config 
    - `targetDomain`: S3 Bucket bucket name
    - `repository`: Repository to deploy GH Actions
    - `github:token`: Secret GH Token
4. `pulumi up` 
---
# Vue

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
