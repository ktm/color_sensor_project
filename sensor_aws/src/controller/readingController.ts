import {ColorReading} from "@kit-mccormick/sensor_base/lib/model/ColorReading";
import {ColorReadingService} from "@kit-mccormick/sensor_base/lib/service/ColorReadingService";
import {APIGatewayProxyEvent, Context} from "aws-lambda";
import {toReading} from "./Mapper";
import {DynamoColorReadingDao} from "../repository/DynamoColorReadingDao";

const AWS = require('aws-sdk');
const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`;
const DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;
const TABLE_NAME = process.env.TABLE_NAME || '';
const KEY_NAME = process.env.KEY_NAME || '';

let colorReadingDao:DynamoColorReadingDao = new DynamoColorReadingDao(TABLE_NAME, KEY_NAME);
let colorReadingService:ColorReadingService = new ColorReadingService(colorReadingDao);

function handleError(e:any) {
    if (e instanceof SyntaxError) {
        console.error(e.message);
        return {statusCode: 400, body: 'invalid request, you are missing the parameter body'};
    }
    if (e instanceof AWS.AWSError) {
        const errorResponse = e.code === 'ValidationException' && e.message.includes('reserved keyword') ?
            DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
        return {statusCode: 500, body: errorResponse}
    }
    return {statusCode: 400, body: e.message};
}

export const fetchHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.body) {
            const responseObject:any = await colorReadingService.fetchAllReading();
            return { statusCode: 200, body: responseObject };
        } else {
            let readingId:string = event.body;
            const responseObject:ColorReading = await colorReadingService.fetchReading(readingId);
            return { statusCode: 200, body: responseObject };
        }
    } catch (e) {
        return handleError(e);
    }
};

export const createHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.body) {
            return context.logStreamName
        }
        let requestObject:ColorReading = toReading(event);
        const responseObject:ColorReading = await colorReadingService.insertReading(requestObject);

        return { statusCode: 201, body: responseObject };
    } catch (e) {
        return handleError(e);
    }
};

export const updateHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.body) {
            return context.logStreamName
        }
        let requestObject:ColorReading = toReading(event);
        await colorReadingService.updateReading(requestObject);
        return { statusCode: 204, body: '' };
    } catch (e) {
        return handleError(e);
    }
};

export const deleteHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.body) {
            return context.logStreamName
        }
        let deleteId:string = event.body;
        await colorReadingService.deleteReading(deleteId);
        return { statusCode: 204, body: '' };
    } catch (e) {
        return handleError(e);
    }
};

