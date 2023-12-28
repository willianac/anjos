import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { Observable } from "rxjs";
import { SessionService } from "../session/session.service";
import { XmlParserService } from "../xml-parser/xml-parser.service";

export type ReceiverResponse = {
	RECEIVERID: string
	RECEIVERLAST: string
	RECEIVERNAME: string
}

export type ReceiverAccountResponse = {
	ACCTID: string
}

@Injectable()
export class NewReceiverService {
	private url = ""

	constructor(private http: Http, private session: SessionService, private xmlParserService: XmlParserService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	public addReceiver(
		country: string,
		firstName: string,
		lastName: string,
		document: string,
		address: string,
		city: string,
		state: string,
		zip: string,
		phone: string,
		email: string,
	): Observable<any> {
		const flag = this.session.get("unitSelected").slice(0,2)
		const owner = this.session.get("linkInfo").BranchNo
		const sessionKey = this.session.get("linkInfo").SessionKey

		const xmlData = `<?xml version='1.0'?>
		<?note XpAddReceiver?>
		<XPRESSO>
			<AUTHENTICATE>
				<SESSIONKEY>${sessionKey}</SESSIONKEY>
			</AUTHENTICATE>
			<RECEIVER>
				<ADDRESS>${address}</ADDRESS>
				<CELLPHONE>${phone}</CELLPHONE>
				<CITY>${city}</CITY>
				<COUNTRY>${country}</COUNTRY>
				<EMAIL>${email}</EMAIL>
				<FLAG>${flag}</FLAG>
				<OWNER>${owner}</OWNER>
				<PHONE>${phone}</PHONE>
				<RECEIVERDOC>${document}</RECEIVERDOC>
				<RECEIVERLAST>${lastName}</RECEIVERLAST>
				<RECEIVERNAME>${firstName}</RECEIVERNAME>
				<STATE>${state}</STATE>
				<ZIP>${zip}</ZIP>
			</RECEIVER>
		</XPRESSO>`

		return this.http.post(this.url + "XpAddReceiver.cfm", xmlData).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "RECEIVER")
			.do((res) => {
				if(res.ERROR) {
					throw new Error(res.MESSAGE)
				}
			})
		})
	}

	public addReceiverAccount(
		receiverID: string,
		bank: any,
		branch: string,
		account: string,
		accountType: string,
		pix: string
	): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey

		const xmlData = `<?xml version='1.0'?>
		<?note XpAddReceiverAccount?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
				<RECEIVERACCOUNT>
						<ACCT>${pix ? pix : account}</ACCT>			
						<BANKBRANCH>${branch}</BANKBRANCH>
						<BANKNAME>${bank.BANKNAME}</BANKNAME>
						<BANKNUMBER>${bank.BANKNUMBER}</BANKNUMBER>
						<CITY></CITY>
						<RECEIVERID>${receiverID}</RECEIVERID>
						<STATE></STATE>
						<TYPE>${accountType}</TYPE>
				</RECEIVERACCOUNT>
			</XPRESSO>`

		return this.http.post(this.url + "XpAddReceiverAccount.cfm", xmlData).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "RECEIVERACCOUNT")
			.do((res) => {
				if(res.ERROR) {
					throw new Error(res.MESSAGE)
				}
			})
		})
	}
}