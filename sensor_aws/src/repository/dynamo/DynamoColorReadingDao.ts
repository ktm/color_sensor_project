import {BaseDynamoDao, documentClient} from './BaseDynamoDao';
import {ColorReading} from '../../model/ColorReading'
import {BaseColorReadingDao} from '../BaseColorReadingDao';

export class DynamoColorReadingDao
    extends BaseDynamoDao<ColorReading>
    implements BaseColorReadingDao {
    constructor(tname: string, kname: string) {
        super(tname, kname);
    }

    public async update(item: ColorReading): Promise<boolean> {
        const params: any = {
            TableName: this.tableName,
            Key: {
                [this.keyName]: item.id
            },
            UpdateExpression: "set rgb = :rgb, lat = :lat, lng = :lng, readTime = :readTime",
            ExpressionAttributeValues: {
                ":lat": item.lat,
                ":lng": item.lng,
                ":rgb": item.rgb,
                ":readTime": item.readTime
            }
        };
        await documentClient.update(params).promise();
        return true;
    }
}
