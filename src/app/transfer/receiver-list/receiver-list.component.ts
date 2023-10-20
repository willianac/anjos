import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../services/login/login.service';
import { ToastrService } from 'ngx-toastr';
import { SenderAccountService } from '../../services/sender-account/sender-account.service';

@Component({
  selector: 'app-receiver-list',
  templateUrl: './receiver-list.component.html',
  styleUrls: ['./receiver-list.component.scss']
})
export class ReceiverListComponent implements OnInit {

  public receiverList;

  constructor(
    public session: SessionService,
    public router: Router,
    public translate: TranslateService,
    public loginSvc: LoginService,
    public toastr: ToastrService,
    public senderAccSvc: SenderAccountService
  ) {
    this.getList();
  }

  ngOnInit() {
    this.checkAccount();
  }

  sanitizeArray(list) {
    if (!list) {
      return null;
    }
    return [].concat(list) || null;
  }

  getList() {
    const receiverSession = this.session.get('receiverList');
    this.receiverList = this.sanitizeArray(receiverSession);
  }

  select(receiver) {
    this.session.set('currentReceiver', receiver);
    this.router.navigate(['admin', 'transfer', 'receiverAccount']);
  }

  checkAccount() {
    this.senderAccSvc.getCurrent()
      .then((account) => {
        // if (!account) {
        //   this.toastr.warning(this.translate.instant('NO_ACCOUNTS_REGISTERED'));
        //   return this.router.navigate(['admin', 'accounts']);
        // }
      });
      this.getNewSession();
  }

  getNewSession() {
    const lang = this.translate.currentLang || this.translate.defaultLang;
    this.loginSvc.login(this.session.get('lastEmail'), this.session.get('lastPassword'), lang)
      .subscribe({
        next: (response: any) => {
          const statusCode = Number(response.StatusCode);
          if (statusCode < 0) {
            this.toastr.error(`[${response.StatusCode}] ${response.SessionResult}`, this.translate.instant('UNKNOWN_ERROR'));
            this.router.navigate(['login']);
          } else {
            if (response && response.LinkInfo) {
              this.session.set('linkInfo', response.LinkInfo);
            }
          }
        },
        error: (err) => {
          this.toastr.error(this.translate.instant('CONNECTION_ERROR'));
        }
      })
  }

}
