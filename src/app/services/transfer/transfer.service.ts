import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class TransferService extends ConnectionService {

  constructor(public http: Http) {
    super(http);
  }

  public doTransfer(sessionKey, receiverId, acctId, amount, nacional, payorServId, senderBankAcct, senderBankAba, lang, paymentStatus) {
    const data = {
      SessionKey: sessionKey,
      ReceiverID: receiverId,
      AcctID: acctId,
      Amount: amount,
      Nacional: nacional,
      PayorServId: payorServId,
      SenderBankAcct: senderBankAcct,
      SenderBankAba: senderBankAba,
      lang: lang,
			PaidStatus: paymentStatus
    };
    return this.createRequest(data);
  }

}
