import {ColorReading} from '../src/model/ColorReading';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

describe('reading', function() {

    it('addReading', async function () {
        let nowTime:Date = new Date();

        let reading1: ColorReading = {
            id: 'xxx-1',
            rgb: 10222,
            lat: 98.000,
            lng: 97.222,
            readTime: nowTime
        };
/*
        let reading2: ColorReading = {
            id: 'xxx-2',
            rgb: 10245,
            lat: 96.000,
            lng: 95.222,
            readTime: nowTime
        };

        let reading3: ColorReading = {
            id: 'xxx-3',
            rgb: 10662,
            lat: 94.000,
            lng: 93.222,
            readTime: nowTime
        };
*/

        chai.request('http://localhost:3000')
            .post('/reading')
            .send(reading1)
            .end(function (err: any, res: any) {
                expect(err).to.be.null;
                expect(res).to.have.status(201);
            });
    });

});

