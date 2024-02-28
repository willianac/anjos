import { Component, OnInit } from "@angular/core";
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
export class PaymentComponent implements OnInit {
	public message = ""
	public accountList = []
	public selectedAccountName;
	public appSetup: AppSetup;

	constructor(private router: Router, private qrBillService: QrBillService, private session: SessionService) {
		console.log(SwissQRBill.utils.calculateQRReferenceChecksum("00000000000000000000000325"))
		this.appSetup = setupData
	}

	public selectAccount(acc: any) {
		this.selectedAccountName = acc.name
	}

	public nextPage() {
		const senderAccount = this.accountList.find(acc => acc.name === this.selectedAccountName)
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
			debtor: {
				address: senderAccount.address,
				buildingNumber: senderAccount.buildingNumber,
				city: senderAccount.city,
				country: "CH",
				name: senderAccount.name,
				zip: senderAccount.zipcode
			},
			reference: "00 00000 00000 00100 00112 21007"
		}
			
		// const stream = SwissQRBill.BlobStream()
		// try {
		// 	const pdf = new SwissQRBill.PDF(data, stream)
		// 	pdf.on("finish", () => {
		// 		this.qrBillService.setBillSource(stream.toBlobURL("application/pdf"))
		// 		this.router.navigate(["admin", "transfer", "qr-bill"])
		// 	})
		// } catch (error) {
		// 	console.error(error)
		// 	this.handleBillGeneratorErrors(error.message)
		// }

		try {
			const svg = new SwissQRBill.SVG(data)
			this.qrBillService.setBillSource(svg)
			this.router.navigate(["admin", "transfer", "qr-bill"])
		} catch (error) {
			console.error(error)
			this.handleBillGeneratorErrors(error.message)
		}

		// const svg = new SwissQRBill.SVG(this.data)
		// const e = document.querySelector(".card-block") as HTMLDivElement
		// e.innerHTML = svg
	}

	private handleBillGeneratorErrors(err: string) {
		if(err.startsWith("The provided IBAN number")) {
			return this.message = "Invalid IBAN"
		}

		if(err.endsWith("2 characters")) {
			return this.message = "Country must have 2 characters."
		}

		return this.message = "Unexpected error"

	}

	ngOnInit(): void {
		this.accountList = JSON.parse(this.session.get("senderAccounts"))
	}
}