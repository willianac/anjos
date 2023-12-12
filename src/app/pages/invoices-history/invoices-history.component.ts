import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Invoice } from "app/shared/invoices.resolver";

@Component({
	selector: 'app-invoices-history',
	templateUrl: 'invoices-history.component.html',
	styleUrls: ['invoices-history.component.scss']
})
export class InvoicesHistoryComponent implements OnInit {
	invoiceList: Invoice[] = [];

	constructor(private activatedRoute: ActivatedRoute) {}

	ngOnInit() {
		this.activatedRoute.data.subscribe({
			next: (res) => this.invoiceList = res.invoices.INVOICE
		})
	}
}