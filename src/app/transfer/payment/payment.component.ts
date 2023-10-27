import { AfterViewInit, Component, Inject, OnDestroy, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { SessionService } from "app/services/session/session.service";

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
	private totalPayment: string
	private externalID: string

	constructor(public renderer: Renderer2, @Inject(DOCUMENT) private _document: Document, public session: SessionService,) {
		this.totalPayment = this.session.get("total")
		this.externalID = this.session.get("externalID")
	}

	ngAfterViewInit(): void {
		let script = document.createElement("script") as HTMLScriptElement
		script.type = "text/javascript"
		script.id = "hosted-form-script"
		script.text = `
			(function() {
				var l = function() { 
					new PaymentGateway({ 
						target: 'payment-form', 
						url: e?.src, 
						options: {
							dbaId: 108202, 
							terminalId: 172601, 
							threeds: 'Disabled', 
							hash: '4b9b320f4b363ef823d9dd0dc2312b21', 
							externalId: ${this.externalID}, 
							amount: ${Number(this.totalPayment)}, 
							fee: '', 
							feeType: 'amount', 
							returnURL: 'http://transamericas.moneytransmittersystem.com/maverick/', 
							returnUrlNavigation: 'top', 
							logo: 'off', 
							visibleNote: 'No', 
							requestContactInfo: 'Yes', 
							requestBillingInfo: 'No', 
							sendReceipt: 'No', 
							origin: 'HostedForm'
						} 
					}); 
				};

				if(typeof window.PaymentGateway === 'undefined') {
					window.webroot = "https://dashboard.maverickpayments.com";
					var e = document.createElement('script'); e.async = true;
					e.src = window.webroot + "/js/gateway/payment.js?v=" + Date.now();
					document.getElementsByTagName('head')[0].appendChild(e);
					e.onload = e.onreadystatechange = function() { l(); }
				} else { l(); }
			}());
		`
		this.renderer.appendChild(this._document.body, script);
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

	ngOnDestroy() {
		(window as any).PaymentGateway = undefined
		let script = document.getElementById("hosted-form-script")
		if(script) {
			script.parentNode.removeChild(script)
		}
		this.clearStorage()
	}
}