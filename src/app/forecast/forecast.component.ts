import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {WeatherService} from "../services/weather.service";
import {WeatherData} from "../model/WeatherInformation";
import {Subject, takeUntil} from "rxjs";

@Component({
    selector: 'app-forecast',
    templateUrl: './forecast.component.html',
    styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit, OnDestroy {

    zipCode = '';
    forecastData: WeatherData [] = [];
    city: { name: string };
    unsubscribe$ = new Subject<void>();

    constructor(private route: ActivatedRoute,
                private weatherService: WeatherService) {
    }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(params => {
            this.zipCode = params.get('id');
            if (this.zipCode !== null) {
                this.getForecast(this.zipCode);
            }
        });
    }

    getForecast(id: string): void {
        this.weatherService.getForecastById(id).subscribe(data => {
            this.city = data.city;
            this.forecastData = data.list.map((item) => {
                return {
                    ...item,
                    dt: new Date(item.dt * 1000),
                } as unknown as WeatherData;
            });
        }, error => {
            console.error('Error al obtener los datos del forecast:', error);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
