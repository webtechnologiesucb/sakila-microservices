import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { CityModule } from './city/city.module';

@Module({
  imports: [HttpModule, CityModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
