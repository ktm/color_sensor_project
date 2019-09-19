import {ColorReading} from "../model/ColorReading";
import {APIGatewayEvent} from "aws-lambda";

export function toReading(event: APIGatewayEvent): ColorReading {
    let retval:ColorReading;

    if ((event === null) || (event.body === null)) {
        throw new SyntaxError('toReading got a null event or event.body');
    }

    if (typeof event.body == 'object') {
        retval = event.body as ColorReading;
    } else {
        retval = JSON.parse(event.body) as ColorReading;
    }

    return retval as ColorReading;
}
