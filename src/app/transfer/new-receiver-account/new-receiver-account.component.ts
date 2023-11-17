import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BankInfoService } from "app/services/bank-info/bank-info.service";
import { NewReceiverService } from "app/services/new-receiver/new-receiver.service";
import { SessionService } from "app/services/session/session.service";
import { error } from "console";
import { ToastrService } from "ngx-toastr";


@Component({
	selector: "app-new-receiver-account",
	templateUrl: "./new-receiver-account.component.html",
	styleUrls: ["./new-receiver-account.component.scss"]
})
export class NewReceiverAccountComponent implements OnInit {
	receiverID = ""
	bankList = []
	receiverAccountForm = this.fb.group({
		bankName: ["", Validators.required],
		branch: ["", Validators.required],
		account: ["", Validators.required],
		pix: ["", Validators.required]
	})
	
	constructor(
		private bankService: BankInfoService, 
		private session: SessionService, 
		private fb: FormBuilder,
		private newReceiverService: NewReceiverService,
		private translate: TranslateService,
		private toastr: ToastrService,
		private router: Router
	) {}

	public submit() {
		if(!this.receiverAccountForm.valid) {
			return this.toastr.error(this.translate.instant("FILL_ALL_FIELDS"), this.translate.instant("FILL_FIELDS"))
		}
		this.newReceiverService.addReceiverAccount(
			this.receiverID,
			this.bankList.find((bank) => this.receiverAccountForm.get("bankName").value === bank.BANKNAME),
			this.receiverAccountForm.get("branch").value,
			this.receiverAccountForm.get("account").value,
			this.receiverAccountForm.get("pix").value
		)
		.subscribe({
			next: (res) => {
				this.toastr.success(
					this.translate.instant("ACCOUNT_ADDED"),
					this.translate.instant("SUCCESS")
				)
				setTimeout(() => {
					this.router.navigate(['admin']);
				}, 3000)
			},
			error: (err) => this.toastr.error(
				this.translate.instant("ACCOUNT_ALREADY_EXISTS_TEXT"),
				this.translate.instant("ACCOUNT_ALREADY_EXISTS_TITLE")
			)
		})
		
	}

	ngOnInit(): void {
		this.bankService.getBanks().subscribe((res) => {
			this.bankList = res.BANK
		},
		error => {
			this.toastr.error(
				this.translate.instant("SESSION_EXPIRED_TEXT"),
				this.translate.instant("SESSION_EXPIRED_TITLE")
			)
		}
		)

		this.receiverID = this.session.get("currentReceiver").ReceiverID

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