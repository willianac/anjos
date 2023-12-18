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

	public isLoading = false;

	public modalConfirm;
	public transferType = "";
	public hasBankDeposit = false;
	public hasCashPayment = false;

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
  }

	getNewSession() {
    const lang = this.translate.currentLang || this.translate.defaultLang;
    this.loginService.login(this.session.get('lastEmail'), this.session.get('lastPassword'), lang, "BRX")
      .subscribe({
        next: (response: any) => {
          const statusCode = Number(response.StatusCode);
          if (statusCode < 0) {
            this.toastr.error(`[${response.StatusCode}] ${response.SessionResult}`, this.translate.instant('UNKNOWN_ERROR'));
            this.router.navigate(['login']);
          } else {
            if (response && response.LinkInfo) {
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

		this.isLoading = true
		const lang = this.translate.currentLang || this.translate.defaultLang;
		this.loginService.login(this.session.get('lastEmail'), this.session.get('lastPassword'), lang, option).subscribe({
			next: (res) => this.handleSelectedUnitApiResponse(res)
		})
  }

	private handleSelectedUnitApiResponse(res: any) {
		this.linkInfo = res.LinkInfo
		this.convertBase()
		this.convertSend()
		this.session.set('linkInfo', res.LinkInfo);
		this.session.set("receiverList", res.MoneyReceivers.Receiver)
		this.session.set("accountList", res.MoneyReceivers.ReceiverBank)
		this.handlePayOptions(res.PayoutOptions)
		this.isLoading = false;
	}

	private handlePayOptions(payOptions: any) {
		if(payOptions.BankDep === "YES") this.hasBankDeposit = true;
		if(payOptions.CashPay === "YES") {
			this.hasCashPayment = true;
			this.session.set("payCities", payOptions.CashPayoutLocation)
		}
	}

	private createUnitsObject() {
		const units = (this.session.get("linkInfo").ListLandUnit as string).split(",")
		return units.map(unit => {
			return {
				unit: unit,
				flag: unit.slice(0,2)
			}
		})
	}

	public goNextPage() {
		this.select()

		if(this.transferType === "cash") {
			return this.router.navigate(['admin', 'transfer', 'cash-payment']);
		}
		this.router.navigate(['admin', 'transfer', 'receiver']);
	}

	ngOnInit(): void {
		this.units = this.createUnitsObject()
		this.getNewSession()
	}
}
