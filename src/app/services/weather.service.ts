import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, firstValueFrom, Observable, of, switchMap, take} from "rxjs";
import {Coordinate} from "../model/coordinate";
import {ForecastData, WeatherInformation} from "../model/WeatherInformation";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class WeatherService {

    private static readonly BASE_URL = 'https://api.openweathermap.org/';
    private static readonly GEOCODE_URL = 'geo/1.0/zip';
    private static readonly WEATHER_URL = 'data/2.5/weather';
    private static readonly FORECAST_URL = 'data/2.5/forecast/daily';
    private static readonly API_KEY = '5a4b2d457ecbef9eb2a71e480b947604';
    private static readonly UNITS = 'imperial';
    private static readonly COUNTRY_CODE = 'us';
    weatherConditions$ = new BehaviorSubject<WeatherInformation[]>([]);
    private coordinates: Coordinate[] = [];
    private weatherConditions: WeatherInformation[] = [];


    constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    }


    geocodeLocation(zipCode: string): Observable<Coordinate> {

        const url = `${WeatherService.BASE_URL}${WeatherService.GEOCODE_URL}?zip=${zipCode},${WeatherService.COUNTRY_CODE}&appid=${WeatherService.API_KEY}`;
        return this.http.get<Coordinate>(url);
    }

    setCoordinate(zipCode: string): Promise<Coordinate | string> {
        const g = this.geocodeLocation(zipCode).pipe(take(1),
            catchError((error) => {
                if (error) {
                    return of('invalid_zipcode');
                }
            }),
            switchMap((coordinate) => {
                    return of(coordinate);
                }
            ));
        return firstValueFrom(g);
    }

    loadWeatherData(coordinate: Coordinate): void {
        const url = `${WeatherService.BASE_URL}${WeatherService.WEATHER_URL}?lat=${coordinate.lat}&lon=${coordinate.lon}&appid=${WeatherService.API_KEY}&units=${WeatherService.UNITS}`;
        this.http.get(url).pipe(
            take(1),
            catchError((error) => {
                if (error) {
                    return 'no_data_available';
                }
            })
        ).subscribe((data) => {

            if (data === 'no_data_available') {

            }
            const weatherData = data as WeatherInformation;
            this.weatherConditions.push({...weatherData, zip: coordinate.zip} as WeatherInformation);
            this.weatherConditions$.next(this.weatherConditions);

        });
    }

    loadAllWeatherData(): void {
        this.weatherConditions = [];
        this.localStorageService.getZipCodes();
        const coordinates = this.localStorageService.zipCodeList$.value;
        coordinates.forEach((coordinate) => {
            this.loadWeatherData(coordinate);
        });
    }

    deleteWeatherData(data: WeatherInformation): void {
        this.weatherConditions = this.weatherConditions.filter((weatherData) => weatherData.zip !== data.zip);
        this.weatherConditions$.next(this.weatherConditions);

    }

    getForecastById(zipCode: string): Observable<ForecastData> {
        const coordinate = this.weatherConditions.find((coordinate) => coordinate.zip === zipCode);
        const url = `${WeatherService.BASE_URL}${WeatherService.FORECAST_URL}?lat=${coordinate.coord.lat}&lon=${coordinate.coord.lon}&appid=${WeatherService.API_KEY}&units=${WeatherService.UNITS},&cnt=5`;

        return this.http.get<ForecastData>(url);
    }
}
