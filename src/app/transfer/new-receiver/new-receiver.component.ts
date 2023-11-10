import { Component, HostListener } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-new-receiver",
	templateUrl: "./new-receiver.component.html",
	styleUrls: ["./new-receiver.component.scss"]
})
export class NewReceiverComponent {
	receiverForm = this.fb.group({
		country: ["", Validators.required],
		firstName: ["", Validators.required],
		surname: ["", [Validators.required, Validators.pattern(/^\w+$/)]],
		personType: ["fisica", Validators.required],
		document: ["", Validators.required],
		address: ["", Validators.required],
		city: ["", Validators.required],
		state: ["", Validators.required],
		zip: ["", Validators.required],
		phone: ["", [Validators.required, Validators.minLength(19)]],
		countryCode: ["" ],
		email: ["", [Validators.required, Validators.email]],
		kinship: ["", Validators.required]
	})

	constructor(
		private fb: FormBuilder, 
		private toastr: ToastrService, 
		private router: Router, 
		private translate: TranslateService
	) {}

	@HostListener("keydown.backspace", ["$event"])
	keyDownBackspace(event){
		if(event.target.id === "phone") {
			this.maskPhone(event, true)
		}
	}

	public submit() {
		if(!this.receiverForm.valid) {
			return this.toastr.error(this.translate.instant("FILL_ALL_FIELDS"), this.translate.instant("FILL_FIELDS"))
		}
		this.router.navigate(["admin", "transfer", "new", "receiver-account"])
	}

	public maskPhone(event: any, backspace: boolean) {
		let newVal = event.target.value.replace(/\D/g, '') as string; // Remove non-digit characters

		if (backspace && newVal.length <= 9) {
      newVal = newVal.substring(0, newVal.length - 1);
    }

		if (newVal.length <= 2) {
			newVal = `+ ${newVal}`;
		} else if (newVal.length <= 4) {
			newVal = `+ ${newVal.slice(0, 2)} (${newVal.slice(2)})`;
		} else if (newVal.length <= 12) {
			newVal = `+ ${newVal.slice(0, 2)} (${newVal.slice(2, 4)}) ${newVal.slice(4, 8)}-${newVal.slice(8)}`;
		} else {
			newVal = `+ ${newVal.slice(0, 2)} (${newVal.slice(2, 4)}) ${newVal.slice(4, 9)}-${newVal.slice(9)}`;
		}
		this.receiverForm.get("phone").setValue(newVal)
	}
}