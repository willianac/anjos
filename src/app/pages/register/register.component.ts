import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';
import { SessionService } from 'app/services/session/session.service';
import { ApiRootResponse } from 'app/services/setup/ApiRootResponse';
import { GeographyService } from 'app/services/geography/geography.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerControls = this.fb.group({
		address: ["", [Validators.required, Validators.maxLength(40)]],
		city: ["", [Validators.required, Validators.maxLength(20)]],
		state: ["", Validators.required],
		idDocCountry: ["", Validators.required],
		birthdate: ["", Validators.required],
		docType: ["", Validators.required],
		cellphone: ["", [Validators.required, Validators.maxLength(30)]],
		homephone: ["", [Validators.maxLength(30)]],
		senderDoc: ["", [Validators.required, Validators.maxLength(40)]],
		senderLast: ["", [Validators.required, Validators.pattern(/^\w+$/), Validators.maxLength(20)]],
		senderName: ["", [Validators.required, Validators.maxLength(40)]],
		zipcode: ["", [Validators.required, Validators.maxLength(10)]],
		acceptTerms: [false, Validators.required]
	})

	countryList = [];
	idTypeList = [];
	validStates = [];
	registerPass = "";
	registerEmail = "";
	rootInfo: ApiRootResponse;

  constructor(
		private fb: FormBuilder,
		private newSenderService: NewSenderService,
		private toast: ToastrService,
		private session: SessionService,
		private countriesService: GeographyService,
		private translate: TranslateService,
		private router: Router
	) { }

	public submit() {
		if(!this.registerControls.valid) {
			return this.toast.error(this.translate.instant("FILL_ALL_FIELDS"), this.translate.instant("FILL_FIELDS"))
		}
		if(!this.isUserLegalAge()) {
			return this.toast.error(this.translate.instant("USER_ISNT_LEGAL_AGE"), this.translate.instant("ERROR"))
		}
		
		this.addNewSender()
	}

	private addNewSender() {
		const owner = this.rootInfo.Owner;
		const docType = this.idTypeList.find(item => item.IDTYPESENDER === this.registerControls.get("docType").value)
		const country = this.countryList.find(country => country.iso2 === this.registerControls.get("idDocCountry").value)
		const sessionKey = this.session.get("linkInfo")

		this.newSenderService.addNewSender(
			this.registerControls.get("address").value,
			this.sanitizePhone(this.registerControls.get("cellphone").value),
			this.registerControls.get("birthdate").value,
			this.registerControls.get("city").value,
			docType.IDTYPENAMESENDER,
			this.registerEmail,
			docType.IDTYPESENDER,
			owner,
			this.sanitizePhone(this.registerControls.get("homephone").value),
			this.registerControls.get("senderDoc").value,
			this.removeAccents(this.registerControls.get("senderLast").value),
			this.removeAccents(this.registerControls.get("senderName").value),
			this.registerControls.get("state").value,
			country.iso2,
			this.sanitizeZipCode(this.registerControls.get("zipcode").value),
			sessionKey,
			this.registerPass
		).catch((err) => {
			this.handleError(err.Message)
			throw new Error()
		})
		.subscribe({
			next: (res) => {
				this.session.remove("registerPass")
				this.session.remove("registerEmail")
				if(res.ACTIVATEDSENDER === "0") {
					this.toast.success(this.translate.instant("ACCOUNT_CONFIRMATION_ALERT"), this.translate.instant("SUCCESS"))
				} else {
					this.toast.success(this.translate.instant("SUCCESS_REGISTER"), this.translate.instant("SUCCESS"))
				}
				setTimeout(() => {
					this.router.navigate(['/login'])
				}, 1000)
			}
		})
	}

	private sanitizePhone(phone: string) {
		return "+" + phone.replace(/[^\d]/g, '')
	}

	private sanitizeZipCode(zip: string) {
		return "#" + zip.replace(/[^\d]/g, '')
	}

	private removeAccents(str: string) {
		return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	}

	private isUserLegalAge() {
		const birthYear = new Date(this.registerControls.get("birthdate").value).getFullYear()
		const currentYear = new Date().getFullYear()
		return currentYear - birthYear >= 18
	}

	private handleError(err: string) {
		if(err === "Session Expired") {
			return this.toast.error(
				this.translate.instant("SESSION_EXPIRED_TEXT"),
				this.translate.instant("SESSION_EXPIRED_TITLE")
			)
		}
		this.toast.error(this.translate.instant("UNKNOWN_ERROR"), this.translate.instant("ERROR"))
	}

	ngOnInit(): void {
		this.newSenderService.getSenderIdTypes()
		.catch(err => {
			this.handleError(err.message)
			throw new Error()
		}).subscribe((res) => {
			this.idTypeList = res.IDTYPE
		})

		this.countriesService.getCountries().subscribe((res) => {
			this.countryList = res.json()
		})

		this.registerPass = this.session.get("registerPass")
		this.registerEmail = this.session.get("registerEmail")

		this.rootInfo = JSON.parse(this.session.get("rootInfo"))
		this.validStates = this.rootInfo.ValidStates.split(",")
		
		setTimeout(() => {
			this.toast.warning(this.translate.instant("GEOLOCATION_WARNING") + this.validStates, this.translate.instant("IMPORTANT"))
		}, 1000)

	}
}