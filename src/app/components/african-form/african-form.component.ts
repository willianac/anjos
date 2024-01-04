import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BankInfoService } from "app/services/bank-info/bank-info.service";
import { GeographyService } from "app/services/geography/geography.service";
import { KinshipService } from "app/services/kinship/kinships.service";
import { NewReceiverService } from "app/services/new-receiver/new-receiver.service";
import { SessionService } from "app/services/session/session.service";
import { ToastrService } from "ngx-toastr";
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
	selector: "app-african-form",
	templateUrl: "african-form.component.html",
	styleUrls: ["african-form.component.scss"]
})
export class AfricanFormComponent implements OnInit {
	kinshipList = []
	stateList = []
	bankList = []
	xofCountries = [
		{
			name: "Benim",
			isoCode: "BEN"
		},
		{
			name: "Burquina-Fasso",
			isoCode: "BFA"
		},
		{
			name: "Guiné-Bissau",
			isoCode: "GNB"
		},
		{
			name: "Costa do Marfim",
			isoCode: "CIV"
		},
		{
			name: "Mali",
			isoCode: "MLI"
		},
		{
			name: "Níger",
			isoCode: "NER"
		},
		{
			name: "Senegal",
			isoCode: "SEN"
		},
		{
			name: "Togo",
			isoCode: "TGO"
		},
	]
	currentUnit = "";
	receiverForm = this.fb.group({
		country: [{name: "", isoCode: ""}, Validators.required],
		firstName: ["", [Validators.required, Validators.maxLength(40)]],
		surname: ["", [Validators.required, Validators.pattern(/^\w+$/), Validators.maxLength(20)]],
		personType: ["fisica", Validators.required],
		document: ["", [Validators.required, Validators.maxLength(30), Validators.maxLength(40)]],
		address: ["", [Validators.required, Validators.maxLength(60)]],
		city: ["", [Validators.required, Validators.maxLength(32)]],
		state: [{value: "", disabled: true}, [Validators.required]],
		zip: ["", [Validators.required, Validators.maxLength(10)]],
		phone: ["", [Validators.required, Validators.minLength(8)]],
		email: ["", [Validators.required, Validators.email, Validators.maxLength(40)]],
		kinship: ["", Validators.required]
	})

	receiverAccountForm = this.fb.group({
		bank: ["", Validators.required],
		account: ["", Validators.required]
	})
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private kinshipService: KinshipService,
		private bankService: BankInfoService,
		private session: SessionService,
		private geographyService: GeographyService,
		private newReceiverService: NewReceiverService,
		private toastr: ToastrService,
		private translate: TranslateService,
		private router: Router
	) {}

	public submit() {
		if(!this.receiverForm.valid || !this.receiverAccountForm.valid) {
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

	private createNewReceiver() {
		return this.newReceiverService.addReceiver(
			this.receiverForm.get("country").value.name,
			this.removeAccents(this.receiverForm.get("firstName").value),
			this.removeAccents(this.receiverForm.get("surname").value),
			this.receiverForm.get("document").value,
			this.removeAccents(this.receiverForm.get("address").value),
			this.removeAccents(this.receiverForm.get("city").value),
			this.receiverForm.get("state").value,
			this.sanitizeZipCode(this.receiverForm.get("zip").value),
			this.sanitizePhone(this.receiverForm.get("phone").value),
			this.receiverForm.get("email").value
		)
	}

	private createNewReceiverAccount(receiverID: string) {
		return this.newReceiverService.addReceiverAccount(
			receiverID,
			this.bankList.find((bank) => this.receiverAccountForm.get("bank").value === bank.BANKNAME),
			"",
			this.receiverAccountForm.get("account").value,
			"C",
			""
		)
	}

	private createSenderReceiverKinship(senderID: string, receiverID: string) {
		const kinshipID = this.receiverForm.get("kinship").value;
		return this.kinshipService.addSenderReceiverKinship(kinshipID, senderID, receiverID)
	}

	private sanitizePhone(phone: string) {
		return "+" + phone.replace(/[^\d\+]/g, '')
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

	private associateUnitToCountry(unit: string): string {
		let country;

		switch (unit) {
			case "BOB":
				country = "bolivia"
				break;
			case "BOD":
				country = "bolivia"
				break;
			case "GHS":
				country = "ghana"
				break;
			case "KES":
				country = "kenya"
				break;
			case "NGN":
				country = "nigeria"
				break;
			case "UGX":
				country = "uganda"
				break;
			case "ZAR":
				country = "zambia"
				break;
			default:
				country = ""
				break;
		}
		return country
	}

	private getInitialData() {
		const unit = this.session.get("unitSelected") as string
		const iso2 = unit.slice(0, 2)

		const getKinships = this.kinshipService.getKinships()
		const getBanks = this.bankService.getBanks(iso2)

		forkJoin([getKinships, getBanks]).subscribe(([kinships, banks]) => {
			for(let kinship of kinships.KINSHIP) {
				this.kinshipList.push(kinship)
			}
			for(let bank of [...banks.BANK]) {
				this.bankList.push(bank)
			}
		},
			error => {
				console.log(error)
			}
		)
		
		if(unit !== "XOF") {
			this.geographyService.getStates(iso2).subscribe((res) => {
				this.receiverForm.get("state").enable()
				this.stateList = res.json()
			})
			return this.receiverForm.get("country").setValue({name: this.associateUnitToCountry(unit), isoCode: ""})
		}
		this.currentUnit = unit
		
		this.receiverForm.get("country").valueChanges.subscribe((val) => {
			this.receiverForm.get("state").disable()
			const twoDigitsIso = val.isoCode.slice(0,2)
			this.geographyService.getStates(twoDigitsIso).subscribe(res => {
				this.receiverForm.get("state").enable()
				this.stateList = res.json()
			})
		})
	}

	ngOnInit(): void {
		this.getInitialData()
	}
}