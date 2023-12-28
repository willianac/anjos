import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BankInfoService } from "app/services/bank-info/bank-info.service";
import { GeographyService } from "app/services/geography/geography.service";
import { KinshipService } from "app/services/kinship/kinships.service";
import { SessionService } from "app/services/session/session.service";
import { forkJoin } from "rxjs/observable/forkJoin";

@Component({
	selector: "app-new-receiver-generic-form",
	templateUrl: "new-receiver-generic-form.component.html",
	styleUrls: ["new-receiver-generic-form.component.scss"]
})
export class NewReceiverGenericFormComponent implements OnInit {
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
		phone: ["", [Validators.required, Validators.minLength(19)]],
		email: ["", [Validators.required, Validators.email, Validators.maxLength(40)]],
		kinship: ["", Validators.required]
	})

	receiverAccountForm = this.fb.group({
		bank: ["", Validators.required],
		account: ["", Validators.required]
	})

	constructor(
		private fb: FormBuilder,
		private kinshipService: KinshipService,
		private bankService: BankInfoService,
		private session: SessionService,
		private geographyService: GeographyService
	) {}

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
			for(let bank of banks.BANK) {
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