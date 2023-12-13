import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Invoice } from "app/shared/invoices.resolver";
import { Subscription } from "rxjs";

@Component({
	selector: 'app-invoices-history',
	templateUrl: 'invoices-history.component.html',
	styleUrls: ['invoices-history.component.scss']
})
export class InvoicesHistoryComponent implements OnInit, OnDestroy {
	invoiceList: Invoice[] = [];
	invoiceSubscription: Subscription
	constructor(private activatedRoute: ActivatedRoute) {}

	ngOnInit() {
		this.invoiceSubscription = this.activatedRoute.data.subscribe({
			next: (res) => this.invoiceList = res.invoices
		})
	}

	ngOnDestroy() {
		this.invoiceSubscription.unsubscribe()
	}
}