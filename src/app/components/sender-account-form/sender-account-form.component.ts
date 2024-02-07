import { Component, OnInit } from "@angular/core";
import { GeographyService } from "app/services/geography/geography.service";

@Component({
	selector: "senderAccountForm",
	templateUrl: "sender-account-form.component.html",
	styleUrls: ["sender-account-form.component.scss"]
})
export class SenderAccountForm implements OnInit {
	citiesList = []
	
	constructor(private geographyService: GeographyService) {}

	ngOnInit(): void {
		// this.geographyService.getAllCitiesWithinCountry("CH").subscribe({
		// 	next: (res) => this.citiesList = res.json()
		// })
	}
}