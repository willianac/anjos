import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "app/services/session/session.service";

@Component({
	templateUrl: "cash-payment.component.html",
	selector: "app-cash-payment",
	styleUrls: ["cash-payment.component.scss"]
})
export class CashPaymentComponent implements OnInit {
	cityList = []
	constructor(private session: SessionService, private router: Router) {}

	public select(city: any) {
		this.session.remove("currentReceiverAccount")
		this.session.set("payoutLocationSelected", city)
		this.router.navigate(["admin", "transfer", "purposeList"])
	}

	ngOnInit(): void {
		 const cities = this.session.get("payOptions").CashPayoutLocation;
		 delete cities.$;
		 this.cityList = [...cities]
	}
}