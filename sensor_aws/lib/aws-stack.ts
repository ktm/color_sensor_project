import apigateway = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { ReadingTableMeta } from './sensor_db';

export class AwsStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const readingTable = new dynamodb.Table(this, ReadingTableMeta.name, {
      partitionKey: {
        name: ReadingTableMeta.keyName,
        type: ReadingTableMeta.keyType
      },
      tableName: ReadingTableMeta.name
    });

    const api = new apigateway.RestApi(this, 'readingsApi', {
      restApiName: 'Readings Service'
    });

    const readingResource = api.root.addResource('readingResource');

    const createOneLambda = new lambda.Function(this, 'createReadingFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'src/controller/ReadingController.createHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: ReadingTableMeta.name,
        PRIMARY_KEY: ReadingTableMeta.keyName      }
    });

    const getLambda = new lambda.Function(this, 'getReadingsFunction', {
      code: lambda.Code.fromAsset('.'),
      handler: 'src/controller/ReadingController.fetchHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: ReadingTableMeta.name,
        PRIMARY_KEY: ReadingTableMeta.keyName
      }
    });

    const updateOneLambda = new lambda.Function(this, 'updateReadingFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'src/controller/ReadingController.updateHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: ReadingTableMeta.name,
        PRIMARY_KEY: ReadingTableMeta.keyName
      }
    });

    const deleteOneLambda = new lambda.Function(this, 'deleteReadingFunction', {
      code: new lambda.AssetCode('src'),
      handler: 'src/controller/ReadingController.deleteHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: ReadingTableMeta.name,
        PRIMARY_KEY: ReadingTableMeta.keyName
      }
    });

    readingResource.addMethod('POST', new apigateway.LambdaIntegration(createOneLambda));
    readingResource.addMethod('GET', new apigateway.LambdaIntegration(getLambda));
    readingResource.addMethod('PUT', new apigateway.LambdaIntegration(updateOneLambda));
    readingResource.addMethod('DELETE', new apigateway.LambdaIntegration(deleteOneLambda));

    readingTable.grantReadWriteData(createOneLambda);
    readingTable.grantReadData(getLambda);
    readingTable.grantReadWriteData(updateOneLambda);
    readingTable.grantReadWriteData(deleteOneLambda);

    addCorsOptions(readingResource);
  }
}

export function addCorsOptions(apiResource: apigateway.IResource) {
  apiResource.addMethod('OPTIONS', new apigateway.MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}
