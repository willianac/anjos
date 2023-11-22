import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';
import { SessionService } from 'app/services/session/session.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	isUserAllowed = false;
  registerControls = this.fb.group({
		address: ["", Validators.required],
		city: ["", Validators.required],
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
		zipcode: ["", Validators.required]
	})
	
	idTypeList = [];
	registerPass = ""

  constructor(
		private geo: GeolocationService, 
		private fb: FormBuilder,
		private newSenderService: NewSenderService,
		private toast: ToastrService,
		private session: SessionService
	) { }

	public addNewSender() {
		if(!this.registerControls.valid) {
			return this.toast.error("Preencha todos os campos para continuar", "Preencha os campos")
		}
		this.toast.success("Agora seria feita a requisição para XpAddSender", "Formulário Válido!")
	}

	private onGeolocationSuccess = (pos: any) => {
		const lat = pos.coords.latitude as number;
		const long = pos.coords.longitude as number;

		this.geo.checkIfUserIsInNewJersey(lat, long).subscribe({
			next: (res) => {
				const state = res.results[0].address_components[0].short_name;
				if(state !== "RJ") {
					this.toast.error("O cadastramento de usuários só é permitido no estado de Nova Jersey.", "Erro")
				} else {
					this.isUserAllowed = true
				}
			}
		})
	}

	private onGeolocationError = (err: any) => {
		this.toast.warning("Precisamos da sua localização para prosseguir com o cadastramento", "Atenção")
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
		navigator.geolocation.getCurrentPosition(this.onGeolocationSuccess, this.onGeolocationError)

		this.newSenderService.getSenderIdTypes().subscribe((res) => {
			this.idTypeList = res.IDTYPE
		})

		this.registerPass = this.session.get("registerPass")

		this.toast.warning("Para cadastrar uma conta é preciso estar situado em Nova Jersey - USA", "Importante")
	}
}