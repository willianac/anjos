import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { validate } from "gerador-validador-cpf"
import { SessionService } from "app/services/session/session.service";
import { NewReceiverService, ReceiverAccountResponse, ReceiverResponse } from "app/services/new-receiver/new-receiver.service";
import { validCNPJ } from "../../shared/cnpj-validator"
import { AddSenderReceiverKinshipResponse, KinshipService } from "app/services/kinship/kinships.service";
import { BankInfoService } from "app/services/bank-info/bank-info.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { State, GeographyService } from "app/services/geography/geography.service";
import { Observable } from "rxjs";

@Component({
	selector: "app-new-receiver",
	templateUrl: "./new-receiver.component.html",
	styleUrls: ["./new-receiver.component.scss"]
})
export class NewReceiverComponent implements OnInit {
	kinshipList = []
	stateList: State[] = []
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

	bankList = []
	receiverAccountForm = this.fb.group({
		bankName: ["", Validators.required],
		branch: ["", Validators.required],
		account: ["", Validators.required],
		accountType: ["", Validators.required],
		pix: ["", Validators.required]
	})
	isLoading = false;

	constructor(
		private fb: FormBuilder, 
		private toastr: ToastrService, 
		private router: Router, 
		private translate: TranslateService,
		private session: SessionService,
		private newReceiverService: NewReceiverService,
		private kinshipService: KinshipService,
		private bankService: BankInfoService,
		private statesService: GeographyService
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
		this.isLoading = true

		const senderID = this.session.get("linkInfo").SenderId
		let receiverID = ""

		this.createNewReceiver().switchMap((res) => {
			receiverID = res.RECEIVERID
			return this.createNewReceiverAccount(receiverID)
		})
		.switchMap(() => {
			return this.createSenderReceiverKinship(senderID, receiverID)
		})
		.subscribe({
			next: () => {
				this.toastr.success(
					this.translate.instant("RECEIVER_ADDED"),
					this.translate.instant("SUCCESS")
				)
				setTimeout(() => {
					this.isLoading = false
					this.router.navigate(['admin']);
				}, 3000)
			},
			error: (err) => {
				this.handleErrors(err)
				this.isLoading = false
			}
		})
	}

	private createNewReceiver(): Observable<ReceiverResponse> {
		return this.newReceiverService.addReceiver(
			this.receiverForm.get("country").value,
			this.removeAccents(this.receiverForm.get("firstName").value),
			this.removeAccents(this.receiverForm.get("surname").value),
			this.receiverForm.get("document").value,
			this.receiverForm.get("address").value,
			this.removeAccents(this.receiverForm.get("city").value),
			this.receiverForm.get("state").value,
			this.sanitizeZipCode(this.receiverForm.get("zip").value),
			this.sanitizePhone(this.receiverForm.get("phone").value),
			this.receiverForm.get("email").value
		)
	}

	private createNewReceiverAccount(receiverID: string): Observable<ReceiverAccountResponse> {
		return this.newReceiverService.addReceiverAccount(
			receiverID,
			this.bankList.find((bank) => this.receiverAccountForm.get("bankName").value === bank.BANKNAME),
			this.receiverAccountForm.get("branch").value,
			this.receiverAccountForm.get("account").value,
			this.receiverAccountForm.get("accountType").value,
			this.receiverAccountForm.get("pix").value
		)
	}

	private createSenderReceiverKinship(senderID: string, receiverID: string): Observable<AddSenderReceiverKinshipResponse> {
		const kinshipID = this.receiverForm.get("kinship").value;
		return this.kinshipService.addSenderReceiverKinship(kinshipID, senderID, receiverID)
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

	private sanitizePhone(phone: string) {
		return phone.replace(/[^\d\+]/g, '')
	}

	private sanitizeZipCode(zip: string) {
		return "#" + zip.replace(/[^\d]/g, '')
	}

	private removeAccents(str: string) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	}

	private handleErrors(error: any) {
		if(error.message === "Record already exists") {
			return this.toastr.error(
				this.translate.instant("RECEIVER_ALREADY_EXISTS_TEXT"),
				this.translate.instant("RECEIVER_ALREADY_EXISTS_TITLE")
			)
		}
		if(error.message === "Session key not found") {
			return this.toastr.error("Session key inválida", "Erro")
		}
		if(error.message === "Session Expired" || error === "Session Expired") {
			return this.toastr.error(
				this.translate.instant("SESSION_EXPIRED_TEXT"),
				this.translate.instant("SESSION_EXPIRED_TITLE")
			)
		}
		if(error.message === "Adding record failed") {
			return this.toastr.error("Erro ao tentar cadastrar um beneficiario", "Erro")
		}

		this.toastr.error(
			this.translate.instant("UNKNOWN_ERROR"),
			this.translate.instant("ERROR")
		)
	}

	ngOnInit() {
		const getKinships = this.kinshipService.getKinships()
		const getBanks = this.bankService.getBanks()

		forkJoin([getKinships, getBanks]).subscribe(([kinships, banks]) => {
			for(let kinship of kinships.KINSHIP) {
				this.kinshipList.push(kinship)
			}
			for(let bank of banks.BANK) {
				this.bankList.push(bank)
			}
		},
			error => {
				this.handleErrors(error)
			}
		)

		this.statesService.getStates("BR").subscribe((res) => {
			this.stateList = res.json()
		})

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