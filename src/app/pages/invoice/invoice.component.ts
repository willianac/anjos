import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { InvoicesService } from "app/services/invoices/invoices.service";
import { SessionService } from "app/services/session/session.service";
import { Invoice } from "app/shared/invoices.resolver";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-invoice",
	templateUrl: "invoice.component.html",
	styleUrls: ["invoice.component.scss"]
})
export class InvoiceComponent implements OnInit {
	invoice: Invoice;
	baseUnit = "";

	constructor(
		private invoicesService: InvoicesService, 
		private activatedRouter: ActivatedRoute,
		private toast: ToastrService,
		private translate: TranslateService,
		private router: Router,
		private session: SessionService
	) {}

	private formatDate(date: string): string {
		const dt = new Date(date)
		return `${dt.getMonth() + 1}/${dt.getDate()}/${dt.getFullYear()} at ${(dt.getHours() < 10 ? "0" : "") + dt.getHours()}:${(dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes()}`
	}

	ngOnInit(): void {
		const invoiceNumber = this.activatedRouter.snapshot.params.number
		this.baseUnit = this.session.get("linkInfo").BaseUnit
		
		this.invoicesService.trackInvoice(invoiceNumber)
			.catch(err => {
				this.toast.error(this.translate.instant("SESSION_EXPIRED_TEXT"), this.translate.instant("SESSION_EXPIRED_TITLE"))
				this.router.navigate(["login"])
				throw new Error(err)
			})
			.subscribe({
				next: (res) => {
					res.STATUSDATE = this.formatDate(res.STATUSDATE)
					res.DATE = this.formatDate(res.DATE)
					this.invoice = res
				}
			})
	}
}