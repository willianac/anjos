import { AfterViewInit, Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { SenderService } from "app/services/sender/sender.service";
import { SessionService } from "app/services/session/session.service";
import { TransferService } from "app/services/transfer/transfer.service";
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
export class PaymentComponent implements AfterViewInit {
	public appSetup: AppSetup;
	public isLoading = false;

	constructor(
		private session: SessionService, 
		private senderService: SenderService, 
		private toast: ToastrService, 
		private transferService: TransferService,
		private translateService: TranslateService
		) {
		this.appSetup = setupData
	}

	private getSender(): Observable<any> {
		return this.senderService.getSenderInfo(this.session.get("linkInfo").SenderId)
	}

	private displayToast(toastTitle: string, toastText) {
		this.toast.error(this.translateService.instant(toastText), this.translateService.instant(toastTitle))
	}

	public copyIBAN() {
		window.navigator["clipboard"].writeText(this.appSetup.anjosAccount.account)
		this.toast.success("Copiado para área de transferência", "Copiado")
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
	
	private createInvoice() {
		this.transferService.doTransfer(
			this.session.get("linkInfo").SessionKey,
			this.session.get("currentReceiver").ReceiverID,
			this.session.get("currentReceiverAccount").AcctId,
			this.session.get("currentBase"),
			this.session.get("currentSend"),
			this.session.get("currentPurpose").PurposeId,
			"000000000",
			"000000000",
			this.translateService.currentLang || this.translateService.defaultLang
		).subscribe((response) => {
			const statusCode = Number(response.StatusCode);
			switch (statusCode) {
				case 1:
					this.toast.success("Invoice: " + response.SendMoney, this.translateService.instant("SUCCESS"))
					break;
				case -2:
					this.session.clear();
					this.displayToast('SESSION_EXPIRED_TITLE', 'SESSION_EXPIRED_TEXT');
					break;
				case -4:
					this.displayToast('DAYLI_SENDER_EXCEEDED_TITLE', 'DAYLI_SENDER_EXCEEDED_TEXT');
					break;
				case -5:
					this.displayToast('DAYLI_RECEIVER_EXCEEDED_TITLE', 'DAYLI_RECEIVER_EXCEEDED_TEXT');
					break;
				case -8:
					this.displayToast('ERROR', response.SendMoney);
					break;
				case -9:
					this.displayToast('ERROR', 'BANK_LENGTH_ERROR');
					break;
				case -10:
					this.displayToast('ERROR', 'ABA_LENGTH_ERROR');
					break;
				default:
					this.displayToast('ERROR', 'UNKNOWN_RESPONSE')
					break;
			}
		})
	}

	ngAfterViewInit(): void {
		this.createInvoice()
	}
}