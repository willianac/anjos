import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-receiver-list',
  templateUrl: './receiver-list.component.html',
  styleUrls: ['./receiver-list.component.scss']
})
export class ReceiverListComponent implements OnInit {

  public receiverList;
	public receiverListCountry = "";

  constructor(
    public session: SessionService,
    public router: Router
  ) {
    this.getList();
  }

  ngOnInit() {
		this.receiverListCountry = this.session.get("linkInfo").SendUnit.slice(0,2);
    this.getList();
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
		if(receiver === "undefined") return
		this.session.set('currentReceiver', receiver);
		this.router.navigate(['admin', 'transfer', 'receiverAccount']);
  }
}
