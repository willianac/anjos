import { Component, ElementRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../services/login/login.service';
import { SessionService } from '../../services/session/session.service';
import { LanguageService } from '../../services/language/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
	@ViewChild("currentPassInput") currentPassInput: ElementRef
	@ViewChild("newPassInput") newPassInput: ElementRef
	@ViewChild("confirmPassInput") confirmPassInput: ElementRef

	@ViewChild("minLength") minLengthRuleIcon: ElementRef;
	@ViewChild("hasUppercase") hasUppercaseRuleIcon: ElementRef;
	@ViewChild("hasDigit") hasDigitRuleIcon: ElementRef;

  public password = {
    current: '',
    new: '',
    confirm: ''
  };
  public linkInfo;
  public isLoading: boolean = false;

  constructor(
    public translate: TranslateService,
    public login: LoginService,
    public session: SessionService,
    public language: LanguageService,
    public toastr: ToastrService
  ) {
    this.linkInfo = this.session.get('linkInfo');
  }

  doChange() {
		if(!this.checkPassword()) return

    this.isLoading = true;
    if (this.password.new !== this.password.confirm) {
      let str = this.translate.instant('DIFFERENT_PASSWORDS');
      this.isLoading = false;
      return false;
    }
    this.login.changePassword(this.password.current, this.password.new, this.linkInfo.SessionKey, this.language.get())
      .subscribe((response) => {
        const status = Number(response.StatusCode);
        this.isLoading = false;
        if (status !== 1) {
          this.toastr.error(response.SessionResult, this.translate.instant('ERROR'));
          return false;
        }
        this.toastr.success(response.SessionResult, this.translate.instant('SUCCESS'));
        this.password = {
          current: '',
          new: '',
          confirm: ''
        };
      });
  }

	public handleInputsVisibility(target: any) {
		if(target.id === "current") {
			this.currentPassInput.nativeElement.type === "password"
			? this.currentPassInput.nativeElement.type = "text"
			: this.currentPassInput.nativeElement.type = "password"
		}	

		if(target.id === "new") {
			this.newPassInput.nativeElement.type === "password"
			? this.newPassInput.nativeElement.type = "text"
			: this.newPassInput.nativeElement.type = "password"
		}

		if(target.id === "confirm") {
			this.confirmPassInput.nativeElement.type === "password"
			? this.confirmPassInput.nativeElement.type = "text"
			: this.confirmPassInput.nativeElement.type = "password"
		}
	}

	public checkPassword() {
		const minLength = 10
		const hasUppercase = /[A-Z]/.test(this.password.new)
		const hasDigit = /[\d]/.test(this.password.new)

		if(this.password.new.length >= minLength) {
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
		
		return hasUppercase && hasDigit && this.password.new.length >= minLength
	}
}
