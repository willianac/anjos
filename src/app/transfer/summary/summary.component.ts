import { Component } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { TransferService } from '../../services/transfer/transfer.service';

import { ToastrService } from 'ngx-toastr';

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

	public payoutOption = "";
	public payoutLocation = {};

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
		this.payoutOption = this.session.get("payoutOptionSelected")
		this.payoutLocation = this.session.get("payoutLocation")
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

						this.session.set("total", this.total)
						this.router.navigate(['admin', 'transfer', 'payment']);		
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

  backToInit(title: string, text: string, page?: any) {
    this.toastr.error(this.translate.instant(text), this.translate.instant(title));
    if (page) {
      this.router.navigate(page);
    } else {
      this.router.navigate(['login']);
    }
  }
}
