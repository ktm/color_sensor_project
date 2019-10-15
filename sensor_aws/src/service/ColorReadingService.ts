import {BaseColorReadingDao} from '../repository/BaseColorReadingDao';
import {ColorReading} from '../model/ColorReading';
import {v4} from 'uuid';

export class ColorReadingService {

    private dao:BaseColorReadingDao;

    constructor(dao:BaseColorReadingDao) {
        this.dao = dao;
    }

    public async deleteReading(requestedReadingId:string): Promise<boolean> {
        return await this.dao.delete(requestedReadingId);
    }

    public fetchReading(requestedReadingId:string): Promise<ColorReading> {
        return this.dao.findOne(requestedReadingId);
    }

    public async updateReading(reading:ColorReading): Promise<boolean> {
        return await this.dao.update(reading);
    }

    public async insertReading(reading:ColorReading): Promise<boolean> {
        reading.id = v4();
        return await this.dao.create(reading);
    }

    public async fetchAllReading(): Promise<ColorReading[]> {
        return await this.dao.findAll();
    }
}
