import apigateway = require('@aws-cdk/aws-apigateway');
import dynamodb = require('@aws-cdk/aws-dynamodb');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');

export class AwsStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    const dynamoTable = new dynamodb.Table(this, 'readings', {
      partitionKey: {
        name: 'readingId',
        type: dynamodb.AttributeType.STRING
      },
      tableName: 'readings'
    });

    const api = new apigateway.RestApi(this, 'readingsApi', {
      restApiName: 'Readings Service'
    });
    const readings = api.root.addResource('readings');

    const createOne = new lambda.Function(this, 'createReadingFunction', {
      code: lambda.Code.fromAsset('src'),
      handler: 'src/controller/readingController.createHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'readingId'
      }
    });
    const createOneIntegration = new apigateway.LambdaIntegration(createOne);
    readings.addMethod('POST', createOneIntegration);

    const getAllLambda = new lambda.Function(this, 'getAllReadingsFunction', {
      code: lambda.Code.fromAsset('.'),
      handler: 'src/controller/readingController.fetchAllHandler',
      runtime: lambda.Runtime.NODEJS_10_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: 'readingId'
      }
    });
    const getAllIntegration = new apigateway.LambdaIntegration(getAllLambda);
    readings.addMethod('GET', getAllIntegration);

    dynamoTable.grantReadWriteData(createOne);
//    dynamoTable.grantReadData(getAllLambda);

    addCorsOptions(readings);
    /*
        const updateOne = new lambda.Function(this, 'updateReadingFunction', {
          code: new lambda.AssetCode('src'),
          handler: 'controller/readingController.updateHandler',
          runtime: lambda.Runtime.NODEJS_10_X,
          environment: {
            TABLE_NAME: dynamoTable.tableName,
            PRIMARY_KEY: 'readingId'
          }
        });
        dynamoTable.grantReadWriteData(updateOne);
        const updateOneIntegration = new apigateway.LambdaIntegration(updateOne);
        singleReading.addMethod('PUT', updateOneIntegration);

        const deleteOne = new lambda.Function(this, 'deleteReadingFunction', {
          code: new lambda.AssetCode('src'),
          handler: 'controller/reading.deleteHandler',
          runtime: lambda.Runtime.NODEJS_10_X,
          environment: {
            TABLE_NAME: dynamoTable.tableName,
            PRIMARY_KEY: 'readingId'
          }
        });
        dynamoTable.grantReadWriteData(deleteOne);
        const deleteOneIntegration = new apigateway.LambdaIntegration(deleteOne);
        singleReading.addMethod('DELETE', updateOneIntegration);
     */
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
