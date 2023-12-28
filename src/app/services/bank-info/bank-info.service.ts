import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { SessionService } from "../session/session.service";
import { XmlParserService } from "../xml-parser/xml-parser.service";

export type Banks = {
	BANK: {
		$: {
			index: string
		}
		BANKNAME: string
		BANKNUMBER: string
		UNIT: string
	}[]
}

@Injectable()
export class BankInfoService {
	private url = "";

	constructor(private http: Http, private session: SessionService, private xmlParserService: XmlParserService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public getBanks(landUnit?: string): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey

		const xmlAuth = `
			<?xml version='1.0'?>
			<?note XpGetBanks?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
				<GETBANKS>
					<LANDUNIT>${landUnit}</LANDUNIT> 
				</GETBANKS>
			</XPRESSO>
		`

		return this.http.post(this.url + "XpGetBanks.cfm", xmlAuth).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "BANKCODES")
		})
	}

}