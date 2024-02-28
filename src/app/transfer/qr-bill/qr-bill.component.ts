import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { QrBillService } from "app/services/qr-bill/qr-bill.service";
import { SessionService } from "app/services/session/session.service";
import { TransferService } from "app/services/transfer/transfer.service";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "qrBill",
	templateUrl: "qr-bill.component.html",
	styleUrls: ["qr-bill.component.scss"]
})
export class QrBillComponent implements OnInit, AfterViewInit {
	private qrBillSource;

	constructor(
		private qrBillService: QrBillService, 
		private renderer: Renderer2, 
		private elem: ElementRef, 
		private router: Router,
		private transferService: TransferService,
		private translateService: TranslateService,
		private session: SessionService,
		private toastr: ToastrService
	) {}

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
					this.toastr.success("Invoice: " + response.SendMoney, this.translateService.instant("SUCCESS"))
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

	private displayToast(toastTitle: string, toastText) {
		this.toastr.error(this.translateService.instant(toastText), this.translateService.instant(toastTitle))
	}

	ngOnInit(): any {
		this.qrBillSource = this.qrBillService.getBillSource()
		if(!this.qrBillSource) {
			return this.router.navigate(["admin", "transfer", "amount"])
		}
	}

	ngAfterViewInit(): void {
		if(!this.qrBillSource) return
		
		const source = this.qrBillService.getBillSource()
		const iframe = this.elem.nativeElement.querySelector("#iframe")
		this.renderer.setAttribute(iframe, "src", source)
	}
}