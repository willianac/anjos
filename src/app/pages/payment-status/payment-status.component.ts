import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { SessionService } from "app/services/session/session.service";
import { TransferService } from "app/services/transfer/transfer.service";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-payment-status",
	templateUrl: "./payment-status.component.html",
	styleUrls: ["./payment-status.component.scss"]
})
export class PaymentStatusComponent implements OnInit {
	public externalId: string;
	public status: string;

	private linkInfo;
	private receiver;
	private receiverAccount;
	private amount;
	private purpose;
	private senderAccount;

	constructor(
		private route: ActivatedRoute, 
		private router: Router, 
		private session: SessionService,
		private translate: TranslateService,
		private transfer: TransferService,
		private toast: ToastrService
	) {}

	// public navigateToHome() {
	// 	this.router.navigate(['admin'])
	// }

	private checkIfLanguageIsSelected() {
		const language = this.session.get("language")
		if(!language) this.session.set("language", "en")
	}

	private clearStorage() {
		this.session.remove('currentReceiver');
    this.session.remove('currentReceiverAccount');
    this.session.remove('currentPurpose');
    this.session.remove('currentBase');
    this.session.remove('currentSend');
		this.session.remove('total');
		this.session.remove('externalID')
	}

	ngOnInit() {
		this.purpose = this.session.get('currentPurpose');
		if(!this.purpose) {
			return this.router.navigate(['login'])
		}
		this.linkInfo = this.session.get('linkInfo');
		this.receiver = this.session.get('currentReceiver');
		this.receiverAccount = this.session.get('currentReceiverAccount');

		this.senderAccount = {
      aba: '000000000',
      account: '000000000000'
    };
    this.amount = {
      base: parseFloat(this.session.get('currentBase')).toFixed(2),
      send: parseFloat(this.session.get('currentSend')).toFixed(2)
    }

		this.route.queryParams.subscribe(params => {
			this.status = params["status"]

			if(this.status === "Success") {
				this.transfer.doTransfer(
					this.linkInfo.SessionKey,
					this.receiver.ReceiverID,
					this.receiverAccount.AcctId,
					this.amount.base,
					this.amount.send,
					this.purpose.PurposeId,
					this.senderAccount.account,
					this.senderAccount.aba,
					this.translate.currentLang || this.translate.defaultLang,
					this.status
				).subscribe((response) => {
					this.toast.success(this.translate.instant("INVOICE_NUMBER"), this.translate.instant("SUCCESS"))
				})
			}

			this.clearStorage()
		})
		this.checkIfLanguageIsSelected()
	}
}