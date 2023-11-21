import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

@Injectable()
export class GeolocationService {
	private APIKey = "AIzaSyD1tyIJwm0EKuzV-uwM-CTAiDqp-1G5Q_M"

	constructor(private http: Http) {}

	public checkIfUserIsInNewJersey(lat: number, long: number): Observable<any> {
		return this.http.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&result_type=administrative_area_level_1&key=${this.APIKey}`
			)
			.map((res) => res.json())
	}
}