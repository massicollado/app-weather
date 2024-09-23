import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ZipcodeInputComponent } from './zipcode-input/zipcode-input.component';
import { HttpClientModule } from '@angular/common/http';
import { ForecastComponent } from './forecast/forecast.component';
import { RouterModule } from '@angular/router';
import { WeatherListComponent } from './weather-list/weather-list.component';
import { WeatherService } from './services/weather.service';
import { LocalStorageService } from './services/local-storage.service';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        ZipcodeInputComponent,
        ForecastComponent,
        WeatherListComponent
    ],
    bootstrap: [AppComponent],
    providers: [WeatherService, LocalStorageService]
})
export class AppModule { }