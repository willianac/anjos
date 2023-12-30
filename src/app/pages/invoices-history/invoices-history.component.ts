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
	showDropdown = false;
	sortType = "";

	constructor(private activatedRoute: ActivatedRoute) {}

	public sortBy(property: string) {
		this.invoiceList.sort((a,b) => {
			if(a[property] > b[property]) return 1
			if(b[property] > a[property]) return -1
			return 0
		})
		if(property === "INVOICENUMBER") this.sortType = "Invoice Nº"
		if(property === "RECEIVERNAME") this.sortType = "Receiver"
	}

	public sortByAmount() {
		this.invoiceList.sort((a,b) => {
			if(Number(a.INVOICETOTAL) > Number(b.INVOICETOTAL)) return -1
			if(Number(b.INVOICETOTAL) > Number(a.INVOICETOTAL)) return 1
			return 0
		})
		this.sortType = "Amount"
	}

	public sortByDate() {
		this.invoiceList.sort((a,b) => {
			if(new Date(a.DATE) > new Date(b.DATE)) return -1
			if(new Date(b.DATE) > new Date(a.DATE)) return 1
			return 0
		})
		this.sortType = "Date"
	}

	public toggleDropdown() {
		this.showDropdown = !this.showDropdown
	}

	ngOnInit() {
		this.invoiceSubscription = this.activatedRoute.data.subscribe({
			next: (res) => {
				this.invoiceList = res.invoices
			}
		})
	}

	ngOnDestroy() {
		this.invoiceSubscription.unsubscribe()
	}
}