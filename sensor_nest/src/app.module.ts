import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ColorModule } from './color/color.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ColorModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 54320,
      username: 'sensor',
      password: 'p@ssw0rd',
      database: 'sensor',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      uuidExtension: 'pgcrypto',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
