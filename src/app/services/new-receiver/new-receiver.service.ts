import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import * as xml2js from 'xml2js';

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { Observable } from "rxjs";
import { SessionService } from "../session/session.service";

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

	constructor(private http: Http, private session: SessionService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}
	public addReceiver(xmlData: string) {
		return this.http.post(this.url + "XpAddReceiver.cfm", xmlData).switchMap((res) => {
			const body = res.text()
			const parser = new xml2js.Parser({explicitArray: false})

			return new Observable((observer) => {
				parser.parseString(body, (err, result) => {
					if(err) {
						observer.error(err)
					} else {
						observer.next(result.RECEIVER as ReceiverResponse)
						observer.complete()
					}
				})
			})
		})
	}

	public addReceiverAccount(xmlData: string) {

		return this.http.post(this.url + "XpAddReceiverAccount.cfm", xmlData).switchMap((res) => {
			const body = res.text()
			const parser = new xml2js.Parser({explicitArray: false})

			return new Observable((observer) => {
				parser.parseString(body, (err, result) => {
					if(err) {
						observer.error(err)
					} else {
						observer.next(result.RECEIVERACCOUNT as ReceiverAccountResponse)
						observer.complete()
					}
				})
			})
		})
	}
}