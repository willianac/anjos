import { AfterViewInit, Component, Inject, OnDestroy, Renderer2 } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser";
import { SessionService } from "app/services/session/session.service";
const setupData = require("../../../assets/setup/setup.json")
import { AppSetup } from 'assets/setup/setup';

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements AfterViewInit, OnDestroy {
	private totalPayment: string
	private externalID: string
	private returnLink = ""

	constructor(public renderer: Renderer2, @Inject(DOCUMENT) private _document: Document, public session: SessionService,) {
		this.totalPayment = this.session.get("total")
		this.externalID = this.session.get("externalID")

		const setup = setupData as AppSetup
		this.returnLink = setup.paymentGatewayReturnLink
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
							hash: '2e0c294c5a93e305b82296cb482a466b', 
							externalId: ${this.externalID}, 
							amount: ${Number(this.totalPayment)}, 
							fee: '', 
							feeType: 'amount', 
							returnURL: ${this.returnLink}, 
							returnUrlNavigation: 'top', 
							useLogo: 'No', 
							visibleNote: 'No', 
							requestContactInfo: 'No', 
							requestBillingInfo: 'Yes', 
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

	ngOnDestroy() {
		(window as any).PaymentGateway = undefined
		let script = document.getElementById("hosted-form-script")
		if(script) {
			script.parentNode.removeChild(script)
		}
	}
}