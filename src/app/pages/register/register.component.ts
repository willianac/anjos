import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';
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
		cellphone: ["", Validators.required],
		homephone: [""],
		//senderCard: [""],
		senderDoc: ["", Validators.required],
		senderLast: ["", [Validators.required, Validators.pattern(/^\w+$/)]],
		senderName: ["", Validators.required],
		//SSNumberSender: [""],
		zipcode: ["", Validators.required]
	})

	stateList = [];
	idTypeList = [];

  constructor(
		private geo: GeolocationService, 
		private fb: FormBuilder,
		private newSenderService: NewSenderService,
		private toast: ToastrService
	) { }

	public addNewSender() {
		console.log(this.registerControls.getRawValue())
	}

	private onGeolocationSuccess = (pos: any) => {
		const lat = pos.coords.latitude as number;
		const long = pos.coords.longitude as number;

		// this.geo.checkIfUserIsInNewJersey(lat, long).subscribe({
		// 	next: (res) => {
		// 		const state = res.results[0].address_components[0].short_name;
		// 		if(state !== "NJ") {
		// 			alert("O cadastramento de usuários só é permitido no estado de Nova Jersey.")
		// 		} else {
		// 			this.isUserAllowed = true
		// 		}
		// 	}
		// })
	}

	private onGeolocationError = (err: any) => {
		alert("Precisamos saber sua localização")
	}

	ngOnInit(): void {
		// navigator.geolocation.getCurrentPosition(this.onGeolocationSuccess, this.onGeolocationError)

		this.newSenderService.getSenderIdTypes().subscribe((res) => {
			this.idTypeList = res.IDTYPE
		})

		this.toast.warning("Para cadastrar uma conta é preciso estar situado em Nova Jersey - USA", "Importante")
	}
}