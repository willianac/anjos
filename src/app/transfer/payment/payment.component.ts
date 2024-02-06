import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
const SwissQRBill = require("swissqrbill");
import * as fs from "fs";

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

	public data = {
		amount: 300,
		creditor: {
			account: "CH18 3005 7072 9844 1020 4",
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

	public teste() {
		const stream = SwissQRBill.BlobStream()
		const pdf = new SwissQRBill.PDF(this.data, stream)

		pdf.on("finish", () => {
			const iframe = document.getElementById("iframe") as HTMLIFrameElement;
			if(iframe){
				iframe.src = stream.toBlobURL("application/pdf");
				console.log("criado")
			}
			console.log("PDF has been successfully created.");
		})

		// const svg = new SwissQRBill.SVG(this.data)
		// const e = document.querySelector(".card-block") as HTMLDivElement
		// e.innerHTML = svg
	}

	constructor(private fb: FormBuilder) {}
}