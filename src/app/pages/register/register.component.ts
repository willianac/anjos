import { Component, HostListener, OnInit } from '@angular/core';
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
		address: ["", Validators.required],
		city: ["", Validators.required],
		state: ["", Validators.required],
		birthdate: ["", Validators.required],
		docType: ["", Validators.required],
		email: ["", [Validators.required, Validators.email]],
		//idCountrySender: [""],
		//idTypeSender: [""],
		//owner: [""],
		cellphone: ["", [Validators.required, Validators.maxLength(19)]],
		homephone: [""],
		//senderCard: [""],
		senderDoc: ["", Validators.required],
		senderLast: ["", [Validators.required, Validators.pattern(/^\w+$/)]],
		senderName: ["", Validators.required],
		//SSNumberSender: [""],
		zipcode: ["", Validators.required],
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

	public addNewSender() {
		if(!this.registerControls.valid) {
			return this.toast.error("Preencha todos os campos para continuar", "Preencha os campos")
		}
		if(!this.registerControls.get("acceptTerms").value) {
			return this.toast.error("Por favor, aceite os termos e condições de uso.", "Termos e Condições")
		}
		console.log(this.registerControls.getRawValue())
		this.toast.success("Agora seria feita a requisição para XpAddSender", "Formulário Válido!")
	}

	@HostListener("keydown.backspace", ["$event"])
	keyDownBackspace(event){
		if(event.target.id === "cellphone") {
			const phone = this.registerControls.get("cellphone").value.replace(/\D/g, '') as string
			if(phone.length <= 9) {
				this.registerControls.get("cellphone").setValue(phone.substring(0, phone.length - 1))
			}
		}
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