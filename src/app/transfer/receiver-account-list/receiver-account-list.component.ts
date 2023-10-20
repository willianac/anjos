import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session/session.service';

@Component({
  selector: 'app-receiver-account-list',
  templateUrl: './receiver-account-list.component.html',
  styleUrls: ['./receiver-account-list.component.scss']
})
export class ReceiverAccountListComponent {

  public accountList;

  constructor(
    public session: SessionService,
    public router: Router,
  ) {
    this.accountList = this.getList(this.session.get('currentReceiver').ReceiverID);
  }

  sanitizeArray(list) {
    return [].concat(list) || null
  }

  getList(receiverId) {
    receiverId = receiverId.trim();
    const list = this.sanitizeArray(this.session.get('accountList'));
    const aux = [];
    for (const i in list) {
      if (list[i].ReceiverId.trim() === receiverId) {
        aux.push(list[i]);
      }
    }
    return aux;
  }

  select(account) {
    this.session.set('currentReceiverAccount', account);
    this.router.navigate(['admin', 'transfer', 'purposeList']);
  }

}
