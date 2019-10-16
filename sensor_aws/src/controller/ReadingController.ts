import {APIGatewayProxyEvent, Context} from 'aws-lambda';
import {ColorReadingService} from '../service/ColorReadingService';
import {DynamoColorReadingDao} from '../repository/dynamo/DynamoColorReadingDao';
import {ReadingTableMeta} from '../../lib/sensor_db';
import {ColorReading} from '../model/ColorReading';
import {toReading} from './Mapper';
import {BaseColorReadingDao} from "../repository/BaseColorReadingDao";

const TABLE_NAME = ReadingTableMeta.name || '';
const KEY_NAME = ReadingTableMeta.keyName || '';

let colorReadingDao:BaseColorReadingDao = new DynamoColorReadingDao(TABLE_NAME, KEY_NAME);
let colorReadingService:ColorReadingService = new ColorReadingService(colorReadingDao);

function handleError(e:any) {
    console.error(e);

    if ((!e) || (typeof e !== 'object')) {
        return {statusCode: 400, body: e};
    }
    if (e instanceof SyntaxError) {
        return {statusCode: 400, body: 'invalid request, you are missing the parameter body'};
    }

    return {statusCode: 400, body: e};
}

export const fetchAllHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        const data: any = await colorReadingService.fetchAllReading();
        return {statusCode: 200, body: data};
    } catch (e) {
        return handleError(e);
    }
};

export const fetchOneHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.body) {
            return context.logStreamName
        }
        let id:string = event.body;
        let data: ColorReading = await colorReadingService.fetchReading(id);
        return {statusCode: 200, body: data};
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
        const retval: boolean = await colorReadingService.insertReading(requestObject);
        if (retval) {
            return {statusCode: 201};
        } else {
            return {statusCode: 500, body: 'unknown error'}
        }
    } catch (e) {
        return handleError(e);
    }
};

export const updateHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.body) {
            return context.logStreamName
        }
        let requestObject: ColorReading = toReading(event);
        await colorReadingService.updateReading(requestObject);
        return { statusCode: 204};
    } catch (e) {
        return handleError(e);
    }
};

export const deleteHandler = async (event: APIGatewayProxyEvent, context: Context) => {
    try {
        if (!event.queryStringParameters) {
            return handleError('missing required path parameter (id)');
        }
        let deleteId:string = event.queryStringParameters['id'];
        await colorReadingService.deleteReading(deleteId);
        return { statusCode: 204};
    } catch (e) {
        return handleError(e);
    }
};

