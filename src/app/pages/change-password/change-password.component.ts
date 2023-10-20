import { Component } from '@angular/core';
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

}
