import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";
import * as xml2js from 'xml2js';

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { SessionService } from "../session/session.service";

export type Bank = {
	$: {
		index: string
	}
	BANKNAME: string
	BANKNUMBER: string
	UNIT: string
}

@Injectable()
export class BankInfoService {
	private url = "";

	constructor(private http: Http, private session: SessionService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public getBanks(): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey

		const xmlAuth = `
			<?xml version='1.0'?>
			<?note XpGetBanks?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
			</XPRESSO>
		`

		return this.http.post(this.url + "XpGetBanks.cfm", xmlAuth).switchMap((res) => {
			const body = res.text()
			const parser = new xml2js.Parser({explicitArray: false})

			return new Observable((observer) => {
				parser.parseString(body, (err, result) => {
					if(err) {
						observer.error(err)
					} else {
						observer.next(result.BANKCODES.BANK as Bank[])
						observer.complete()
					}
				})
			})
		})
	}

}