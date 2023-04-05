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

    let bucketPolicy = new aws.s3.BucketPolicy("bucketPolicy", {
      bucket: S3Bucket.bucket,
      policy: S3Bucket.arn.apply(this.publicReadPolicyForBucket)
      // transform the siteBucket.bucket output property
    });

    this.id = S3Bucket.id;
    this.arn = S3Bucket.arn;
    this.domainName = S3Bucket.bucketDomainName;
    this.name = S3Bucket.bucket;
    this.websiteUrl = S3Bucket.websiteEndpoint;
  }

  publicReadPolicyForBucket(arn) {
    return JSON.stringify({
      Version: "2012-10-17",
      Statement: [{
        Effect: "Allow",
        Principal: "*",
        Action: [
          "s3:GetObject"
        ],
        Resource: [
          `arn:aws:s3:::${arn}/*` // policy refers to bucket name explicitly
        ]
      }]
    })
  }
}

module.exports = S3;
