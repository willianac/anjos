import { Injectable } from "@angular/core";
import { SessionService } from "../session/session.service";
import { Http } from "@angular/http";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { XmlParserService } from "../xml-parser/xml-parser.service";
import { Observable } from "rxjs";


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

	getUserInvoices(): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const senderId = this.session.get("linkInfo").SenderId
		const xmlBody = `
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
		return this.http.post(this.url + "XpGetSenderHistoryById.cfm", xmlBody).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "SENDERHISTORY")
				.map((val) => {
					const fixedDatesInvoices = val.INVOICE.map((invoice) => {
						const dt = new Date(invoice.DATE)
						invoice.DATE = `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()}`
						return invoice
					})
					return fixedDatesInvoices
				})
		})
	}

	trackInvoice(invoiceNumber: string): Observable<any> {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const xmlBody = `
		<?note XpTrackInvoice.cfm?>
		<XPRESSO>
			<AUTHENTICATE>
				<SESSIONKEY>${sessionKey}</SESSIONKEY>
			</AUTHENTICATE>
			<TRACKINVOICE>
				<INVOICENUMBER>${invoiceNumber}</INVOICENUMBER>
			</TRACKINVOICE>
		</XPRESSO>
		`
		return this.http.post(this.url + "XpTrackInvoice.cfm", xmlBody).switchMap((res) => {
			return this.xmlParserService.parseXml(res, "TRACKINVOICE")
		})
	}
}