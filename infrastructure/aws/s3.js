const aws = require('@pulumi/aws');
const pulumi = require('@pulumi/pulumi');

class S3 extends pulumi.ComponentResource {
  id = '';
  arn = '';
  domainName = '';
  name = '';
  websiteUrl = '';

  constructor(name, args, opts) {
    super('custom:resource:S3', name, args, opts);

    const { targetDomain, tags } = args;

    const S3Bucket = new aws.s3.Bucket(targetDomain, {
      website: {
        indexDocument: 'index.html',
        errorDocument: 'index.html',
      },
      acl: 'public-read',
      tags,
    });

    this.id = S3Bucket.id;
    this.arn = S3Bucket.arn;
    this.domainName = S3Bucket.bucketDomainName;
    this.name = S3Bucket.bucket;
    this.websiteUrl = S3Bucket.websiteEndpoint;
  }
}

module.exports = S3;