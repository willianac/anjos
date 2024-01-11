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
	private payorId;

	constructor(
		private route: ActivatedRoute, 
		private router: Router, 
		private session: SessionService,
		private translate: TranslateService,
		private transfer: TransferService,
		private toast: ToastrService
	) {}

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

	private displayToast(toastTitle: string, toastText) {
		this.toast.error(this.translate.instant(toastText), this.translate.instant(toastTitle))
	}

	ngOnInit() {
		this.purpose = this.session.get('currentPurpose');
		if(!this.purpose) {
			return this.router.navigate(['login'])
		}
		this.linkInfo = this.session.get('linkInfo');
		this.receiver = this.session.get('currentReceiver');
		if(this.session.get("payoutOptionSelected") === "cash") {
			this.receiverAccount = {}
			this.receiverAccount.AcctId = "0"
		} else {
			this.receiverAccount = this.session.get('currentReceiverAccount');
		}

		this.senderAccount = {
      aba: '000000000',
      account: '000000000000'
    };
    this.amount = {
      base: parseFloat(this.session.get('currentBase')).toFixed(2),
      send: parseFloat(this.session.get('currentSend')).toFixed(2)
    }

		if(this.session.get("payoutOptionSelected") === "deposit") {
			this.payorId = "0"
		} else {
			this.payorId = this.session.get("payoutLocationSelected").PayorId
		}

		this.route.queryParams.subscribe(params => {
			this.status = params["status"];

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
					this.status,
					this.payorId
				).subscribe((response) => {
					const statusCode = Number(response.StatusCode);
					switch (statusCode) {
						case 1:
							this.toast.success("Invoice: " + response.SendMoney, this.translate.instant("SUCCESS"))
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

			this.clearStorage()
		})
		this.checkIfLanguageIsSelected()
	}
}