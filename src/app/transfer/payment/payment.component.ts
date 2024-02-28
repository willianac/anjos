import { Component } from "@angular/core";
import { QrBillService } from "app/services/qr-bill/qr-bill.service";
import { SenderService } from "app/services/sender/sender.service";
import { SessionService } from "app/services/session/session.service";
const SwissQRBill = require("swissqrbill");
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs";

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent {
	public appSetup: AppSetup;
	public isLoading = false;

	constructor(private session: SessionService, private senderService: SenderService, private toast: ToastrService) {
		this.appSetup = setupData
	}

	private getSender(): Observable<any> {
		return this.senderService.getSenderInfo(this.session.get("linkInfo").SenderId)
	}

	public copyIBAN() {
		window.navigator["clipboard"].writeText(this.appSetup.anjosAccount.account)
	}

	public generateQRBill() {
		this.isLoading = true
		this.getSender().subscribe({
			next: (res) => {
				const data = {
					amount: Number(this.session.get("currentBase")),
					creditor: {
						account: this.appSetup.anjosAccount.account,
						address: this.appSetup.anjosAccount.address,
						buildingNumber: this.appSetup.anjosAccount.buildingNumber,
						city: this.appSetup.anjosAccount.city,
						country: this.appSetup.anjosAccount.country,
						name: this.appSetup.anjosAccount.name,
						zip: this.appSetup.anjosAccount.zip
					},
					currency: 'CHF',
					reference: "00 00007 29844 10204 00232 47902",
					debtor: {
						address: res.ADDRESS,
						city: res.CITY,
						country: "CH",
						name: res.SENDERNAME + " " + res.SENDERLAST,
						zip: res.ZIP
					}
				}
				const stream = SwissQRBill.BlobStream()
				try {
					const pdf = new SwissQRBill.PDF(data, stream)
					pdf.on("finish", () => {
						const blob = stream.toBlobURL("application/pdf")
						const downloadLink = document.createElement("a")
						downloadLink.href = blob
						downloadLink.download = "qr-bill.pdf"
						downloadLink.click()
					})
					this.isLoading = false;
				} catch (error) {
					this.toast.error("Something happened.", "Unknown error")
					console.error(error)
					this.isLoading = false;
				}
			},
			error: (err) => {
				this.toast.error("Please, login again", err)
				this.isLoading = false;
			},
		})
	}
}