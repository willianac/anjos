import { Component, OnInit } from '@angular/core';
import { SessionService } from 'app/services/session/session.service';
import { Account } from './account';

@Component({
  selector: 'app-sender-account-list',
  templateUrl: './sender-account-list.component.html',
  styleUrls: ['./sender-account-list.component.scss']
})
export class SenderAccountListComponent implements OnInit {
	shouldDisplayForm = false;
	accountList: Account[] = [];
	constructor(private session: SessionService) {}

	public sample = {
		address: "Sonnhaldenstrasse",
		buildingNumber: 19,
		city: "Heerbrugg",
		country: "CH",
		name: "Alpha Rheintal Bank",
		zip: 9435
	}

	public refreshAccountList() {
		this.accountList = JSON.parse(this.session.get("senderAccounts"))
		this.shouldDisplayForm = false;
	}

	ngOnInit(): void {
		this.accountList = JSON.parse(this.session.get("senderAccounts"))
	}
}
