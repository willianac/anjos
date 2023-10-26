import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	selector: "app-payment-status",
	templateUrl: "./payment-status.component.html",
	styleUrls: ["./payment-status.component.scss"]
})
export class PaymentStatusComponent implements OnInit {
	public externalId: string;
	public status: string;

	constructor(private route: ActivatedRoute, private router: Router) {}

	public navigateToHome() {
		this.router.navigate(['admin'])
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.status = params["status"]
		})
	}

}