import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';

@Injectable()
export class GeolocationService {
	private APIKey = ""

	constructor(private http: Http) {
		const setup = setupData as AppSetup
		this.APIKey = setup.google_maps_api_key
	}

	public checkIfUserIsInNewJersey(lat: number, long: number): Observable<any> {
		return this.http.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&result_type=administrative_area_level_1&key=${this.APIKey}`
			)
			.map((res) => res.json())
	}
}