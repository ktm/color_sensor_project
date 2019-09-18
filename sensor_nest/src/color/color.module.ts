import { Module } from '@nestjs/common';
import { ColorController } from './color.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [ColorController],
})
export class ColorModule {}
