import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeatherListComponent } from './weather-list/weather-list.component';
import { ForecastComponent } from './forecast/forecast.component';

const routes: Routes = [
  { path: '', component: WeatherListComponent, pathMatch: 'full' }, // Ruta base
  { path: 'forecast/:id', component: ForecastComponent }, // Ruta para forecast con parámetro
  { path: '**', component: WeatherListComponent } // Ruta comodín para redirigir a WeatherListComponent
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }