import {BaseDynamoDao} from "./BaseDynamoDao";
import {ColorReading} from "@kit-mccormick/sensor_base/lib/model/ColorReading";
import {BaseColorReadingDao} from "@kit-mccormick/sensor_base/lib/repository/BaseColorReadingDao";

export class DynamoColorReadingDao
    extends BaseDynamoDao<ColorReading>
    implements BaseColorReadingDao {}
