import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BankInfoService } from "app/services/bank-info/bank-info.service";
import { GeographyService, State } from "app/services/geography/geography.service";
import { KinshipService } from "app/services/kinship/kinships.service";
import { NewReceiverService } from "app/services/new-receiver/new-receiver.service";
import { SessionService } from "app/services/session/session.service";
import { validCNPJ } from "app/shared/cnpj-validator";
import { validate } from "gerador-validador-cpf";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-generic-form",
	templateUrl: "generic-form.component.html",
	styleUrls: ["generic-form.component.scss"]
})
export class GenericFormComponent implements OnInit {
	@Output() submitEvent = new EventEmitter()

	@Input() kinshipList = []
	@Input() stateList: State[] = []
	receiverForm = this.fb.group({
		country: ["brazil", Validators.required],
		firstName: ["", [Validators.required, Validators.maxLength(40)]],
		surname: ["", [Validators.required, Validators.pattern(/^\w+$/), Validators.maxLength(20)]],
		personType: ["fisica", Validators.required],
		document: ["", [Validators.required, Validators.maxLength(30), Validators.maxLength(40)]],
		address: ["", [Validators.required, Validators.maxLength(60)]],
		city: ["", [Validators.required, Validators.maxLength(32)]],
		state: ["", [Validators.required, Validators.maxLength(3)]],
		zip: ["", [Validators.required, Validators.maxLength(10)]],
		phone: ["", [Validators.required, Validators.minLength(19)]],
		email: ["", [Validators.required, Validators.email, Validators.maxLength(40)]],
		kinship: ["", Validators.required]
	})

	@Input() bankList = []
	receiverAccountForm = this.fb.group({
		bankName: ["", Validators.required],
		branch: ["", Validators.required],
		account: ["", Validators.required],
		accountType: ["", Validators.required],
		pix: ["", Validators.required]
	})
	isLoading = false;
	countryFlag = ""

	constructor(
		private fb: FormBuilder, 
		private toastr: ToastrService, 
		private router: Router, 
		private translate: TranslateService,
		private session: SessionService,
		private newReceiverService: NewReceiverService,
		private kinshipService: KinshipService,
		private bankService: BankInfoService,
		private geographyService: GeographyService
	) {}

	@HostListener("keydown.backspace", ["$event"])
	keyDownBackspace(event){
		if(event.target.id === "phone") {
			const phone = this.receiverForm.get("phone").value.replace(/\D/g, '') as string
			if(phone.length <= 9) {
				this.receiverForm.get("phone").setValue(phone.substring(0, phone.length - 1))
			}
		}
	}

	public submit() {
		if(!this.receiverForm.valid || !this.isCPFValid() || !this.isCNPJValid() || !this.receiverAccountForm.valid) {
			return this.toastr.error(this.translate.instant("FILL_ALL_FIELDS"), this.translate.instant("FILL_FIELDS"))
		}
		this.submitEvent.emit({...this.receiverAccountForm.getRawValue(), ...this.receiverForm.getRawValue()})
	}

	public isCPFValid(): boolean {
		if(this.receiverForm.get("country").value === "brazil" && this.receiverForm.get("personType").value === "fisica") {
			const cpf = this.receiverForm.get("document").value
			return validate(cpf)
		}
		return true
	}

	public isCNPJValid(): boolean {
		if(this.receiverForm.get("country").value === "brazil" && this.receiverForm.get("personType").value === "juridica") {
			const cnpj = this.receiverForm.get("document").value
			return validCNPJ(cnpj)
		}
		return true
	}

	ngOnInit(): void {
		this.receiverAccountForm.get("bankName").valueChanges.subscribe((val) => {
			if(val === "PIX") {
				this.receiverAccountForm.controls["branch"].clearValidators()
				this.receiverAccountForm.controls["account"].clearValidators()
				this.receiverAccountForm.controls["accountType"].clearValidators()
				this.receiverAccountForm.controls["pix"].setValidators([Validators.required])
				this.receiverAccountForm.controls["branch"].setValue("")
				this.receiverAccountForm.controls["account"].setValue("")
				this.receiverAccountForm.controls["accountType"].setValue("C")
			} else {
				this.receiverAccountForm.controls["branch"].setValidators([Validators.required])
				this.receiverAccountForm.controls["account"].setValidators([Validators.required])
				this.receiverAccountForm.controls["accountType"].setValidators([Validators.required])
				this.receiverAccountForm.controls["pix"].clearValidators()
				this.receiverAccountForm.controls["pix"].setValue("")
			}
			
			this.receiverAccountForm.get("branch").updateValueAndValidity();
			this.receiverAccountForm.get("account").updateValueAndValidity();
			this.receiverAccountForm.get("pix").updateValueAndValidity();
		})
	}
}
