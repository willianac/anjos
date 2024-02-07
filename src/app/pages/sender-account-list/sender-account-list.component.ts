import { Component } from '@angular/core';

@Component({
  selector: 'app-sender-account-list',
  templateUrl: './sender-account-list.component.html',
  styleUrls: ['./sender-account-list.component.scss']
})
export class SenderAccountListComponent {
	public sample = {
		address: "Sonnhaldenstrasse",
		buildingNumber: 19,
		city: "Heerbrugg",
		country: "CH",
		name: "Alpha Rheintal Bank",
		zip: 9435
	}
}
