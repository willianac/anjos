import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InvoicesService } from "app/services/invoices/invoices.service";
import { Invoice } from "app/shared/invoices.resolver";

@Component({
	selector: "app-invoice",
	templateUrl: "invoice.component.html",
	styleUrls: ["invoice.component.scss"]
})
export class InvoiceComponent implements OnInit {
	invoice: Invoice;
	constructor(private invoicesService: InvoicesService, private activatedRouter: ActivatedRoute) {}

	private formatDate(date: string): string {
		const dt = new Date()
		return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()} at ${dt.getHours()}:${dt.getMinutes()}`
	}

	ngOnInit(): void {
		const invoiceNumber = this.activatedRouter.snapshot.params.number
		this.invoicesService.trackInvoice(invoiceNumber).subscribe({
			next: (res) => {
				res.STATUSDATE = this.formatDate(res.STATUSDATE)
				this.invoice = res
			}
		})
	}
}