import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import * as xml2js from 'xml2js';

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';

export type Kinship = {
	$: {
		index: string
	}
	KINSHIPID: string
	KINSHIPNAME: string
}

@Injectable()
export class KinshipService {
	private url = ""

	constructor(private http: Http) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public getKinships(): Observable<any> {
		return this.http.get(this.url + "XpGetKinship").switchMap((res) => {
			const body = res.text()
			const parser = new xml2js.Parser({explicitArray: false})

			return new Observable((observer) => {
				parser.parseString(body, (err, result) => {
					if(err) {
						observer.error(err)
					} else {
						observer.next(result.KINSHIPS.KINSHIP as Kinship)
						observer.complete()
					}
				})
			})
		})
	}
}