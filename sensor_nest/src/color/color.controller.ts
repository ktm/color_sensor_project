import { Controller, Get } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorReading } from '@kit-mccormick/sensor_base/lib/model/ColorReading';

@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Get()
  findAll(): Promise<ColorReading[]> {
    return this.colorService.findAll();
  }
}
