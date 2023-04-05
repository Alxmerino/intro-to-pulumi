"use strict";
const pulumi = require('@pulumi/pulumi');

const S3 = require('./aws/s3');
const IAM = require('./aws/iam');
const GitHub = require('./github');

/** Config **/
const appName = 'intro-to-pulumi';
const stackConfig = new pulumi.Config();
const config = {
  appName,
  targetDomain: stackConfig.require('targetDomain'),
  repository: stackConfig.get('repository'),
  tags: {
    Project: appName,
    Name: appName,
    Environment: 'Dev',
  },
};

/** S3 Resources **/
const S3Bucket = new S3(appName + '-S3', config);
const S3BucketArn = S3Bucket.arn;
const S3BucketName = S3Bucket.name;
const S3WebsiteUrl = S3Bucket.websiteUrl;
const S3DomainName = S3Bucket.domainName;

/** IAM Resources **/
const IAMRoles = new IAM(appName + 'IAMRoles', {
  ...config,
  S3BucketArn,
});
const GHActionRoleArn = IAMRoles.GHActionRoleArn;

/** GitHub Resources **/
const GitHubResource = new GitHub(appName + 'GitHub', {
  ...config,
  GHActionRoleArn,
  S3BucketName,
});

module.exports = {
  S3WebsiteUrl,
  S3DomainName,
}