import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { validate } from "gerador-validador-cpf"
import { SessionService } from "app/services/session/session.service";
import { NewReceiverService } from "app/services/new-receiver/new-receiver.service";
import { validCNPJ } from "../../shared/cnpj-validator"
import { Kinship, KinshipService } from "app/services/kinship/kinships.service";
import { Bank, BankInfoService } from "app/services/bank-info/bank-info.service";

@Component({
	selector: "app-new-receiver",
	templateUrl: "./new-receiver.component.html",
	styleUrls: ["./new-receiver.component.scss"]
})
export class NewReceiverComponent implements OnInit {
	kinshipList: Kinship[]
	receiverForm = this.fb.group({
		country: ["", Validators.required],
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

	bankList: Bank[]
	receiverAccountForm = this.fb.group({
		bankName: ["", Validators.required],
		branch: ["", Validators.required],
		account: ["", Validators.required],
		pix: ["", Validators.required]
	})

	constructor(
		private fb: FormBuilder, 
		private toastr: ToastrService, 
		private router: Router, 
		private translate: TranslateService,
		private session: SessionService,
		private newReceiverService: NewReceiverService,
		private kinshipService: KinshipService,
		private bankService: BankInfoService
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
		
		const xmlData = this.createNewReceiverXml()

		this.toastr.success("O formulário foi preenchido corretamente.", "Formulário válido!")
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

	private createNewReceiverXml() {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const country = this.receiverForm.get("country").value;
		const firstName = this.receiverForm.get("firstName").value;
		const lastName = this.receiverForm.get("surname").value;
		const document = this.receiverForm.get("document").value;
		const address = this.receiverForm.get("address").value;
		const city = this.receiverForm.get("city").value;
		const state = this.receiverForm.get("state").value;
		const zip = this.sanitizeZipCode(this.receiverForm.get("zip").value);
		const phone = this.sanitizePhone(this.receiverForm.get("phone").value);
		const email = this.receiverForm.get("email").value;
		const kinship = this.receiverForm.get("kinship").value;
		const flag = "BR"
		const owner = this.session.get("linkInfo").BranchNo

		return `<?xml version='1.0'?>
		<?note XpAddReceiver?>

		<XPRESSO>
			<AUTHENTICATE>
				<SESSIONKEY>${sessionKey}</SESSIONKEY>
			</AUTHENTICATE>
			<RECEIVER>
				<ADDRESS>${address}</ADDRESS>
				<CELLPHONE>${phone}</CELLPHONE>
				<CITY>${city}</CITY>
				<COUNTRY>${country}</COUNTRY>
				<EMAIL>${email}</EMAIL>
				<FLAG>${flag}</FLAG>
				<OWNER>${owner}</OWNER>
				<PHONE>${phone}</PHONE>
				<RECEIVERDOC>${document}</RECEIVERDOC>
				<RECEIVERLAST>${lastName}</RECEIVERLAST>
				<RECEIVERNAME>${firstName}</RECEIVERNAME>
				<STATE>${state}</STATE>
				<ZIP>${zip}</ZIP>
			</RECEIVER>
		</XPRESSO>
		`
	}

	private createNewReceiverAccountXml() {
		const sessionKey = this.session.get("linkInfo").SessionKey
		const pix = this.receiverAccountForm.get("pix").value
		const branch = this.receiverAccountForm.get("branch").value
		const account = this.receiverAccountForm.get("account").value
		const bank = this.bankList.find((bank) => this.receiverAccountForm.get("bankName").value === bank.BANKNAME) as Bank

		return `<?xml version='1.0'?>
		<?note XpAddReceiverAccount?>
			<XPRESSO>
				<AUTHENTICATE>
					<SESSIONKEY>${sessionKey}</SESSIONKEY>
				</AUTHENTICATE>
				<RECEIVERACCOUNT>
						<ACCT>${pix ? pix : account}</ACCT>			
						<BANKBRANCH>${branch}</BANKBRANCH>
						<BANKNAME>${bank.BANKNAME}</BANKNAME>
						<BANKNUMBER>${bank.BANKNUMBER}</BANKNUMBER>
						<CITY></CITY>
						<RECEIVERID>4437</RECEIVERID>
						<STATE></STATE>
						<TYPE>C</TYPE>
				</RECEIVERACCOUNT>
			</XPRESSO>
		`
	}



	ngOnInit() {
		this.kinshipService.getKinships().subscribe((res: Kinship[]) => {
			this.kinshipList = res
		})
		this.bankService.getBanks().subscribe((res: Bank[]) => {
			this.bankList = res
		})

		this.receiverAccountForm.get("bankName").valueChanges.subscribe((val) => {
			if(val === "PIX") {
				this.receiverAccountForm.controls["branch"].clearValidators()
				this.receiverAccountForm.controls["account"].clearValidators()
				this.receiverAccountForm.controls["pix"].setValidators([Validators.required])
				this.receiverAccountForm.controls["branch"].setValue("")
				this.receiverAccountForm.controls["account"].setValue("")
			} else {
				this.receiverAccountForm.controls["branch"].setValidators([Validators.required])
				this.receiverAccountForm.controls["account"].setValidators([Validators.required])
				this.receiverAccountForm.controls["pix"].clearValidators()
				this.receiverAccountForm.controls["pix"].setValue("")
			}
			
			this.receiverAccountForm.get("branch").updateValueAndValidity();
			this.receiverAccountForm.get("account").updateValueAndValidity();
			this.receiverAccountForm.get("pix").updateValueAndValidity();
		})
	}
}