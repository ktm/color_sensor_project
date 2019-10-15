import {AttributeType} from "@aws-cdk/aws-dynamodb";

type TableMeta =  {
    readonly name: string;
    readonly keyName: string;
    readonly keyType: AttributeType;
}

export const ReadingTableMeta: TableMeta = {name: 'reading', keyName: 'id', keyType: AttributeType.STRING};
export const SensorTableMeta: TableMeta = {name: 'sensor', keyName: 'id', keyType: AttributeType.STRING};
