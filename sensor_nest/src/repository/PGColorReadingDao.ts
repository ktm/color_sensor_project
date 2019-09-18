import { BaseColorReadingDao } from '@kit-mccormick/sensor_base/lib/repository/BaseColorReadingDao';
import { ColorReading } from '@kit-mccormick/sensor_base/lib/model/ColorReading';

class PGColorReadingDao extends PGBaseDao, implements BaseColorReadingDao {

  create(item: ColorReading): Promise<boolean> {
    return undefined;
  }

  delete(id: string): Promise<boolean> {
    return undefined;
  }

  findAl(): Promise<ColorReading[]> {
    return undefined;
  }

  findOne(id: string): Promise<ColorReading> {
    return undefined;
  }

  update(item: ColorReading): Promise<boolean> {
    return undefined;
  }

}
