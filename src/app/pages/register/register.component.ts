import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerControls = this.fb.group({
		address: [""],
		city: [""],
		birthday: [""],
		docType: [""],
		email: [""],
		//idCountrySender: [""],
		//idTypeSender: [""],
		//owner: [""],
		phone: [""],
		//senderCard: [""],
		senderDoc: [""],
		senderLast: [""],
		senderName: [""],
		//SSNumberSender: [""],
		state: [""],
		zip: [""]
	})

  constructor(private geo: GeolocationService, private fb: FormBuilder) { }

	private onSuccess = (pos: any) => {
		const lat = pos.coords.latitude as number;
		const long = pos.coords.longitude as number;
		// this.geo.checkIfUserIsInNewJersey(lat, long).subscribe({
		// 	next: (res) => console.log(res)
		// })
	}

	private onError = (err: any) => {
		console.log(err)
	}

	private prompTeste(lat: string, long: string) {
		this.geo.checkIfUserIsInNewJersey(Number(lat), Number(long)).subscribe({
			next: (res) => {
				const estado = res.results[0].address_components[0].long_name
				alert("Coordenadas inseridas ficam no estado de: " + estado)
			}
		})
	}


	ngOnInit(): void {
		//navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError)
		let lat = "";
		let long = "";

		setTimeout(() => {
			lat = prompt("Digite a latitude")
			long = prompt("Digite a longitude")
			if(lat && long) {
				this.prompTeste(lat, long)
			}
		}, 1000)
	
	}
}

//AIzaSyD1tyIJwm0EKuzV-uwM-CTAiDqp-1G5Q_M
