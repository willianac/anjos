import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';
import { SessionService } from 'app/services/session/session.service';
import { ApiRootResponse } from 'app/services/setup/ApiRootResponse';
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
		birthdate: ["", Validators.required],
		docType: ["", Validators.required],
		email: ["", [Validators.required, Validators.email, Validators.maxLength(40)]],
		cellphone: ["", [Validators.required, Validators.maxLength(30)]],
		homephone: ["", [Validators.maxLength(30)]],
		senderDoc: ["", [Validators.required, Validators.maxLength(40)]],
		senderLast: ["", [Validators.required, Validators.pattern(/^\w+$/), Validators.maxLength(20)]],
		senderName: ["", [Validators.required, Validators.maxLength(40)]],
		senderCard: [""],
		SSNumberSender: [""],
		zipcode: ["", [Validators.required, Validators.maxLength(10)]],
		acceptTerms: [false, Validators.required]
	})

	idTypeList = [];
	validStates = [];
	registerPass = "";
	rootInfo: ApiRootResponse;

  constructor(
		private fb: FormBuilder,
		private newSenderService: NewSenderService,
		private toast: ToastrService,
		private session: SessionService
	) { }

	public submit() {
		if(!this.registerControls.valid) {
			return this.toast.error("Preencha todos os campos para continuar", "Preencha os campos")
		}
		if(!this.registerControls.get("acceptTerms").value) {
			return this.toast.error("Por favor, aceite os termos e condições de uso.", "Termos e Condições")
		}
		this.toast.success("Agora seria feita a requisição para XpAddSender", "Formulário Válido!")
		this.addNewSender()
	}

	private addNewSender() {
		const owner = this.rootInfo.Owner;
		const docType = this.idTypeList.find(item => item.IDTYPESENDER === this.registerControls.get("docType").value)
		const sessionKey = this.session.get("linkInfo")

		this.newSenderService.addNewSender(
			this.registerControls.get("address").value,
			this.sanitizePhone(this.registerControls.get("cellphone").value),
			this.registerControls.get("birthdate").value,
			this.registerControls.get("city").value,
			docType.IDTYPENAMESENDER,
			this.registerControls.get("email").value,
			docType.IDTYPESENDER,
			owner,
			this.sanitizePhone(this.registerControls.get("homephone").value),
			this.registerControls.get("senderDoc").value,
			this.registerControls.get("senderLast").value,
			this.registerControls.get("senderName").value,
			this.registerControls.get("SSNumberSender").value,
			this.registerControls.get("state").value,
			this.sanitizeZipCode(this.registerControls.get("zipcode").value),
			sessionKey,
			this.registerControls.get("senderCard").value
		).subscribe({
			next: (res) => console.log(res)
		})
	}

	private sanitizePhone(phone: string) {
		return "+" + phone.replace(/[^\d]/g, '')
	}

	private sanitizeZipCode(zip: string) {
		return "#" + zip.replace(/[^\d]/g, '')
	}

	ngOnInit(): void {
		this.newSenderService.getSenderIdTypes().subscribe((res) => {
			this.idTypeList = res.IDTYPE
		})

		this.registerPass = this.session.get("registerPass")
		this.rootInfo = JSON.parse(this.session.get("rootInfo"))
		this.validStates = this.rootInfo.ValidStates.split(",")

		this.toast.warning("Para realizar remessas é necessário estar situado em Nova Jersey - USA", "Importante")
	}
}