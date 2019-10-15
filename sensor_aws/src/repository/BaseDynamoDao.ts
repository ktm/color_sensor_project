import {GenericDao} from './GenericDao';
const DynamoDBX = require('aws-sdk/clients/dynamodb');

export const documentClient = new DynamoDBX.DocumentClient({endpoint: 'http://172.16.123.1:8000/'});

export abstract class BaseDynamoDao<T> implements GenericDao<T> {

    protected tableName: string;
    protected keyName: string;

    constructor(tname: string, kname: string) {
        this.tableName = tname;
        this.keyName = kname;
    }

    public abstract async update(item: T): Promise<boolean>;

    public async delete(arg: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.keyName]: arg
            }
        };
        console.error('begin delete ' + JSON.stringify(params));
        await documentClient.delete(params).promise();
        console.error('end delete ' + arg);
        return true;
    }

    public async create(item: T): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: item
        };
        await documentClient.put(params).promise();
        return true;
    }

    public async findAll(): Promise<T[]> {
        const result = await documentClient.scan({TableName: this.tableName}).promise();
        return result.Items;
    }

    public async findOne(id: string): Promise<T> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.keyName]: {
                    "S": id
                }
            }
        };
        const result = await documentClient.getItem(params).promise();
        return result.Item;
    }
}
