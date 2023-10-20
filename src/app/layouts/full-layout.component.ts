import { Component } from '@angular/core';
import { SessionService } from '../services/session/session.service';
import { LanguageService, LANGUAGE_LIST, LanguageItem } from '../services/language/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent {

  public disabled = false;
  public status: {isopen: boolean} = {isopen: false};
  public currentLanguage: LanguageItem;
  public languageList = LANGUAGE_LIST;
  public clientLogo = window['ENVS'].CLIENT_LOGO;
  public displayName

  constructor(
    public session: SessionService,
    public language: LanguageService,
    public router: Router,
  ) {
    const sender = this.session.get('moneySender')
    this.displayName = `${sender.SenderFirstName} ${sender.SenderLastName}`;
    this.getCurrentLanguage();
  }

  public getCurrentLanguage() {
    this.currentLanguage = this.language.getCurrentLanguage();
  }

  public changeLanguage(lang: LanguageItem) {
    this.language.set(lang.code);
    this.currentLanguage = lang;
  }

  public doLogout() {
    const lastEmail = this.session.get('lastEmail');
    this.session.clear();
    this.session.set('lastEmail', lastEmail);
    this.router.navigate(['login']);
  }

}
