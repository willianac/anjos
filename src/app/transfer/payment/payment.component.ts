import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { QrBillService } from "app/services/qr-bill/qr-bill.service";
const SwissQRBill = require("swissqrbill");

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent {

	receiverForm = this.fb.group({
		name: [""],
		iban: [""],
		country: [""],
		postcode: [""],
		town: [""],
		street: [""],
		number: [""]
	})

	constructor(private fb: FormBuilder, private router: Router, private qrBillService: QrBillService) {}

	public data = {
		amount: 300,
		creditor: {
			account: "CH1830057072984410204",
			address: "Ettenbergstrasse",
			buildingNumber: 44,
			city: "Wettswil",
			country: "CH",
			name: "Anjos Express Imhof",
			zip: 8907
		},
		currency: 'CHF',
		debtor: {
			address: "Sonnhaldenstrasse",
			buildingNumber: 19,
			city: "Heerbrugg",
			country: "CH",
			name: "Alpha Rheintal Bank",
			zip: 9435
		},
		reference: "00 00007 29844 10204 00232 47902"
	}

	public nextPage() {
		const stream = SwissQRBill.BlobStream()
		try {
			const pdf = new SwissQRBill.PDF(this.data, stream)
			pdf.on("finish", () => {
				this.qrBillService.setBillSource(stream.toBlobURL("application/pdf"))
				this.router.navigate(["admin", "transfer", "qr-bill"])
			})
		} catch (error) {
			console.log("deu erro carai")
			console.log(error.message)
		}

		// const svg = new SwissQRBill.SVG(this.data)
		// const e = document.querySelector(".card-block") as HTMLDivElement
		// e.innerHTML = svg
	}
}