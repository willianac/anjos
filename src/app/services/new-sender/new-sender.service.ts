import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { SessionService } from "../session/session.service";
import { XmlParserService } from "../xml-parser/xml-parser.service";
import { Observable } from "rxjs";

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
				.catch(err => {
					throw new Error(err)
				})
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
		state: string,
		country: string,
		zip: string,
		sessionKey: string,
		registerPassword: string
	): Observable<any> {
		const xmlData = `<?note XpAddsender?>
		<XPRESSO>
			<AUTHENTICATE>
				<SESSIONKEY>${sessionKey}</SESSIONKEY>
			</AUTHENTICATE>
			<SENDER>
				<MYPASSWORD>${registerPassword}</MYPASSWORD>
				<ADDRESS>${address}</ADDRESS>
				<CELLPHONE>${cellphone}</CELLPHONE>
				<CITY>${city}</CITY>
				<DOB>${birthdate}</DOB>
				<IDCOUNTRYSENDER>${country}</IDCOUNTRYSENDER>
				<DOCTYPE>${docType}</DOCTYPE>
				<EMAIL>${email}</EMAIL>
				<IDTYPESENDER>${idTypeSender}</IDTYPESENDER>
				<OWNER>${owner}</OWNER>
				<PHONE>${phone}</PHONE>
				<SENDERDOC>${senderDoc}</SENDERDOC>
				<SENDERLAST>${senderLast}</SENDERLAST>
				<SENDERNAME>${senderName}</SENDERNAME>
				<SSNUMBERSENDER></SSNUMBERSENDER>
				<STATE>${state}</STATE>
				<ZIP>${zip}</ZIP>
			</SENDER>
		</XPRESSO>`
		
		return this.http.post(this.url + "XpAddSender.cfm", xmlData).switchMap((res) => {
			return this.xmlParser.parseXml(res, "SENDER")
		})
	}
}