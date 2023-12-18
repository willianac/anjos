import { Component, OnInit } from "@angular/core";
import { SessionService } from "app/services/session/session.service";

@Component({
	templateUrl: "cash-payment.component.html",
	selector: "app-cash-payment",
	styleUrls: ["cash-payment.component.scss"]
})
export class CashPaymentComponent implements OnInit {
	cityList = []
	constructor(private session: SessionService) {}

	ngOnInit(): void {
		const cities = this.session.get("payCities");
		delete cities.$;
		this.cityList = [...cities]
	}
}