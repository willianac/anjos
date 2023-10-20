import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SenderAccountService } from '../../services/sender-account/sender-account.service';
import { Account } from './account';


@Component({
  selector: 'app-sender-account-list',
  templateUrl: './sender-account-list.component.html',
  styleUrls: ['./sender-account-list.component.scss']
})
export class SenderAccountListComponent {

  public isLoading = false;
  public currentAccount: any;
  public accountList = [];
  public modeAdd = false;
  public newAccount = new Account();
  public message;
  public maskAba = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
  public maskAccount = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(
    public senderAccount: SenderAccountService,
    public translate: TranslateService
  ) {
    this.loadList();
  }

  selectAccount(account) {
    this.senderAccount.setCurrent(account);
    this.currentAccount = account;
  }

  deleteAccount(account) {
    this.senderAccount.delete(account._id)
      .then(() => this.loadList())
  }

  loadList() {
    this.isLoading = true;
    Promise.all([
      this.senderAccount.getCurrent(),
      this.senderAccount.list()
    ]).then((promises: any) => {
      this.currentAccount = promises[0] || null;
      this.accountList = promises[1] || null;
      this.isLoading = false;
    });
  }

  toggleAddMode() {
    this.modeAdd = !this.modeAdd;
  }

  addAccount() {
    this.clearMessage();
    const register = this.newAccount;
    const abaLength = 9;
    const accountMinLength = 9;
    const accountMaxLength = 12;

    if (!register.aba || register.aba.length <= 0) {
      this.message = this.translate.instant('BLANK_ABA');
      return false;
    }
    if (!register.account || register.account.length <= 0) {
      this.message = this.translate.instant('BLANK_ACCOUNT');
      return false;
    }

    register.aba = register.aba.replace(/\D+/g, '').substr(0, abaLength);
    register.account = register.account.replace(/\D+/g, '').substr(0, accountMaxLength);

    if (register.aba.length !== abaLength) {
      this.message = this.translate.instant('ABA_LENGTH_ERROR');
      return false;
    }
    if (register.account.length < accountMinLength || register.account.length > accountMaxLength) {
      this.message = this.translate.instant('BANK_LENGTH_ERROR');
      return false;
    }

    this.senderAccount.add(this.newAccount)
      .then(result => {
        this.loadList();
        this.toggleAddMode();
        this.newAccount = new Account();
      })
      .catch(err => this.message = err);
  }

  delete(account) {
    this.senderAccount.delete(account._id)
      .then(() => {
        this.loadList();
      });
  }

  clearMessage() {
    this.message = null;
  }
}
