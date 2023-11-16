import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";

@Injectable()
export class StatesByCountry {

	constructor(private http: Http) {}

	public getStates(country: string) {
		const headers = new Headers()
		headers.append("X-CSCAPI-KEY", "c3VESTdqc1lwVmdOVXlnaHh4QmNZeVZqZ09VZ2lReTYzUGNiSXlxRw==")

		return this.http.get(`https://api.countrystatecity.in/v1/countries/${country}/states`, { headers })
	}
}