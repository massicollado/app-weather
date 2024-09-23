import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Coordinate} from "../model/coordinate";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private static readonly ZIPCODES = "zipcodes";
    zipCodeList$ = new BehaviorSubject<Coordinate[]>([]);

    constructor() {
    }

    getZipCodes(): void {
        const zipCodes = this.getZipCodeListFromLocalStorage();
        if (zipCodes) {
            this.setZipCodes(JSON.parse(JSON.stringify(zipCodes)));
        }
    }

    setZipCodes(coordinates: Coordinate[]): void {
        localStorage.setItem(LocalStorageService.ZIPCODES, JSON.stringify(coordinates));
        this.zipCodeList$.next(coordinates);
    }

    addZipCode(coordinate: Coordinate) : void {
        const coordinates = this.getZipCodeListFromLocalStorage();
        if (coordinates.length > 0) {
            coordinates.push(coordinate);
            this.setZipCodes(coordinates);
        } else {
            this.setZipCodes([coordinate]);
        }
    }

    zipCodeExists(zipCode: string): boolean {
        const coordinatesList = this.getZipCodeListFromLocalStorage();
        return coordinatesList.some((coordinate) => coordinate.zip === zipCode);
    }

    deleteZipCode(zipCode: string): void {
        const coordinatesList = this.getZipCodeListFromLocalStorage();
        const updatedCoordinates = coordinatesList.filter((coordinate) => coordinate.zip !== zipCode);
        this.setZipCodes(updatedCoordinates);
    }

    getZipCodeListFromLocalStorage() : Coordinate[] {
        const zipCodes = localStorage.getItem(LocalStorageService.ZIPCODES);
        if (zipCodes) {
            return JSON.parse(zipCodes) as Coordinate[];
        }
        return [];
    }
}
