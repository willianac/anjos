import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { QrBillService } from "app/services/qr-bill/qr-bill.service";
import { SessionService } from "app/services/session/session.service";
const SwissQRBill = require("swissqrbill");

const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent {
	public appSetup: AppSetup;

	constructor(private router: Router, private qrBillService: QrBillService, private session: SessionService) {
		this.appSetup = setupData
	}

	public copyIBAN() {
		window.navigator["clipboard"].writeText(this.appSetup.anjosAccount.account)
	}

	public generateQRBill() {
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
			reference: "00 00007 29844 10204 00232 47902"
		}
			
		const stream = SwissQRBill.BlobStream()
		try {
			const pdf = new SwissQRBill.PDF(data, stream)
			pdf.on("finish", () => {
				this.qrBillService.setBillSource(stream.toBlobURL("application/pdf"))
				this.router.navigate(["admin", "transfer", "qr-bill"])
			})
		} catch (error) {
			console.error(error)
		}
	}
}