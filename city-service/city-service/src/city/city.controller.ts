import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  getAllCities() {
    return this.cityService.getAllCitiesWithCountry();
  }

  @Get(':id')
  getCity(@Param('id') id: number) {
    return this.cityService.getCityWithCountry(id);
  }
}
