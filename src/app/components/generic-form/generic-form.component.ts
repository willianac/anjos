import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { State } from "app/services/geography/geography.service";
import { SessionService } from "app/services/session/session.service";
import { validCNPJ } from "app/shared/cnpj-validator";
import { validate } from "gerador-validador-cpf";
import { ToastrService } from "ngx-toastr";

@Component({
	selector: "app-generic-form",
	templateUrl: "generic-form.component.html",
	styleUrls: ["generic-form.component.scss"]
})
export class GenericFormComponent implements OnInit, OnChanges {
	@Output() submitEvent = new EventEmitter()

	@Input() country = ""
	@Input() kinshipList = []
	@Input() stateList: State[] = []
	@Input() bankList = []

	receiverForm = this.fb.group({
		country: [""],
		firstName: ["", [Validators.required, Validators.maxLength(40)]],
		surname: ["", [Validators.required, Validators.pattern(/^\w+$/), Validators.maxLength(20)]],
		personType: ["fisica", Validators.required],
		document: ["", [Validators.required, Validators.maxLength(30), Validators.maxLength(40)]],
		address: ["", [Validators.required, Validators.maxLength(60)]],
		city: ["", [Validators.required, Validators.maxLength(32)]],
		state: ["", [Validators.required, Validators.maxLength(3)]],
		zip: ["", [Validators.required, Validators.maxLength(10)]],
		phone: ["", [Validators.required]],
		email: ["", [Validators.required, Validators.email, Validators.maxLength(40)]],
		kinship: ["", Validators.required]
	})
	receiverAccountForm = this.fb.group({
		bankName: ["", Validators.required],
		branch: [""],
		account: ["", Validators.required],
		accountType: ["", Validators.required],
		pix: [""]
	})

	constructor(
		private fb: FormBuilder, 
		private toastr: ToastrService,
		private translate: TranslateService,
		private session: SessionService
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
		if(this.receiverForm.get("country").value === "BRAZIL EXPRESS" && this.receiverForm.get("personType").value === "fisica") {
			const cpf = this.receiverForm.get("document").value
			return validate(cpf)
		}
		return true
	}

	public isCNPJValid(): boolean {
		if(this.receiverForm.get("country").value === "BRAZIL EXPRESS" && this.receiverForm.get("personType").value === "juridica") {
			const cnpj = this.receiverForm.get("document").value
			return validCNPJ(cnpj)
		}
		return true
	}

	private handleValidators() {
		const currentUnit = this.session.get("unitSelected")
		//aqui seria interessante buscar formas de remover esse hardcode
		if(currentUnit === "BRX") {
			this.receiverAccountForm.controls["branch"].setValidators([Validators.required])
			this.receiverAccountForm.get("branch").updateValueAndValidity()
			this.receiverForm.controls["phone"].setValidators([Validators.minLength(19)])
			this.receiverForm.get("phone").updateValueAndValidity()

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

	ngOnChanges(changes: SimpleChanges): void {
		if(changes.country) {
			if(this.country) {
				this.receiverForm.get("country").setValue(this.country)
			}
		}
	}

	ngOnInit(): void {
		this.handleValidators()
	}
}
