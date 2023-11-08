import { Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";

@Component({
	selector: "app-new-receiver",
	templateUrl: "./new-receiver.component.html",
	styleUrls: ["./new-receiver.component.scss"]
})
export class NewReceiverComponent {
	receiverForm = this.fb.group({
		country: [""],
		fullName: [""],
		personType: [""],
		document: [""],
		address: [""],
		city: [""],
		state: [""],
		zip: [""],
		phone: [""],
		email: [""],
		kinship: [""]
	})

	constructor(private fb: FormBuilder) {}

	public teste() {
		console.log(this.receiverForm.getRawValue())
	}
}