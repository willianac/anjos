import { Injectable } from "@angular/core";
import { Headers, Http } from "@angular/http";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';

export type State = {
	id: number
	iso2: string
	name: string
}

@Injectable()
export class GeographyService {
	private apiKey = "";

	constructor(private http: Http) {
		const setup = setupData as AppSetup
		this.apiKey = setup.geography_api_key
	}

	public getAllCitiesWithinCountry(country: string) {
		const headers = new Headers()
		headers.append("X-CSCAPI-KEY", this.apiKey)

		return this.http.get(`https://api.countrystatecity.in/v1/countries/${country}/cities`, { headers })
	}

	public getStates(country: string) {
		const headers = new Headers()
		headers.append("X-CSCAPI-KEY", this.apiKey)

		return this.http.get(`https://api.countrystatecity.in/v1/countries/${country}/states`, { headers })
	}

	public getCountries() {
		const headers = new Headers()
		headers.append("X-CSCAPI-KEY", this.apiKey)

		return this.http.get(`https://api.countrystatecity.in/v1/countries/`, { headers })
	}
}