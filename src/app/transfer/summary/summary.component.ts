import { Component } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TransferService } from '../../services/transfer/transfer.service';

import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal/modal.component';

import { SenderAccountService } from '../../services/sender-account/sender-account.service';
import { GeolocationService } from 'app/services/geolocation/geolocation.service';


@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  public receiver;
  public receiverAccount;
  public purpose;
  public amount;
  public currentLang;
  public linkInfo;
  public total;
  public senderAccount;
  public isLoading: Boolean = false;
  public message;
  public modalConfirm;

  public senderAccountPage = ['admin', 'senderAccount'];

  constructor(
    public session: SessionService,
    public router: Router,
    public translate: TranslateService,
    public transfer: TransferService,
    public toastr: ToastrService,
    public senderAccSvc: SenderAccountService,
		public geolocationService: GeolocationService
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
    this.receiver = this.session.get('currentReceiver');
    this.receiverAccount = this.session.get('currentReceiverAccount');
    this.purpose = this.session.get('currentPurpose');
    this.senderAccount = {
      aba: '000000000',
      account: '000000000000'
    };
    this.amount = {
      base: parseFloat(this.session.get('currentBase')).toFixed(2),
      send: parseFloat(this.session.get('currentSend')).toFixed(2)
    }
    this.linkInfo = this.session.get('linkInfo');
    this.linkInfo.rate = parseFloat(this.linkInfo.rate).toFixed(2)
    this.total = (parseFloat(this.amount.base) + parseFloat(this.linkInfo.ServiceFee)).toFixed(2);
    // this.senderAccSvc.getCurrent()
    //   .then((account) => {
    //     if (!account) {
    //       this.toastr.warning(this.translate.instant('NO_ACCOUNTS_REGISTERED'));
    //       return this.router.navigate(['admin', 'accounts']);
    //     }
    //     this.senderAccount = account
    //   });
  }

	public checkGeolocation() {
		navigator.geolocation.getCurrentPosition(this.onGeolocationSuccess, this.onGeolocationError)
	}

	private onGeolocationSuccess = (pos: any) => {
		const latitude = pos.coords.latitude;
		const longitude = pos.coords.longitude
		this.geolocationService.checkIfUserIsInNewJersey(latitude, longitude).subscribe({
			next: (res) => {
				const rootInfo = JSON.parse(this.session.get("rootInfo"))
				const validStates = rootInfo.ValidStates.split(",") as string[]
				const userState = res.results[0].address_components[0].short_name

				let isUserAllowedToTransfer = false;

				for(let state of validStates) {
					if(state === userState) {
						isUserAllowedToTransfer = true
						this.doTransfer()
						break
					}
				}
				if(!isUserAllowedToTransfer) {
					this.toastr.error(this.translate.instant("GEOLOCATION_WARNING") + validStates, this.translate.instant("ERROR"))
				}
			}
		})
	}

	private onGeolocationError = (err: any) => {
		if(err.code === 1) {
			this.toastr.error(this.translate.instant("GEOLOCATION_DENIED"), this.translate.instant("ERROR"))
		}
	}

  doTransfer() {
    this.isLoading = true;
    this.transfer.doTransfer(
      this.linkInfo.SessionKey,
      this.receiver.ReceiverID,
      this.receiverAccount.AcctId,
      this.amount.base,
      this.amount.send,
      this.purpose.PurposeId,
      this.senderAccount.account,
      this.senderAccount.aba,
      this.translate.currentLang || this.translate.defaultLang
    ).subscribe(
      (response: any) => {
        this.isLoading = false;
        const statusCode = Number(response.StatusCode);
        switch (statusCode) {
          case 1:
						this.session.set("total", this.total)
						this.session.set("externalID", response.SendMoney)
						this.router.navigate(['admin', 'transfer', 'payment']);
            //this.finishTransfer(response.SendMoney);
            break;
          case -2:
            this.session.clear();
            this.backToInit('SESSION_EXPIRED_TITLE', 'SESSION_EXPIRED_TEXT', 'login');
            break;
          case -4:
            this.backToInit('DAYLI_SENDER_EXCEEDED_TITLE', 'DAYLI_SENDER_EXCEEDED_TEXT');
            break;
          case -5:
            this.backToInit('DAYLI_RECEIVER_EXCEEDED_TITLE', 'DAYLI_RECEIVER_EXCEEDED_TEXT');
            break;
          case -8:
            this.backToInit('ERROR', response.SendMoney, 'login');
            break;
          case -9:
            this.backToInit('ERROR', 'BANK_LENGTH_ERROR', this.senderAccountPage);
            break;
          case -10:
            this.backToInit('ERROR', 'ABA_LENGTH_ERROR', this.senderAccountPage);
            break;
          default:
            const text = response.SessionResult || response.SendMoney || this.translate.instant('UNKNOWN_RESPONSE');
            this.message = `[${response.StatusCode}] ${text}`;
            break;
        }
      },
      (err) => {
        this.message = err.message;
        this.isLoading = false;
      },
    );
  }

  finishTransfer(text) {
    const title = this.translate.instant('SUCCESS');
    this.toastr.success(text, title);

    this.session.remove('currentReceiver');
    this.session.remove('currentReceiverAccount');
    this.session.remove('currentPurpose');
    this.session.remove('currentBase');
    this.session.remove('currentSend');
  }

  backToInit(title: string, text: string, page?: any) {
    this.toastr.error(this.translate.instant(text), this.translate.instant(title));
    if (page) {
      this.router.navigate(page);
    } else {
      this.router.navigate(['login']);
    }
  }
}
