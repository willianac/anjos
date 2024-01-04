import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { SessionService } from "app/services/session/session.service";
import { NewReceiverService, ReceiverAccountResponse, ReceiverResponse } from "app/services/new-receiver/new-receiver.service";
import { AddSenderReceiverKinshipResponse, KinshipService } from "app/services/kinship/kinships.service";
import { BankInfoService } from "app/services/bank-info/bank-info.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { State, GeographyService } from "app/services/geography/geography.service";
import { Observable } from "rxjs";

type ReceiverInfoEvent = {
	country: string
	firstName: string
	surname: string
	personType: string
	document: string
	address: string
	city: string
	state: string
	zip: string
	phone: string
	email: string
	kinship: string
	bankName: string
	branch: string
	account: string
	accountType: string
	pix: string
}

@Component({
	selector: "app-new-receiver",
	templateUrl: "./new-receiver.component.html",
	styleUrls: ["./new-receiver.component.scss"]
})
export class NewReceiverComponent implements OnInit {
	kinshipList = []
	stateList: State[] = []
	bankList = []

	isLoading = false;
	isAfricanReceiver = false;
	countryFlag = "";
	country = ""

	receiverInfo: ReceiverInfoEvent;

	constructor(
		private toastr: ToastrService, 
		private router: Router, 
		private translate: TranslateService,
		private session: SessionService,
		private newReceiverService: NewReceiverService,
		private kinshipService: KinshipService,
		private bankService: BankInfoService,
		private geographyService: GeographyService
	) {}

	public submit(receiverObj: ReceiverInfoEvent) {
		this.receiverInfo = receiverObj
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
			this.receiverInfo.country,
			this.removeAccents(this.receiverInfo.firstName),
			this.removeAccents(this.receiverInfo.surname),
			this.receiverInfo.document,
			this.removeAccents(this.receiverInfo.address),
			this.removeAccents(this.receiverInfo.city),
			this.receiverInfo.state,
			this.sanitizeZipCode(this.receiverInfo.zip),
			this.sanitizePhone(this.receiverInfo.phone),
			this.receiverInfo.email
		)
	}

	private createNewReceiverAccount(receiverID: string): Observable<ReceiverAccountResponse> {
		return this.newReceiverService.addReceiverAccount(
			receiverID,
			this.bankList.find((bank) => this.receiverInfo.bankName === bank.BANKNAME),
			this.receiverInfo.branch,
			this.receiverInfo.account,
			this.receiverInfo.accountType,
			this.receiverInfo.pix
		)
	}

	private createSenderReceiverKinship(senderID: string, receiverID: string): Observable<AddSenderReceiverKinshipResponse> {
		const kinshipID = this.receiverInfo.kinship
		return this.kinshipService.addSenderReceiverKinship(kinshipID, senderID, receiverID)
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

	private checkIfIsAfricanReceiver() {
		const african = ["XOF", "KES", "GHS", "NGN", "UGX", "ZAR"]
		const currentUnit = this.session.get("unitSelected")

		african.forEach(unit => {
			if(unit === currentUnit) {
				this.isAfricanReceiver = true
			}
		})
	}

	ngOnInit() {
		this.checkIfIsAfricanReceiver()
		this.countryFlag = this.session.get("unitSelected").slice(0,2)
		const getKinships = this.kinshipService.getKinships()
		const getBanks = this.bankService.getBanks(this.countryFlag)

		forkJoin([getKinships, getBanks]).subscribe(([kinships, banks]) => {
			const banksArray = [...banks.BANK]
			this.country = banksArray[0].COUNTRY
			for(let kinship of kinships.KINSHIP) {
				this.kinshipList.push(kinship)
			}
			for(let bank of banksArray) {
				this.bankList.push(bank)
			}
		},
			error => {
				this.handleErrors(error)
			}
		)

		if(this.session.get("unitSelected") !== "XOF") {
			this.geographyService.getStates(this.countryFlag).subscribe((res) => {
				this.stateList = res.json()
			})
		}
	}
}