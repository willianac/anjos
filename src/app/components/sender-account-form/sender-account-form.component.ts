import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { GeographyService } from "app/services/geography/geography.service";
import { SessionService } from "app/services/session/session.service";

@Component({
	selector: "senderAccountForm",
	templateUrl: "sender-account-form.component.html",
	styleUrls: ["sender-account-form.component.scss"]
})
export class SenderAccountForm implements OnInit {
	citiesList = []
	senderAccountForm = this.fb.group({
		name: [""],
		city: [""],
		zipcode: [""],
		address: [""],
		buildingNumber: [""]
	})

	@Output() newAccountEvent = new EventEmitter()

	constructor(private geographyService: GeographyService, private fb: FormBuilder, private session: SessionService) {}

	public createAccount() {
		const newSenderAccount = this.senderAccountForm.getRawValue()
		this.appendAccountToLocalStorage(newSenderAccount)
	}

	private appendAccountToLocalStorage(account: any) {
		if(!this.session.get("senderAccounts")) {
			this.session.set("senderAccounts", JSON.stringify([]))
		}
		const previousAccounts = JSON.parse(this.session.get("senderAccounts")) as any[]
		previousAccounts.push(account)
		this.session.set("senderAccounts", JSON.stringify(previousAccounts))

		this.newAccountEvent.emit()
	}

	ngOnInit(): void {
		this.geographyService.getAllCitiesWithinCountry("CH").subscribe({
			next: (res) => this.citiesList = res.json()
		})
	}
}