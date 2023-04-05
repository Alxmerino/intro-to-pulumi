const aws = require('@pulumi/aws');
const pulumi = require('@pulumi/pulumi');

class IAM extends pulumi.ComponentResource {
  GHActionRoleArn = '';

  constructor(name, args, opts) {
    super('custom:resource:IAM', name, args, opts);

    const { appName, tags, S3BucketArn } = args;

    // IAM Open ID Connect Provider
    // const GHOpenIdConnectProvider = new aws.iam.OpenIdConnectProvider(
    //   appName + 'GHOpenIDConnect',
    //   {
    //     clientIdLists: ['sts.amazonaws.com'],
    //     thumbprintLists: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    //     url: 'https://token.actions.githubusercontent.com',
    //   }
    // );

    // Use existing ID Connect Provider
    const GHOpenIdConnectProvider = pulumi.output(
      aws.iam.getOpenidConnectProvider({
        url: "https://token.actions.githubusercontent.com",
      })
    );

    // GitHub Action Role
    const GHActionRole = GHOpenIdConnectProvider.arn.apply((arn) => {
      return new aws.iam.Role(appName + 'GHActionRole', {
        assumeRolePolicy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: {
                Federated: arn,
              },
              Action: 'sts:AssumeRoleWithWebIdentity',
              Condition: {
                StringEquals: {
                  'token.actions.githubusercontent.com:aud':
                    'sts.amazonaws.com',
                },
              },
            },
          ],
        }),
        tags,
      });
    });

    const GHActionRolePolicy = pulumi.all([S3BucketArn]).apply(([arn]) => {
      return new aws.iam.RolePolicy(appName + 'GHActionRolePolicy', {
        role: GHActionRole.id,
        policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Action: ['s3:putObject'],
              Effect: 'Allow',
              Resource: `${arn}/*`,
            },
          ],
        }),
      });
    });

    this.GHActionRoleArn = GHActionRole.arn;
  }
}

module.exports = IAM;