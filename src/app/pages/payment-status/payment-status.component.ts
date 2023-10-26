import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SessionService } from "app/services/session/session.service";

@Component({
	selector: "app-payment-status",
	templateUrl: "./payment-status.component.html",
	styleUrls: ["./payment-status.component.scss"]
})
export class PaymentStatusComponent implements OnInit {
	public externalId: string;
	public status: string;

	constructor(
		private route: ActivatedRoute, 
		private router: Router, 
		private session: SessionService
	) {}

	public navigateToHome() {
		this.router.navigate(['admin'])
	}

	private checkIfLanguageIsSelected() {
		const language = this.session.get("language")
		if(!language) this.session.set("language", "en")
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.status = params["status"]

			if(!params.externalId) {
				this.router.navigate(['login'])
			}
		})
		this.checkIfLanguageIsSelected()
	}
}