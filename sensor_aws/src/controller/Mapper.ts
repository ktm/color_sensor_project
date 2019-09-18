import {IReading} from "../model/reading";
import {APIGatewayEvent} from "aws-lambda";

export function toReading(event: APIGatewayEvent): IReading {
    let retval:IReading;

    if ((event === null) || (event.body === null)) {
        throw new SyntaxError('toReading got a null event or event.body');
    }

    if (typeof event.body == 'object') {
        retval = event.body as IReading;
    } else {
        retval = JSON.parse(event.body) as IReading;
    }

    return retval as IReading;
}
