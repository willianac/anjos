import { Component } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  public modalConfirm;
	public receiveCountry = "";

	public payoutOption = "";
	public payoutLocation = {};

	public rate;
	public exchPercentage;
	public userAcceptedCheckbox = false;

  constructor(
    public session: SessionService,
    public router: Router,
    public translate: TranslateService,
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
		this.rate = Number(this.linkInfo.Rate)
		this.exchPercentage = Number(this.linkInfo.ExchPerc)
    this.linkInfo.rate = parseFloat(this.linkInfo.rate).toFixed(2)
		this.total = this.calculateTotal()
		this.payoutOption = this.session.get("payoutOptionSelected")
		this.payoutLocation = this.session.get("payoutLocationSelected")
		this.receiveCountry = this.session.get("unitSelected").slice(0,2)
  }

	private calculateTotal() {
		if(this.rate > 1 ) {
			return (parseFloat(this.amount.base) + parseFloat(this.linkInfo.ServiceFee)).toFixed(2);
		} else {
			const exchange = parseFloat(this.amount.base) * this.exchPercentage / 100
			const newFee = exchange + parseFloat(this.linkInfo.ServiceFee)
			this.linkInfo.ServiceFee = newFee.toFixed(2)
			return (parseFloat(this.amount.base) + newFee).toFixed(2)
		}
	}

	public nextPage() {
		this.session.set("total", this.total)
		this.router.navigate(['admin', 'transfer', 'payment']);		
	}
}
