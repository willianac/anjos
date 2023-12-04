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
	//private externalID: string
	private returnLink = ""

	constructor(public renderer: Renderer2, @Inject(DOCUMENT) private _document: Document, public session: SessionService,) {
		this.totalPayment = this.session.get("total")
		//this.externalID = this.session.get("externalID")

		const setup = setupData as AppSetup
		this.returnLink = setup.paymentGatewayReturnLink
	}

	ngAfterViewInit(): void {
		console.log(this.totalPayment)
		let script = document.createElement("script") as HTMLScriptElement
		script.type = "text/javascript"
		script.id = "hosted-form-script"
		script.text = `
			(function() {
				const options = {
					"data":"eyJkYmFJZCI6IjEwODIwMiIsInRlcm1pbmFsSWQiOiIxNzI2MDEiLCJ0aHJlZWRzIjoiRGlzYWJsZWQiLCJleHRlcm5hbElkIjoiIiwicmV0dXJuVXJsIjoiaHR0cHM6XC9cL3RyYW5zZmVyYW1lcmljYXMubW9uZXl0cmFuc21pdHRlcnN5c3RlbS5jb21cL21hdmVyaWNrXC8iLCJyZXR1cm5VcmxOYXZpZ2F0aW9uIjoic2VsZiIsImxvZ28iOm51bGwsInZpc2libGVOb3RlIjpudWxsLCJyZXF1ZXN0Q29udGFjdEluZm8iOm51bGwsInJlcXVlc3RCaWxsaW5nSW5mbyI6IlllcyIsInNlbmRSZWNlaXB0IjpudWxsLCJvcmlnaW4iOiJIb3N0ZWRGb3JtIiwiaGFzaCI6ImY1Yjc0NmZlYjVmZmU5YWU5YzE4NjJmM2U5NjE5MjdiIn0%3D",
					"amount":${this.totalPayment},
					"fee":"",
					"feeType":"amount",
					"billingInfo":{
						"country":"United States",
						"address":"",
						"address2":"",
						"city":"",
						"state":"",
						"zip":""
					}
				};

				const l = function() {
					new PaymentGateway({
						target: "payment-form",
						options: options
					}); 
				};

				if(typeof window.PaymentGateway === "undefined") {
					window.webroot = "https://dashboard.maverickpayments.com";
					const e = document.createElement("script"); e.async = true;
					e.src = window.webroot + "/js/gateway/payment.js?v=" + Date.now();
					document.getElementsByTagName("head")[0].appendChild(e);
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