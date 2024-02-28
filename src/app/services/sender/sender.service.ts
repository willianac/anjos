import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { SessionService } from "../session/session.service";
import { XmlParserService } from "../xml-parser/xml-parser.service";
import { Observable } from "rxjs";

@Injectable()
export class SenderService {
	private url = "";

	constructor(private http: Http, private session: SessionService, private xmlParserService: XmlParserService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public getSenderInfo(id: string): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const xmlData = `<?xml version='1.0'?>
		<?note XpGetSenderById?>
		<XPRESSO>
			<AUTHENTICATE>
				<SESSIONKEY>${sessionKey}</SESSIONKEY>
			</AUTHENTICATE>
			<SENDER>
				<SENDERID>${id}</SENDERID>
			</SENDER>
		</XPRESSO>`

		return this.http.post(this.url + "XpGetSenderById.cfm", xmlData).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "SENDER")
			.do((res) => {
				if(res.ERROR) {
					throw new Error(res.MESSAGE)
				}
			})
		})
	}
}