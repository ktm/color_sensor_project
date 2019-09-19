export interface GenericDao<T> {
    findAl(): Promise<T[]>;
    findOne(id: string): Promise<T>;
    create(item: T): Promise<boolean>;
    update(item: T): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
