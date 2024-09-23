import {Component, OnDestroy, OnInit} from '@angular/core';
import {WeatherInformation} from "../model/WeatherInformation";
import {Subject, takeUntil} from "rxjs";
import {WeatherService} from "../services/weather.service";
import {LocalStorageService} from "../services/local-storage.service";

@Component({
  selector: 'app-weather-list',
  templateUrl: './weather-list.component.html',
  styleUrls: ['./weather-list.component.css']
})
export class WeatherListComponent implements OnInit, OnDestroy {
  name = 'Angular';
  weatherData: WeatherInformation[] = [];
  unsubscribe$ = new Subject<void>();


  constructor(
      private weatherService: WeatherService,
      private localStorageService: LocalStorageService
  ) {
  }

  ngOnInit() {
    this.weatherService.loadAllWeatherData();
    this.weatherService.weatherConditions$.pipe(
        takeUntil(this.unsubscribe$)
    ).subscribe((data) => {
      this.weatherData = data;
    });

  }

  deleteLocation(data: WeatherInformation) {
    this.localStorageService.deleteZipCode(data.zip);
    this.weatherService.deleteWeatherData(data);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
