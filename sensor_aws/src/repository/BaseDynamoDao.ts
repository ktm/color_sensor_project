import {GenericDao} from './GenericDao';

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

export abstract class BaseDynamoDao<T> implements GenericDao<T> {
    private readonly tableName: string;
    private readonly keyName: string;

    constructor(tname:string, kname:string) {
        this.tableName = tname;
        this.keyName = kname;
    }

    create(item: T): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Item: item
        };
        return db.put(params);
    }

    delete(id: string): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.keyName]: id
            }
        };
        return db.delete(params);
    }

    findAl(): Promise<T[]> {
        const params = {
            TableName: this.tableName,
        };
        return db.scan(params);
    }

    findOne(id: string): Promise<T> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.keyName]: id
            }
        };
        return db.get(params);
    }

    update(item: T): Promise<boolean> {
        const params: any = {
            TableName: this.tableName,
            Item: item
        };
        return db.put(params);
    }
}
