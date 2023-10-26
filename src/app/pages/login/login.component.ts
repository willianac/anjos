import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../services/language/language.service';
import { LoginService } from '../../services/login/login.service';
import { SessionService } from '../../services/session/session.service';
import { SenderAccountService } from '../../services/sender-account/sender-account.service';
import { SetupService } from 'app/services/setup/setup.service';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public isLoading = false;
  public loginInputs = {
    email: '',
    password: ''
  };
	public appSetup;

  constructor(
    public loginSvc: LoginService,
    public session: SessionService,
    public translate: TranslateService,
    public router: Router,
    public language: LanguageService,
    public toastr: ToastrService,
    public senderAccountSvc: SenderAccountService,
		public setupService: SetupService
  ) { }

  doLogin() {
    this.isLoading = true;
    const lang = this.language.get();
    this.loginSvc.login(this.loginInputs.email, this.loginInputs.password, lang)
    .subscribe((response) => {
      const statusCode = Number(response.StatusCode);
      if (statusCode < 0) {
        this.toastr.error(response.SessionResult, this.translate.instant('ERROR'));
      } else if (statusCode === 0) {
        if (response && response.MoneyReceivers && response.MoneyReceivers.Receiver) {
          this.session.set('receiverList', response.MoneyReceivers.Receiver);
        }
        if (response && response.MoneyReceivers && response.MoneyReceivers.ReceiverBank) {
          this.session.set('accountList', response.MoneyReceivers.ReceiverBank);
        }
        if (response && response.PurposeOfTransfer && response.PurposeOfTransfer.Purpose) {
          this.session.set('purposeList', response.PurposeOfTransfer.Purpose);
        }
        if (response && response.LinkInfo) {
          this.session.set('linkInfo', response.LinkInfo);
        }
        if (response && response.MoneySender) {
          this.session.set('moneySender', response.MoneySender);
        }
        this.session.set('lastEmail', this.loginInputs.email);
        this.session.set('currentEmail', this.loginInputs.email);
        this.session.set('lastPassword', this.loginInputs.password);
        this.senderAccountSvc.checkUser();
        this.router.navigate(['admin'])
      } else {
        this.toastr.error(this.translate.instant('UNKNOWN_ERROR'), this.translate.instant('ERROR'));
      }
      this.isLoading = false;
    },
    (err) => {
      this.isLoading = false;
      this.toastr.error(err.message, this.translate.instant('ERROR'));
    });
  }

	ngOnInit() {
		this.setupService.getSettings().subscribe((setup) => {
			this.appSetup = setup
		})
	}
}
