import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from 'app/services/login/login.service';
import { ToastrService } from 'ngx-toastr';

class Transfer {
  public base: string;
  public send: string;
}

@Component({
  selector: 'app-amount',
  templateUrl: './amount.component.html',
  styleUrls: ['./amount.component.scss']
})
export class AmountComponent implements OnInit {
  public transfer: Transfer = new Transfer();
  public linkInfo;
  public message;

	public units = [];
	public showDropdown = false;

	public selectedUnit = "";
	public selectedFlag = "";


  constructor(
    public session: SessionService,
		public loginService: LoginService,
		public toastr: ToastrService,
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

	getNewSession() {
    const lang = this.translate.currentLang || this.translate.defaultLang;
    this.loginService.login(this.session.get('lastEmail'), this.session.get('lastPassword'), lang)
      .subscribe({
        next: (response: any) => {
          const statusCode = Number(response.StatusCode);
          if (statusCode < 0) {
            this.toastr.error(`[${response.StatusCode}] ${response.SessionResult}`, this.translate.instant('UNKNOWN_ERROR'));
            this.router.navigate(['login']);
          } else {
            if (response && response.LinkInfo) {
							// if(!response.MoneyReceivers.Receiver) {
							// 	return this.router.navigate(['admin', 'transfer', 'new', 'receiver']);
							// }
              this.session.set('linkInfo', response.LinkInfo);
							this.session.set("receiverList", response.MoneyReceivers.Receiver)
							this.session.set("accountList", response.MoneyReceivers.ReceiverBank)
            }
          }
        }, 
        error: (err) => {
          this.toastr.error(this.translate.instant('CONNECTION_ERROR'));
        }
      })
  }

	toggleDropdown() {
		this.showDropdown = !this.showDropdown
	}

	selectUnit(option: string) {
		this.selectedUnit = option
		this.selectedFlag = option.slice(0,2)
  }

	private createUnitsObject() {
		const units = (JSON.parse(this.session.get("rootInfo")).ListLandUnit as string).split(",")
		return units.map(unit => {
			return {
				unit: unit,
				flag: unit.slice(0,2)
			}
		})
	}

	ngOnInit(): void {
		this.units = this.createUnitsObject()
		this.getNewSession()
	}
}
