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
	public hasBankDeposit = false;
	public hasCashPayment = false;
	public invalidValues = false

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

	 checkMaxSend() {
		if(Number(this.transfer.base) > this.linkInfo.MaxOrderAmount) {
			this.message = this.translate.instant("MAX_SEND_EXCEEDED", {unit: this.linkInfo.BaseUnit})
		}
	 }

	 public exceededMaxValue() {
		return Number(this.transfer.base) > Number(this.linkInfo.MaxOrderAmount) || Number(this.transfer.base) <= 0
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
			this.transfer.send = "0"
      this.invalidValues = true;
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
			this.transfer.base = "0"
      this.invalidValues = true;
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
		this.isLoading = true
		const allowedUnitsList = this.createUnitsObject()
    const lang = this.translate.currentLang || this.translate.defaultLang;
    this.loginService.login(this.session.get('lastEmail'), this.session.get('lastPassword'), lang, allowedUnitsList[0].unit)
      .subscribe({
        next: (response: any) => {
					this.handleSelectedUnitApiResponse(response)
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
					this.isLoading = false;
        }, 
        error: (err) => {
          this.toastr.error(this.translate.instant('CONNECTION_ERROR'));
					this.isLoading = false;
        }
      })
  }

	toggleDropdown() {
		if(this.units.length > 1) {
			this.showDropdown = !this.showDropdown
		}
	}

	selectUnit(option: string, optionToDisplay: string) {
		this.selectedUnit = optionToDisplay
		this.selectedFlag = option.slice(0,2)

		this.isLoading = true
		this.session.set("unitSelected", option)
		const lang = this.translate.currentLang || this.translate.defaultLang;
		this.loginService.login(this.session.get('lastEmail'), this.session.get('lastPassword'), lang, option).subscribe({
			next: (res) => this.handleSelectedUnitApiResponse(res),
			error: (err) => {
				this.toastr.error(this.translate.instant('UNKNOWN_ERROR'), this.translate.instant('ERROR'));
				this.isLoading = false;
			}
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
		//reset previous value
		this.hasBankDeposit = false;
		this.hasCashPayment = false;

		if(payOptions.BankDep === "YES") this.hasBankDeposit = true;
		if(payOptions.CashPay === "YES") {
			this.hasCashPayment = true;
		}
		this.session.set("payOptions", payOptions)
	}

	private createUnitsObject() {
		const units = (this.session.get("linkInfo").ListLandUnit as string).split(",")
		const showUnit = (this.session.get("linkInfo").ListSendUnit as string).split(",")
		return units.map((unit, index) => {
			return {
				unit: unit,
				showUnit: showUnit[index],
				flag: unit.slice(0,2)
			}
		})
	}

	private handleDefaultValues() {
		this.selectedUnit = this.units[0].showUnit
		this.selectedFlag = this.units[0].flag
	}

	public goNextPage(payoutSelected: string) {
		this.select()
		this.session.set("payoutOptionSelected", payoutSelected)
		
		this.router.navigate(['admin', 'transfer', 'receiver']);
	}

	ngOnInit(): void {
		this.units = this.createUnitsObject()
		this.handleDefaultValues()
		this.getNewSession()
	}
}
