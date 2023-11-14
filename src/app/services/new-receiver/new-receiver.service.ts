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

	public addReceiver(xmlData: string): Observable<any> {
		return this.http.post(this.url + "XpAddReceiver.cfm", xmlData).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "RECEIVER")
		})
	}

	public addReceiverAccount(xmlData: string): Observable<any> {
		return this.http.post(this.url + "XpAddReceiverAccount.cfm", xmlData).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "RECEIVERACCOUNT")
		})
	}
}