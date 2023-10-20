import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../services/login/login.service';
import { SessionService } from '../../services/session/session.service';
import { LanguageService } from '../../services/language/language.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent {

  public email;
  public isLoading: boolean = false;

  constructor(
    public translate: TranslateService,
    public login: LoginService,
    public session: SessionService,
    public language: LanguageService,
    private toastr: ToastrService
  ) {
    this.email = this.session.get('email') || '';
  }

  doRecover() {
    this.isLoading = true;
    if (!this.email) {
      this.isLoading = false;
      return false;
    }
    this.login.recoverPassword(this.email, this.language.get())
      .subscribe((response) => {
        const status = Number(response.StatusCode);
        this.isLoading = false;
        if (status !== 1) {
          this.toastr.error(response.SessionResult, this.translate.instant('ERROR'));
          return false;
        }
        this.toastr.success(response.SessionResult, this.translate.instant('SUCCESS'));
        this.email = '';
      });
  }


}
