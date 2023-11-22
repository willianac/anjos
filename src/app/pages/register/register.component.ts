import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	isUserAllowed = false;
  registerControls = this.fb.group({
		address: [""],
		city: [""],
		birthdate: [""],
		docType: [""],
		email: [""],
		//idCountrySender: [""],
		//idTypeSender: [""],
		//owner: [""],
		cellphone: [""],
		homephone: [""],
		//senderCard: [""],
		senderDoc: [""],
		senderLast: [""],
		senderName: [""],
		//SSNumberSender: [""],
		zipcode: [""]
	})

	stateList = [];
	idTypeList = [];

  constructor(
		private geo: GeolocationService, 
		private fb: FormBuilder,
		private newSenderService: NewSenderService
	) { }

	private onSuccess = (pos: any) => {
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

	private onError = (err: any) => {
		alert("Precisamos saber sua localização")
	}

	ngOnInit(): void {
		navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError)

		this.newSenderService.getSenderIdTypes().subscribe((res) => {
			this.idTypeList = res.IDTYPE
			console.log(this.idTypeList[0])
		})
	}
}