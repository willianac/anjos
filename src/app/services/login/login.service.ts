import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class LoginService extends ConnectionService {

  constructor(public http: Http) {
    super(http);
  }

  public login(user: string, pass: string, lang: string, LandUnit: string) {
    return this.createRequest({
      LoginName: user,
      MyPassword: pass,
      lang: lang,
			LandUnit
    });
  }

  public recoverPassword(user: string, lang: string) {
    return this.createRequest({
      email: user,
      action: 'forgot',
      lang: lang
    });
  }

  public changePassword(currentPass: string, newPass: string, sessionKey: string, lang: string) {
    return this.createRequest({
      sessionkey: sessionKey,
      oldpsw: currentPass,
      newpsw: newPass,
      action: 'change',
      lang: lang
    });
  }

}
