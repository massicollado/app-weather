import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from "../services/local-storage.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Coordinate} from "../model/coordinate";
import {WeatherService} from "../services/weather.service";

@Component({
    selector: 'app-zipcode-input',
    templateUrl: './zipcode-input.component.html',
    styleUrls: ['./zipcode-input.component.css'],
})
export class ZipcodeInputComponent implements OnInit {

    zipCodeForm: FormGroup;

    zipCodeList = [];

    zipCodeAdded = false;


    constructor(public localStorageService: LocalStorageService, private fb: FormBuilder, public weatherService: WeatherService) {
        this.zipCodeForm = this.fb.group({
            zipcode: ['', [Validators.pattern('[0-9]{5}'), this.zipCodeValidator()]],

        });
    }

    get zipcode() {
        return this.zipCodeForm.get('zipcode');
    }

    ngOnInit(): void {
       // this.weatherService.loadAllWeatherData();
        //this.localStorageService.getZipCodes();
        this.getZipCodes();
    }

    getZipCodes() {
        if (this.localStorageService.zipCodeList$) {
            this.localStorageService.zipCodeList$.subscribe((zipCodes) => {
                this.zipCodeList = zipCodes;
            });
        }
    }

    async addZipCode() {
        if (this.zipCodeForm.valid) {
            const zipCode = this.zipCodeForm.value.zipcode;
            const response = await this.saveZipCode(zipCode);
            if (!response) {
                return;
            }
            this.zipCodeForm.reset();
            this.zipCodeAdded = true;
            setTimeout(() => {
                this.changeZipCodeAdded()
            }, 3000);
        } else {
                    }
    }

    changeZipCodeAdded() {
        this.zipCodeAdded = !this.zipCodeAdded;
    }

    zipCodeValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const zipCodeExists = this.localStorageService.zipCodeExists(control.value);

            return zipCodeExists ? {zipCodeExists: true} : null;
        };
    }

    async saveZipCode(zipcode: string): Promise<boolean> {
        const response = await this.weatherService.setCoordinate(zipcode);

        if (response === 'invalid_zipcode') {
            this.zipcode?.setErrors({invalidZipcode: true});
            return false;
        }

        this.localStorageService.addZipCode(response as Coordinate);
      this.weatherService.loadWeatherData(response as Coordinate);

        return true;
    }

}
