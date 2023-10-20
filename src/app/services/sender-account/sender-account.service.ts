import { Injectable } from '@angular/core';

import { LocalListService } from '../local-list/local-list.service';
import { SessionService } from '../session/session.service';


@Injectable()
export class SenderAccountService extends LocalListService {

  constructor(
    private session: SessionService
  ) {
    super('senderAccount');
    this.checkUser();
  }

  checkUser() {
    const lastEmail = this.session.get('lastEmail');
    this.changeCollection(lastEmail);
  }

  changeCollection(collection) {
    this.collection = collection;
  }

}
