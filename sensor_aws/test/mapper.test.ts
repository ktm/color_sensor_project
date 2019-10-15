import { expect } from 'chai';
import {toReading} from '../src/controller/mapper';
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from 'aws-lambda';
import {ColorReading} from '../src/model/ColorReading';

class MockEvent implements APIGatewayProxyEvent {
    // @ts-ignore
    body: string;
    // @ts-ignore
    headers: { [p: string]: string };
    // @ts-ignore
    httpMethod: string;
    // @ts-ignore
    isBase64Encoded: boolean;
    // @ts-ignore
    multiValueHeaders: { [p: string]: string[] };
    // @ts-ignore
    multiValueQueryStringParameters: { [p: string]: string[] } | null;
    // @ts-ignore
    path: string;
    // @ts-ignore
    pathParameters: { [p: string]: string } | null;
    // @ts-ignore
    queryStringParameters: { [p: string]: string } | null;
    // @ts-ignore
    requestContext: APIGatewayEventRequestContext;
    // @ts-ignore
    resource: string;
    // @ts-ignore
    stageVariables: { [p: string]: string } | null;
}

describe('mapper', function() {
    it('invalidReading', function () {
        let event: MockEvent = new MockEvent();
        event.body = 'not a reading';
        expect(() => toReading(event)).to.throw(Error);
    });

    it('goodReading', function () {
        let event: MockEvent = new MockEvent();
        let nowTime:Date = new Date();
        let reading: ColorReading = {
            id: 'xxx',
            rgb: 102,
            lat: 99.000,
            lng: 98.222,
            readTime: nowTime
        };
        event.body = JSON.stringify(reading);
        let val: ColorReading = toReading(event);
        expect(val !== null);
        expect( val.id === 'xxx');
        expect(val.rgb === 102);
        expect(val.lat === 99.000);
        expect(val.lng === 98.222);
        expect(val.readTime === nowTime);
    });
});
