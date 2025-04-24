import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { createPool } from 'mysql2/promise';

@Injectable()
export class CityService {
  private pool;

  constructor(private httpService: HttpService) {
    this.pool = createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sakila',
      port: Number(process.env.DB_PORT) || 3306,
    });
  }

  async getAllCities() {
    const [rows] = await this.pool.query('SELECT * FROM city');
    return rows;
  }

  async getCityWithCountry(id: number) {
    const [rows] = await this.pool.query(
      'SELECT * FROM city WHERE city_id = ?',
      [id],
    );
    const city = rows[0];

    if (!city) {
      return { message: 'City not found' };
    }

    // Llama al microservicio country
    const countryServiceUrl =
      process.env.COUNTRY_SERVICE_URL || 'http://localhost:8000';
    const countryResponse = await lastValueFrom(
      this.httpService.get(`${countryServiceUrl}/countries/${city.country_id}`),
    );

    return {
      ...city,
      country: countryResponse.data,
    };
  }

  async getAllCitiesWithCountry() {
    const [rows] = await this.pool.query('SELECT * FROM city');
    const cities = rows as any[];

    const countryServiceUrl =
      process.env.COUNTRY_SERVICE_URL || 'http://localhost:8000';

    const citiesWithCountry = await Promise.all(
      cities.map(async (city) => {
        try {
          const countryResponse = await lastValueFrom(
            this.httpService.get(
              `${countryServiceUrl}/countries/${city.country_id}`,
            ),
          );
          return { ...city, country: countryResponse.data };
        } catch (err) {
          return { ...city, country: null };
        }
      }),
    );

    return citiesWithCountry;
  }
}
