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
		const sessionKey = this.session.get("linkInfo")
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

	public addNewRegister(email: string, password: string) {
		const xmlData = `<?xml version='1.0'?>
			<?note XpAthenticate?>
			<XPRESSO>
				<AUTHENTICATE>
					<LOGINNAME>${email}</LOGINNAME>
					<MYPASSWORD>${password}</MYPASSWORD>
				</AUTHENTICATE>
			</XPRESSO>
		`
		

		return this.http.post(this.url + "XpNewRegister.cfm", xmlData).switchMap((res) => {
			return this.xmlParser.parseXml(res, "NewRegisterResponse")
		})
	}

	public addNewSender(
		address: string,
		cellphone: string,
		birthdate: string,
		city: string,
		docType: string,
		email: string,
		idTypeSender: string,
		owner: string,
		phone: string,
		senderDoc: string,
		senderLast: string,
		senderName: string,
		SSNumberSender: string,
		state: string,
		zip: string,
		sessionKey: string,
		senderCard: string
	) {
		const xmlData = `<?note XpAddsender?>
		<XPRESSO>
			<AUTHENTICATE>
				<SESSIONKEY>${sessionKey}</SESSIONKEY>
			</AUTHENTICATE>
			<SENDER>
				<ADDRESS>${address}</ADDRESS>
				<CELLPHONE>${cellphone}</CELLPHONE>
				<CITY>${city}</CITY>
				<DOB>${birthdate}</DOB>
				<DOCTYPE>${docType}</DOCTYPE>
				<EMAIL>${email}</EMAIL>
				<IDTYPESENDER>${idTypeSender}</IDTYPESENDER>
				<OWNER>${owner}</OWNER>
				<PHONE>${phone}</PHONE>
				<SENDERDOC>${senderDoc}</SENDERDOC>
				<SENDERLAST>${senderLast}</SENDERLAST>
				<SENDERNAME>${senderName}</SENDERNAME>
				<SENDERCARD>${senderCard}</SENDERCARD>
				<SSNUMBERSENDER>${SSNumberSender}</SSNUMBERSENDER>
				<STATE>${state}</STATE>
				<ZIP>${zip}</ZIP>
			</SENDER>
		</XPRESSO>`
		console.log(xmlData)
	}
}