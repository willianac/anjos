import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { InvoicesService } from "app/services/invoices/invoices.service";
const setupData = require("../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { Observable } from "rxjs";

export type Invoice = {
	BRANCHNO: string
	INVOICENUMBER: string
	DATE: string
	RECEIVERNAME: string
	RECEIVERLAST: string
	PAYMETHOD: string
	UNIT: string
	PAYRECEIVER: string
	INVOICESTATUS: string
	APPSTATUS: string
}

@Injectable()
export class InvoicesResolver implements Resolve<Invoice> {
	private url = ""
	constructor(private invoicesService: InvoicesService) {
		const setup = setupData as AppSetup
		this.url = setup.sampleApiCalls
	}

	resolve(): Observable<any> {
		return this.invoicesService.getUserInvoices()
	}
}