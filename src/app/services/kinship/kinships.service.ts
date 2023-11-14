import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Observable } from "rxjs";

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { SessionService } from "../session/session.service";
import { XmlParserService } from "../xml-parser/xml-parser.service";

export type Kinships = {
	KINSHIP: {
		$: {
			index: string
		}
		KINSHIPID: string
		KINSHIPNAME: string
	}[]
}

export type AddSenderReceiverKinshipResponse = {
	KINSHIPID: string
	RECEIVERID: string
	SENDERID: string
}

@Injectable()
export class KinshipService {
	private url = ""

	constructor(private http: Http, private session: SessionService, private xmlParserService: XmlParserService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public getKinships(): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey

		const xmlAuth = `
			<?xml version='1.0'?>
			<?note XpGetKinship?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
			</XPRESSO>
		`
		
		return this.http.post(this.url+ "XpGetKINSHIP.cfm", xmlAuth).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "KINSHIPS")
		})
	}

	public addSenderReceiverKinship(kinshipID: string, senderID: string, receiverID: string) {
		const sessionKey = this.session.get("linkInfo").SessionKey

		const xmlData = `
			<?xml version='1.0'?>
			<?note XpAddSenderReceiverKinship?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
				<SENDERRECEIVERKINSHIP>
					<KINSHIPID>${kinshipID}</KINSHIPID>
					<RECEIVERID>${receiverID}</RECEIVERID>
					<SENDERID>${senderID}</SENDERID>
				</SENDERRECEIVERKINSHIP>
			</XPRESSO>
		`
		return this.http.post(this.url + "XpAddSenderReceiverKinship.cfm", xmlData).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "SENDERRECEIVERKINSHIP")
		})
	}
}