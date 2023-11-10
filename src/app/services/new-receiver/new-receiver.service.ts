import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';

@Injectable()
export class NewReceiverService {
	private url = ""

	constructor(private http: Http) {
		const setup = setupData as AppSetup
		this.url = setup.apiUrl
	}
	public addReceiver(xmlData: string) {
		const headers = new Headers()
		headers.append('Content-Type', 'application/xml');
		
		return this.http.post(this.url, xmlData, { headers })
	}
}