import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SessionService } from "app/services/session/session.service";

@Component({
	templateUrl: "cash-payment.component.html",
	selector: "app-cash-payment",
	styleUrls: ["cash-payment.component.scss"]
})
export class CashPaymentComponent implements OnInit {
	cityList = [];
	filteredCityList = [];
	country = "";

	constructor(private session: SessionService, private router: Router) {}

	public searchCity(searchTerm: string) {
		const filtered = this.cityList.filter(city => {
			return city.City.toLowerCase().includes(searchTerm.toLowerCase())
		})
		this.filteredCityList = filtered
	}

	public select(city: any) {
		this.session.remove("currentReceiverAccount")
		this.session.set("payoutLocationSelected", city)
		this.router.navigate(["admin", "transfer", "purposeList"])
	}

	private handleDefaultValues() {
		this.country = this.session.get("unitSelected").slice(0,2)
		const locations = this.session.get("payOptions").CashPayoutLocation as any[];

		const sanitizedCities = [...locations].map(location => {
			const sanitized = location.City.replace(/[\d-]/g, "")
			return {...location, City: sanitized}
		})
		this.cityList = [...sanitizedCities]
		this.filteredCityList = [...sanitizedCities]
	}

	ngOnInit(): void {
		this.handleDefaultValues()
	}
}