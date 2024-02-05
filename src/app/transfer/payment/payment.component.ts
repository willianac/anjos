import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { SessionService } from "app/services/session/session.service";

@Component({
	selector: "app-payment",
	templateUrl: "./payment.component.html",
	styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent {

	receiverForm = this.fb.group({
		name: [""],
		iban: [""],
		country: [""],
		postcode: [""],
		town: [""],
		street: [""],
		number: [""]
	})

	constructor(private fb: FormBuilder) {

	}
}