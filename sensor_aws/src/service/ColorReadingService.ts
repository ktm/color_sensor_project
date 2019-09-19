import {BaseColorReadingDao} from "../repository/BaseColorReadingDao";
import {ColorReading} from "../model/colorReading";

const uuidv4 = require('uuid/v4');

export class ColorReadingService {

    private dao:BaseColorReadingDao;

    constructor(dao:BaseColorReadingDao) {
        this.dao = dao;
    }

    public async insertReading(reading:ColorReading) {
        reading.id = uuidv4();
        await this.dao.create(reading);
        return reading;
    }

    public async deleteReading(requestedReadingId:string) {
        await this.dao.delete(requestedReadingId);
        return true;
    }

    public async fetchReading(requestedReadingId:string) {
        return await this.dao.findOne(requestedReadingId);
    }

    public async fetchAllReading() {
        return await this.dao.findAl();
    }

    public async updateReading(reading:ColorReading) {
        return await this.dao.update(reading);
    }
}
