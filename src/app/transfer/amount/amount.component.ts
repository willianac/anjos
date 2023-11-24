import { Component } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

class Transfer {
  public base: string;
  public send: string;
}

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss']
})
export class AmountComponent {
  public transfer: Transfer = new Transfer();
  public linkInfo;
  public message;

  constructor(
    public session: SessionService,
    public router: Router,
    public translate: TranslateService
  ) {
    this.linkInfo = this.session.get('linkInfo');
    this.transfer.base = this.session.get('currentBase') || 0;
    this.transfer.send = this.session.get('currentSend') || 0;
   }

	 checkMaxSend(value: any) {
		if(Number(this.transfer.base) > this.linkInfo.MaxOrderAmount) {
			this.message = this.translate.instant("MAX_SEND_EXCEEDED", {unit: this.linkInfo.BaseUnit})
		}
	 }

  convertBase() {
    try {
      this.message = null;
      let number = parseFloat(this.transfer.base);
      let rate = parseFloat(this.linkInfo.Rate);

      if (isNaN(number))  {
        throw '';
      }
      if (!number || number <= 0) {
        throw '';
      }
      this.transfer.base = number.toFixed(2);
      this.transfer.send = (number*rate).toFixed(2);
    } catch(err) {
      this.message = this.translate.instant('INVALID_BASE');
    }
  }

  convertSend() {
    try {
      this.message = null;
      let number = parseFloat(this.transfer.send);
      let rate = parseFloat(this.linkInfo.Rate);

      if (isNaN(number))  {
        throw '';
      }
      if (!number || number <= 0) {
        throw '';
      }
      this.transfer.send = number.toFixed(2);
      this.transfer.base = (number/rate).toFixed(2);
    } catch(err) {
      this.message = this.translate.instant('INVALID_SEND');
    }
  }

  select() {
    let base = parseFloat(this.transfer.base);
    let send = parseFloat(this.transfer.send);
    if ((!base || !send) || (base <= 0 || send <= 0)) {
      this.message = this.translate.instant('INVALID_AMOUNT');
      return false;
    }
		if(base > this.linkInfo.MaxOrderAmount) {
			this.message = this.translate.instant("MAX_SEND_EXCEEDED", {unit: this.linkInfo.BaseUnit})
			return
		}
    this.session.set('currentBase', this.transfer.base);
    this.session.set('currentSend', this.transfer.send);
    this.router.navigate(['admin', 'transfer', 'receiver']);
  }
}
