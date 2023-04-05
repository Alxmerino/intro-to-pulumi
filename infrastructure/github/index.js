const github = require('@pulumi/github');
const pulumi = require('@pulumi/pulumi');

class GitHub extends pulumi.ComponentResource {
  constructor(name, args, opts) {
    super('custom:resource:GitHub', name, args, opts);

    const { appName, GHActionRoleArn, S3BucketName, repository } = args;

    const IAMSecret = new github.ActionsSecret(appName + 'SecretIAM', {
      repository,
      secretName: 'IAMROLE_GITHUB',
      plaintextValue: GHActionRoleArn,
    });

    const S3Secret = new github.ActionsSecret(appName + 'SecretS3', {
      repository,
      secretName: 'ACTION_AWS_S3_BUCKET',
      plaintextValue: S3BucketName,
    });
  }
}

module.exports = GitHub;