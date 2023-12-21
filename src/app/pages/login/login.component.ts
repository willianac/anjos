import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from '../../services/language/language.service';
import { LoginService } from '../../services/login/login.service';
import { SessionService } from '../../services/session/session.service';
import { SenderAccountService } from '../../services/sender-account/sender-account.service';
import { SetupService } from 'app/services/setup/setup.service';
import { NewSenderService } from 'app/services/new-sender/new-sender.service';


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	@ViewChild("passwordInput") passwordInput: ElementRef;

	@ViewChild("minLength") minLengthRuleIcon: ElementRef;
	@ViewChild("hasUppercase") hasUppercaseRuleIcon: ElementRef;
	@ViewChild("hasDigit") hasDigitRuleIcon: ElementRef;

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
		public setupService: SetupService,
		public newSenderService: NewSenderService
  ) { }

  doLogin() {
    this.isLoading = true;
    const lang = this.language.get();
		const landUnit = JSON.parse(this.session.get("rootInfo")).StartUnit
    this.loginSvc.login(this.loginInputs.email, this.loginInputs.password, lang, landUnit)
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

				if(!response.MoneyReceivers.Receiver) {
					this.session.set('receiverList', "undefined")
					return this.router.navigate(['admin', 'transfer', 'new', 'receiver']);
				}

				if(this.loginInputs.password.length < 10) {
					this.router.navigate(['admin', 'changePassword']);
					return this.toastr.info(
						this.translate.instant("CHANGE_PASSWORD_RECOMENDATION"), 
						this.translate.instant("PROTECT_YOUR_ACCOUNT")
					)
				}

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

	public register() {
		if(!this.loginInputs.password || !this.loginInputs.email) {
			return this.toastr.error(this.translate.instant("FILL_ALL_FIELDS"), this.translate.instant("ERROR"))
		}
		if(!this.checkPassword()) return

		this.newSenderService.addNewRegister(this.loginInputs.email, this.loginInputs.password).subscribe({
			next: (res) => {
				if(res.Error) return this.handleResponseErrors(res.Message)
				const newRegisterSessionKey = res.SessionKey
				this.session.set("linkInfo", newRegisterSessionKey)
				this.session.set("registerPass", this.loginInputs.password)
				this.session.set("registerEmail", this.loginInputs.email)
				this.router.navigate(['/register'])
			}
		})
	}

	public handlePassInputVisibility(event: any) {
		const inputType = this.passwordInput.nativeElement.type
		
		inputType === "password" 
		? this.passwordInput.nativeElement.type = "text" 
		: this.passwordInput.nativeElement.type = "password"
	}

	private handleResponseErrors(err: string) {
		if(err === "New register failed email already exists") {
			return this.toastr.error(this.translate.instant("REGISTER_DUPLICATE_ERROR"), this.translate.instant("ERROR"))
		}
	}

	public checkPassword() {
		const minLength = 10
		const hasUppercase = /[A-Z]/.test(this.loginInputs.password)
		const hasDigit = /[\d]/.test(this.loginInputs.password)

		if(this.loginInputs.password.length >= minLength) {
			this.minLengthRuleIcon.nativeElement.classList.remove("fa-times", "fa");
			this.minLengthRuleIcon.nativeElement.classList.add("icon-check")
		} else {
			this.minLengthRuleIcon.nativeElement.classList.remove("icon-check");
			this.minLengthRuleIcon.nativeElement.classList.add("fa", "fa-times")
		}

		if(hasUppercase) {
			this.hasUppercaseRuleIcon.nativeElement.classList.remove("fa-times", "fa");
			this.hasUppercaseRuleIcon.nativeElement.classList.add("icon-check")
		} else {
			this.hasUppercaseRuleIcon.nativeElement.classList.remove("icon-check");
			this.hasUppercaseRuleIcon.nativeElement.classList.add("fa", "fa-times")
		}

		if(hasDigit) {
			this.hasDigitRuleIcon.nativeElement.classList.remove("fa-times", "fa");
			this.hasDigitRuleIcon.nativeElement.classList.add("icon-check")
		} else {
			this.hasDigitRuleIcon.nativeElement.classList.remove("icon-check");
			this.hasDigitRuleIcon.nativeElement.classList.add("fa", "fa-times")
		}
		
		return hasUppercase && hasDigit && this.loginInputs.password.length >= minLength
	}

	ngOnInit() {
		this.setupService.getSettings().subscribe((setup) => {
			this.appSetup = setup
		})
		this.setupService.getAPIRootSettings().subscribe({
			next: (res) => this.session.set("rootInfo", JSON.stringify(res))
		})
	}
}
