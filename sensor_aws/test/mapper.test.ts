import { expect } from 'chai';
import {toReading} from '../src/controller/mapper';
import {APIGatewayEventRequestContext, APIGatewayProxyEvent} from "aws-lambda";
import {ColorReading} from "@kit-mccormick/sensor_base/lib/model/ColorReading";

class MockEvent implements APIGatewayProxyEvent {
    body: string | null;
    headers: { [p: string]: string };
    httpMethod: string;
    isBase64Encoded: boolean;
    multiValueHeaders: { [p: string]: string[] };
    multiValueQueryStringParameters: { [p: string]: string[] } | null;
    path: string;
    pathParameters: { [p: string]: string } | null;
    queryStringParameters: { [p: string]: string } | null;
    requestContext: APIGatewayEventRequestContext;
    resource: string;
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
            time: nowTime
        };
        event.body = JSON.stringify(reading);
        let val: ColorReading = toReading(event);
        expect(val !== null);
        expect( val.id === 'xxx');
        expect(val.rgb === 102);
        expect(val.lat === 99.000);
        expect(val.lng === 98.222);
        expect(val.time === nowTime);
    });
});
