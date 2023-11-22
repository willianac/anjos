import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { SessionService } from "../session/session.service";
import { XmlParserService } from "../xml-parser/xml-parser.service";

@Injectable()
export class NewSenderService {
	private url = ""

	constructor(
		private http: Http, 
		private session: SessionService, 
		private xmlParser: XmlParserService
	) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public getSenderIdTypes() {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const xmlData = `
			<?note XpGetSenderIdTypes?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
			</XPRESSO>
		`

		return this.http.post(this.url + "XpGetSenderIdTypes.cfm", xmlData).switchMap((res) => {
			return this.xmlParser.parseXml(res, "SENDERIDTYPES")
		})
	}
}