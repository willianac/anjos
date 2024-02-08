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

	public refreshAccountList() {
		this.accountList = JSON.parse(this.session.get("senderAccounts"))
		this.shouldDisplayForm = false;
	}

	public removeAccount(accName: string) {
		const updatedAccountList = this.accountList.filter(account => account.name !== accName)
		this.accountList = updatedAccountList
		this.session.set("senderAccounts", JSON.stringify(updatedAccountList))
	}

	ngOnInit(): void {
		this.accountList = JSON.parse(this.session.get("senderAccounts"))
	}
}
