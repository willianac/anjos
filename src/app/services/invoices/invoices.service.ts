import { Injectable } from "@angular/core";
import { SessionService } from "../session/session.service";
import { Http } from "@angular/http";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { XmlParserService } from "../xml-parser/xml-parser.service";


@Injectable()
export class InvoicesService {
	private url = "";
	constructor(
		private session: SessionService, 
		private http: Http, 
		private xmlParserService: XmlParserService
	) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	getUserInvoices() {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const senderId = this.session.get("linkInfo").SenderId
		const xmlAuth = `
			<?xml version='1.0'?>
			<?note XpGetSenderHistoryById?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
				<SENDERHISTORY>
					<SENDERID>${senderId}</SENDERID>
				</SENDERHISTORY>
			</XPRESSO>
		`

		return this.http.post(this.url + "XpGetSenderHistoryById.cfm", xmlAuth).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "SENDERHISTORY")
		})
	}
}